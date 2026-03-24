/**
 * Docker Skill Module - Containerization and Docker best practices
 * 
 * This skill provides expertise in:
 * - Docker containerization strategies
 * - Multi-stage builds and optimization
 * - Docker Compose orchestration
 * - Container security best practices
 * - CI/CD integration with containers
 */

const fs = require('fs').promises;
const path = require('path');

class DockerSkill {
    constructor() {
        this.bestPractices = this.loadBestPractices();
        this.codePatterns = this.loadCodePatterns();
        this.securityGuidelines = this.loadSecurityGuidelines();
    }

    /**
     * Execute Docker development task
     */
    async execute(context) {
        console.log(`🐳 Docker Skill: Executing task "${context.task}"`);

        try {
            const results = {
                task: context.task,
                timestamp: new Date().toISOString(),
                recommendations: [],
                codeExamples: [],
                bestPractices: [],
                securityNotes: []
            };

            // Analyze task type and provide appropriate guidance
            const taskType = this.analyzeTaskType(context.task);

            switch (taskType) {
                case 'containerization':
                    results.recommendations = this.getContainerizationRecommendations(context);
                    break;
                case 'optimization':
                    results.recommendations = this.getDockerOptimizationRecommendations(context);
                    break;
                case 'security':
                    results.recommendations = this.getDockerSecurityRecommendations(context);
                    break;
                case 'compose':
                    results.recommendations = this.getDockerComposeRecommendations(context);
                    break;
                case 'ci-cd':
                    results.recommendations = this.getDockerCICDRecommendations(context);
                    break;
                default:
                    results.recommendations = this.getDefaultDockerRecommendations(context);
            }

            // Generate code examples if requested
            if (context.includeExamples) {
                results.codeExamples = this.generateDockerCodeExamples(taskType, context);
            }

            // Add relevant best practices
            results.bestPractices = this.getRelevantDockerBestPractices(taskType);

            // Add security notes if applicable
            if (taskType !== 'security') {
                results.securityNotes = this.getDockerSecurityNotes(taskType);
            }

            return {
                status: 'completed',
                skill: 'docker',
                results,
                summary: `Docker skill executed successfully for ${taskType} task`
            };

        } catch (error) {
            console.error('❌ Docker Skill failed:', error);
            return {
                status: 'failed',
                skill: 'docker',
                error: error.message
            };
        }
    }

    /**
     * Analyze task type
     */
    analyzeTaskType(task) {
        const taskLower = task.toLowerCase();

        if (taskLower.includes('container') || taskLower.includes('dockerize')) {
            return 'containerization';
        } else if (taskLower.includes('optimize') || taskLower.includes('size') || taskLower.includes('build')) {
            return 'optimization';
        } else if (taskLower.includes('security') || taskLower.includes('vulnerability')) {
            return 'security';
        } else if (taskLower.includes('compose') || taskLower.includes('docker-compose')) {
            return 'compose';
        } else if (taskLower.includes('ci') || taskLower.includes('cd') || taskLower.includes('pipeline')) {
            return 'ci-cd';
        } else {
            return 'general';
        }
    }

