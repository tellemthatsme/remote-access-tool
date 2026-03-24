/**
 * Port Manager - Comprehensive port management and registration system
 * 
 * This module provides:
 * - Port availability checking
 * - Port registration and tracking
 * - Automatic port assignment
 * - Port conflict resolution
 * - Service-to-port mapping
 */

const net = require('net');
const fs = require('fs').promises;
const path = require('path');

class PortManager {
    constructor() {
        this.portRegistry = new Map();
        this.portAssignments = new Map();
        this.configFile = path.join(__dirname, '../../config/ports.json');
        this.defaultRanges = {
            development: { start: 3000, end: 3999 },
            testing: { start: 4000, end: 4999 },
            production: { start: 5000, end: 5999 },
            monitoring: { start: 6000, end: 6999 },
            api: { start: 7000, end: 7999 },
            internal: { start: 8000, end: 8999 }
        };
    }

    /**
     * Initialize the port manager
     */
    async initialize() {
        try {
            await this.loadPortRegistry();
            console.log('✅ Port Manager initialized successfully');
        } catch (error) {
            console.warn('⚠️ Port Manager initialization failed, using defaults:', error.message);
            await this.initializeDefaultRegistry();
        }
    }

    /**
     * Load port registry from file
     */
    async loadPortRegistry() {
        try {
            const data = await fs.readFile(this.configFile, 'utf8');
            const registry = JSON.parse(data);

            // Load port assignments
            for (const [service, config] of Object.entries(registry.assignments || {})) {
                this.portAssignments.set(service, {
                    port: config.port,
                    environment: config.environment,
                    description: config.description,
                    lastUsed: config.lastUsed
                });
            }

            // Load port ranges
            for (const [rangeName, range] of Object.entries(registry.ranges || {})) {
                this.defaultRanges[rangeName] = range;
            }

            console.log(`📁 Loaded port registry: ${this.portAssignments.size} assignments`);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
            // File doesn't exist, use defaults
            await this.initializeDefaultRegistry();
        }
    }

    /**
     * Initialize default port registry
     */
    async initializeDefaultRegistry() {
        this.portAssignments.set('dashboard', {
            port: 3001,
            environment: 'development',
            description: 'Cline Dashboard Web Interface',
            lastUsed: new Date().toISOString()
        });

        this.portAssignments.set('api-server', {
            port: 3000,
            environment: 'development',
            description: 'Main API Server',
            lastUsed: new Date().toISOString()
        });

        this.portAssignments.set('monitoring', {
            port: 6001,
            environment: 'development',
            description: 'System Monitoring Service',
            lastUsed: new Date().toISOString()
        });

        await this.savePortRegistry();
    }

    /**
     * Save port registry to file
     */
    async savePortRegistry() {
        const registry = {
            assignments: Object.fromEntries(this.portAssignments),
            ranges: this.defaultRanges,
            lastUpdated: new Date().toISOString()
        };

        try {
            // Ensure config directory exists
            await fs.mkdir(path.dirname(this.configFile), { recursive: true });
            await fs.writeFile(this.configFile, JSON.stringify(registry, null, 2));
        } catch (error) {
            console.error('❌ Failed to save port registry:', error);
        }
    }

    /**
     * Check if a port is available
     */
    async isPortAvailable(port) {
        return new Promise((resolve) => {
            const server = net.createServer();

            server.listen(port, () => {
                server.once('close', () => {
                    resolve(true);
                });
                server.close();
            });

            server.on('error', () => {
                resolve(false);
            });
        });
    }

    /**
     * Get next available port in range
     */
    async getNextAvailablePort(rangeName = 'development') {
        const range = this.defaultRanges[rangeName];
        if (!range) {
            throw new Error(`Unknown port range: ${rangeName}`);
        }

        for (let port = range.start; port <= range.end; port++) {
            // Skip if already assigned
            if (this.portAssignments.has(port.toString())) {
                continue;
            }

            if (await this.isPortAvailable(port)) {
                return port;
            }
        }

        throw new Error(`No available ports in range ${range.start}-${range.end}`);
    }

    /**
     * Register a service with a specific port
     */
    async registerService(serviceName, port, environment = 'development', description = '') {
        // Check if port is available
        if (!(await this.isPortAvailable(port))) {
            throw new Error(`Port ${port} is already in use`);
        }

        // Check if service already exists
        const existing = this.portAssignments.get(serviceName);
        if (existing) {
            throw new Error(`Service ${serviceName} is already registered on port ${existing.port}`);
        }

        this.portAssignments.set(serviceName, {
            port,
            environment,
            description: description || `${serviceName} service`,
            lastUsed: new Date().toISOString()
        });

        await this.savePortRegistry();
        console.log(`✅ Registered ${serviceName} on port ${port}`);

        return { serviceName, port, environment };
    }