    /**
     * Get containerization recommendations
     */
    getContainerizationRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Base Image Selection',
            priority: 'high',
            title: 'Choose Appropriate Base Images',
            description: 'Select minimal and secure base images',
            suggestions: [
                'Use official images from Docker Hub',
                'Prefer Alpine Linux for smaller footprint',
                'Use specific version tags instead of latest',
                'Consider distroless images for production'
            ]
        });

        recommendations.push({
            category: 'Layer Optimization',
            priority: 'high',
            title: 'Optimize Dockerfile Layers',
            description: 'Minimize layers and optimize build cache',
            suggestions: [
                'Combine related RUN commands',
                'Install dependencies before copying source',
                'Use .dockerignore to exclude unnecessary files',
                'Order instructions by frequency of change'
            ]
        });

        recommendations.push({
            category: 'Multi-stage Builds',
            priority: 'medium',
            title: 'Use Multi-stage Builds',
            description: 'Separate build and runtime environments',
            suggestions: [
                'Use builder stage for compilation',
                'Copy only necessary artifacts to final stage',
                'Remove build dependencies in final stage',
                'Use named stages for clarity'
            ]
        });

        return recommendations;
    }

    /**
     * Get Docker optimization recommendations
     */
    getDockerOptimizationRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Image Size',
            priority: 'high',
            title: 'Minimize Image Size',
            description: 'Reduce container image footprint',
            suggestions: [
                'Use multi-stage builds',
                'Remove package cache after installation',
                'Use .dockerignore effectively',
                'Choose minimal base images'
            ]
        });

        recommendations.push({
            category: 'Build Performance',
            priority: 'medium',
            title: 'Optimize Build Performance',
            description: 'Speed up Docker builds',
            suggestions: [
                'Leverage Docker build cache effectively',
                'Use parallel builds when possible',
                'Minimize context sent to Docker daemon',
                'Use build arguments for configuration'
            ]
        });

        recommendations.push({
            category: 'Runtime Performance',
            priority: 'medium',
            title: 'Optimize Runtime Performance',
            description: 'Improve container runtime efficiency',
            suggestions: [
                'Set appropriate resource limits',
                'Use health checks for monitoring',
                'Optimize entrypoint scripts',
                'Use volume mounts for persistent data'
            ]
        });

        return recommendations;
    }

    /**
     * Get Docker security recommendations
     */
    getDockerSecurityRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Image Security',
            priority: 'high',
            title: 'Secure Container Images',
            description: 'Ensure container images are secure',
            suggestions: [
                'Scan images for vulnerabilities',
                'Use minimal base images',
                'Keep images up to date',
                'Sign images with Docker Content Trust'
            ]
        });

        recommendations.push({
            category: 'Runtime Security',
            priority: 'high',
            title: 'Harden Container Runtime',
            description: 'Secure container runtime environment',
            suggestions: [
                'Run containers as non-root user',
                'Use read-only filesystem when possible',
                'Limit container capabilities',
                'Set appropriate resource limits'
            ]
        });

        recommendations.push({
            category: 'Network Security',
            priority: 'medium',
            title: 'Secure Container Networking',
            description: 'Implement secure networking practices',
            suggestions: [
                'Use custom networks for isolation',
                'Limit exposed ports',
                'Use secrets for sensitive data',
                'Implement network policies'
            ]
        });

        return recommendations;
    }

    /**
     * Get Docker Compose recommendations
     */
    getDockerComposeRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Service Definition',
            priority: 'high',
            title: 'Define Services Properly',
            description: 'Structure Docker Compose services correctly',
            suggestions: [
                'Use meaningful service names',
                'Define proper dependencies',
                'Set appropriate resource limits',
                'Use environment variables for configuration'
            ]
        });

        recommendations.push({
            category: 'Networking',
            priority: 'medium',
            title: 'Configure Networking',
            description: 'Set up container networking',
            suggestions: [
                'Use custom networks for isolation',
                'Define port mappings carefully',
                'Use aliases for service discovery',
                'Configure DNS settings if needed'
            ]
        });

        recommendations.push({
            category: 'Volumes and Storage',
            priority: 'medium',
            title: 'Manage Data Persistence',
            description: 'Handle data persistence properly',
            suggestions: [
                'Use named volumes for data',
                'Mount host directories when needed',
                'Configure volume permissions',
                'Backup important data volumes'
            ]
        });

        return recommendations;
    }

    /**
     * Get Docker CI/CD recommendations
     */
    getDockerCICDRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Build Automation',
            priority: 'high',
            title: 'Automate Docker Builds',
            description: 'Integrate Docker into CI/CD pipeline',
            suggestions: [
                'Build images in CI pipeline',
                'Tag images with version information',
                'Push to registry automatically',
                'Scan images for vulnerabilities'
            ]
        });

        recommendations.push({
            category: 'Deployment Strategy',
            priority: 'medium',
            title: 'Implement Deployment Strategy',
            description: 'Deploy containers safely',
            suggestions: [
                'Use blue-green or rolling deployments',
                'Implement health checks',
                'Configure rollback procedures',
                'Use environment-specific configurations'
            ]
        });

        recommendations.push({
            category: 'Registry Management',
            priority: 'medium',
            title: 'Manage Container Registry',
            description: 'Handle container image storage',
            suggestions: [
                'Use private registry for production',
                'Implement image retention policies',
                'Tag images consistently',
                'Monitor registry storage usage'
            ]
        });

        return recommendations;
    }

    /**
     * Get default Docker recommendations
     */
    getDefaultDockerRecommendations(context) {
        return [
            {
                category: 'General',
                priority: 'medium',
                title: 'Follow Docker Best Practices',
                description: 'Apply general Docker development best practices',
                suggestions: [
                    'Use .dockerignore files',
                    'Keep images minimal and focused',
                    'Use multi-stage builds',
                    'Implement proper logging'
                ]
            }
        ];
    }

    /**
     * Generate Docker code examples
     */
    generateDockerCodeExamples(taskType, context) {
        const examples = [];

        switch (taskType) {
            case 'containerization':
                examples.push({
                    title: 'Multi-stage Dockerfile',
                    code: `
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production
CMD ["node", "server.js"]
          `,
                    explanation: 'Multi-stage build separates build and runtime environments'
                });
                break;

            case 'optimization':
                examples.push({
                    title: 'Optimized Dockerfile',
                    code: `
FROM node:18-alpine

# Install dependencies only when needed
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Development image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV development

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "dev"]
          `,
                    explanation: 'Optimized layers and user permissions for development'
                });
                break;

            case 'compose':
                examples.push({
                    title: 'Docker Compose Configuration',
                    code: `
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
    depends_on:
      - db
    networks:
      - app-network
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

volumes:
  db_data:

networks:
  app-network:
    driver: bridge
          `,
                    explanation: 'Complete application stack with database and cache'
                });
                break;
        }

        return examples;
    }

    /**
     * Get relevant Docker best practices
     */
    getRelevantDockerBestPractices(taskType) {
        const practices = [];

        practices.push({
            title: 'Dockerfile Best Practices',
            description: 'Follow Dockerfile optimization guidelines',
            resources: ['https://docs.docker.com/develop/dev-best-practices/', 'https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/']
        });

        practices.push({
            title: 'Security Guidelines',
            description: 'Implement container security best practices',
            resources: ['https://docs.docker.com/develop/security-best-practices/', 'https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html']
        });

        practices.push({
            title: 'Multi-stage Builds',
            description: 'Use multi-stage builds for optimization',
            resources: ['https://docs.docker.com/build/building/multi-stage/', 'https://www.docker.com/blog/intro-guide-to-dockerfile-best-practices/']
        });

        return practices;
    }

    /**
     * Get Docker security notes
     */
    getDockerSecurityNotes(taskType) {
        const notes = [];

        notes.push({
            title: 'Non-root User',
            description: 'Always run containers as non-root user'
        });

        notes.push({
            title: 'Image Scanning',
            description: 'Scan images for vulnerabilities before deployment'
        });

        notes.push({
            title: 'Resource Limits',
            description: 'Set appropriate CPU and memory limits'
        });

        return notes;
    }

    /**
     * Load best practices
     */
    loadBestPractices() {
        return [
            {
                category: 'Containerization',
                rules: [
                    'Use minimal base images',
                    'Implement multi-stage builds',
                    'Use .dockerignore files',
                    'Set non-root user'
                ]
            },
            {
                category: 'Security',
                rules: [
                    'Scan images for vulnerabilities',
                    'Use read-only filesystems',
                    'Limit container capabilities',
                    'Set resource constraints'
                ]
            }
        ];
    }

    /**
     * Load code patterns
     */
    loadCodePatterns() {
        return [
            {
                name: 'Multi-stage Build',
                pattern: 'Separate build and runtime stages',
                example: 'FROM node:18-alpine AS builder\nFROM node:18-alpine AS production'
            },
            {
                name: 'Health Check',
                pattern: 'Add health check to container',
                example: 'HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000 || exit 1'
            }
        ];
    }

    /**
     * Load security guidelines
     */
    loadSecurityGuidelines() {
        return [
            {
                category: 'Image Security',
                guidelines: [
                    'Use official base images',
                    'Keep images updated',
                    'Scan for vulnerabilities',
                    'Sign images with DCT'
                ]
            },
            {
                category: 'Runtime Security',
                guidelines: [
                    'Run as non-root user',
                    'Use read-only filesystem',
                    'Limit capabilities',
                    'Set resource limits'
                ]
            }
        ];
    }

    /**
     * Get skill status
     */
    getStatus() {
        return 'ready';
    }
}

module.exports = DockerSkill;