    /**
     * Auto-assign port for a service
     */
    async autoAssignPort(serviceName, environment = 'development', description = '') {
        // Check if service already exists
        const existing = this.portAssignments.get(serviceName);
        if (existing) {
            return existing;
        }

        const port = await this.getNextAvailablePort(environment);
        return await this.registerService(serviceName, port, environment, description);
    }

    /**
     * Get port for a service
     */
    getServicePort(serviceName) {
        const assignment = this.portAssignments.get(serviceName);
        if (!assignment) {
            throw new Error(`Service ${serviceName} not found in registry`);
        }
        return assignment.port;
    }

    /**
     * Get all service assignments
     */
    getAllAssignments() {
        return Object.fromEntries(this.portAssignments);
    }

    /**
     * Get services by environment
     */
    getServicesByEnvironment(environment) {
        const services = {};
        for (const [name, config] of this.portAssignments) {
            if (config.environment === environment) {
                services[name] = config;
            }
        }
        return services;
    }

    /**
     * Release a port (remove service assignment)
     */
    async releasePort(serviceName) {
        const assignment = this.portAssignments.get(serviceName);
        if (!assignment) {
            throw new Error(`Service ${serviceName} not found in registry`);
        }

        this.portAssignments.delete(serviceName);
        await this.savePortRegistry();
        console.log(`🔄 Released port ${assignment.port} for service ${serviceName}`);

        return assignment;
    }

    /**
     * Update service configuration
     */
    async updateService(serviceName, updates) {
        const assignment = this.portAssignments.get(serviceName);
        if (!assignment) {
            throw new Error(`Service ${serviceName} not found in registry`);
        }

        const updated = {
            ...assignment,
            ...updates,
            lastUsed: new Date().toISOString()
        };

        this.portAssignments.set(serviceName, updated);
        await this.savePortRegistry();

        console.log(`📝 Updated ${serviceName} configuration`);
        return updated;
    }

    /**
     * Check port conflicts
     */
    async checkPortConflicts() {
        const conflicts = [];
        const usedPorts = new Set();

        for (const [serviceName, config] of this.portAssignments) {
            if (usedPorts.has(config.port)) {
                conflicts.push({
                    port: config.port,
                    services: [serviceName],
                    type: 'duplicate_assignment'
                });
            } else {
                usedPorts.add(config.port);
            }

            // Check if port is actually in use
            if (!(await this.isPortAvailable(config.port))) {
                conflicts.push({
                    port: config.port,
                    services: [serviceName],
                    type: 'system_in_use'
                });
            }
        }

        return conflicts;
    }

    /**
     * Get port usage statistics
     */
    getPortUsageStats() {
        const stats = {
            totalServices: this.portAssignments.size,
            environments: {},
            ranges: {},
            conflicts: []
        };

        // Count by environment
        for (const [serviceName, config] of this.portAssignments) {
            stats.environments[config.environment] = (stats.environments[config.environment] || 0) + 1;
        }

        // Count by range
        for (const [rangeName, range] of Object.entries(this.defaultRanges)) {
            let count = 0;
            for (const [serviceName, config] of this.portAssignments) {
                if (config.port >= range.start && config.port <= range.end) {
                    count++;
                }
            }
            stats.ranges[rangeName] = {
                start: range.start,
                end: range.end,
                used: count,
                available: (range.end - range.start + 1) - count
            };
        }

        return stats;
    }

    /**
     * Cleanup unused ports
     */
    async cleanupUnusedPorts() {
        const unused = [];
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour

        for (const [serviceName, config] of this.portAssignments) {
            const lastUsed = new Date(config.lastUsed).getTime();
            if (now - lastUsed > oneHour) {
                unused.push(serviceName);
            }
        }

        for (const serviceName of unused) {
            await this.releasePort(serviceName);
        }

        console.log(`🧹 Cleaned up ${unused.length} unused services`);
        return unused;
    }

    /**
     * Reset port registry
     */
    async resetRegistry() {
        this.portAssignments.clear();
        await this.initializeDefaultRegistry();
        console.log('🔄 Port registry reset to defaults');
    }

    /**
     * Export port configuration
     */
    exportConfig() {
        return {
            assignments: this.getAllAssignments(),
            ranges: this.defaultRanges,
            stats: this.getPortUsageStats(),
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Import port configuration
     */
    async importConfig(config) {
        if (!config.assignments || !config.ranges) {
            throw new Error('Invalid configuration format');
        }

        this.portAssignments.clear();
        for (const [serviceName, assignment] of Object.entries(config.assignments)) {
            this.portAssignments.set(serviceName, assignment);
        }

        this.defaultRanges = { ...config.ranges };
        await this.savePortRegistry();

        console.log('📥 Port configuration imported successfully');
    }
}

// Export singleton instance
module.exports = new PortManager();