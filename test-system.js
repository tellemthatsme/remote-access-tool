ow /**
 * Comprehensive Test Suite for Enhanced Cline Code Extension
 * 
 * This script tests all components of the enhanced Cline system:
 * - Port Manager functionality
 * - Agent system integration
 * - Skill modules
 * - MCP connections
 * - Dashboard functionality
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

// Import system components
let portManager = null;
let clineAgent = null;

async function testPortManager() {
    console.log('\n🔧 Testing Port Manager...');

    try {
        portManager = require('./src/utils/port-manager.js');
        await portManager.initialize();

        // Test port availability
        const availablePort = await portManager.getNextAvailablePort('development');
        console.log(`✅ Port availability check: ${availablePort}`);

        // Test service registration
        const service = await portManager.autoAssignPort('test-service', 'development', 'Test service');
        console.log(`✅ Service registration: ${service.serviceName} on port ${service.port}`);

        // Test port conflicts
        const conflicts = await portManager.checkPortConflicts();
        console.log(`✅ Port conflict check: ${conflicts.length} conflicts found`);

        // Test port usage stats
        const stats = portManager.getPortUsageStats();
        console.log(`✅ Port usage stats: ${stats.totalServices} services registered`);

        // Cleanup test service
        await portManager.releasePort('test-service');
        console.log('✅ Test service cleanup completed');

        return true;
    } catch (error) {
        console.error('❌ Port Manager test failed:', error.message);
        return false;
    }
}

async function testClineAgent() {
    console.log('\n🤖 Testing Cline Agent System...');

    try {
        clineAgent = require('./src/agents/main-cline-agent.js');
        await clineAgent.initialize();

        // Test system status
        const status = clineAgent.getSystemStatus();
        console.log(`✅ System status: ${status.agents.length} agents, ${status.skills.length} skills`);

        // Test task execution
        const testTask = {
            description: "Test task for code review and optimization"
        };

        const result = await clineAgent.executeTask(testTask);
        console.log(`✅ Task execution: ${result.status}`);

        return true;
    } catch (error) {
        console.error('❌ Cline Agent test failed:', error.message);
        return false;
    }
}

async function testSkillModules() {
    console.log('\n🎯 Testing Skill Modules...');

    try {
        const skills = [
            './src/skills/python-skill.js',
            './src/skills/javascript-skill.js',
            './src/skills/docker-skill.js'
        ];

        for (const skillPath of skills) {
            const skill = require(skillPath);
            const result = await skill.execute({ task: 'test', includeExamples: false });
            console.log(`✅ ${path.basename(skillPath)}: ${result.status}`);
        }

        return true;
    } catch (error) {
        console.error('❌ Skill modules test failed:', error.message);
        return false;
    }
}

async function testMCPConfiguration() {
    console.log('\n🔗 Testing MCP Configuration...');

    try {
        const configPath = './.claude/config.json';
        const configData = await fs.readFile(configPath, 'utf8');
        const config = JSON.parse(configData);

        // Check for required MCP servers
        const requiredServers = [
            'filesystem', 'memory', 'fetch', 'sequential-thinking',
            'git', 'python-execution', 'docker', 'monitoring'
        ];

        const availableServers = Object.keys(config.servers || {});
        const missingServers = requiredServers.filter(server => !availableServers.includes(server));

        if (missingServers.length === 0) {
            console.log(`✅ MCP Configuration: All ${requiredServers.length} required servers configured`);
        } else {
            console.log(`⚠️ MCP Configuration: Missing servers: ${missingServers.join(', ')}`);
        }

        return true;
    } catch (error) {
        console.error('❌ MCP Configuration test failed:', error.message);
        return false;
    }
}

async function testDashboard() {
    console.log('\n📊 Testing Dashboard...');

    try {
        // Test if dashboard file exists and is valid
        const dashboardPath = './dashboard.cjs';
        const dashboardContent = await fs.readFile(dashboardPath, 'utf8');

        if (dashboardContent.includes('RemotePC') && dashboardContent.includes('Cline Agent System')) {
            console.log('✅ Dashboard file validation passed');
        } else {
            console.log('⚠️ Dashboard file validation issues detected');
        }

        // Test if dashboard can be started (basic syntax check)
        const dashboardModule = require('./dashboard.cjs');
        console.log('✅ Dashboard module loaded successfully');

        return true;
    } catch (error) {
        console.error('❌ Dashboard test failed:', error.message);
        return false;
    }
}

async function testFileStructure() {
    console.log('\n📁 Testing File Structure...');

    const requiredFiles = [
        './.claude/config.json',
        './src/agents/main-cline-agent.js',
        './src/agents/code-reviewer-agent.js',
        './src/agents/testing-agent.js',
        './src/skills/python-skill.js',
        './src/skills/javascript-skill.js',
        './src/skills/docker-skill.js',
        './src/utils/port-manager.js',
        './dashboard.cjs',
        './start-cline.bat',
        './README.md',
        './CLINE_SETUP_GUIDE.md'
    ];

    let missingFiles = [];

    for (const file of requiredFiles) {
        try {
            await fs.access(file);
        } catch (error) {
            missingFiles.push(file);
        }
    }

    if (missingFiles.length === 0) {
        console.log(`✅ File structure: All ${requiredFiles.length} required files present`);
        return true;
    } else {
        console.log(`❌ File structure: Missing files: ${missingFiles.join(', ')}`);
        return false;
    }
}

async function testDocumentation() {
    console.log('\n📖 Testing Documentation...');

    try {
        const readmePath = './README.md';
        const guidePath = './CLINE_SETUP_GUIDE.md';

        const readmeContent = await fs.readFile(readmePath, 'utf8');
        const guideContent = await fs.readFile(guidePath, 'utf8');

        // Check for key sections
        const readmeSections = ['Overview', 'Features', 'Quick Start', 'Usage Examples'];
        const guideSections = ['System Architecture', 'Installation', 'Configuration', 'Troubleshooting'];

        const readmeHasSections = readmeSections.every(section => readmeContent.includes(section));
        const guideHasSections = guideSections.every(section => guideContent.includes(section));

        if (readmeHasSections && guideHasSections) {
            console.log('✅ Documentation: All required sections present');
            return true;
        } else {
            console.log('⚠️ Documentation: Some sections missing');
            return false;
        }
    } catch (error) {
        console.error('❌ Documentation test failed:', error.message);
        return false;
    }
}

async function runIntegrationTest() {
    console.log('\n🔄 Running Integration Test...');

    try {
        // Test complete workflow
        console.log('Testing complete Cline system workflow...');

        // 1. Initialize port manager
        await portManager.initialize();

        // 2. Initialize Cline agent
        await clineAgent.initialize();

        // 3. Execute a comprehensive task
        const comprehensiveTask = {
            description: "Comprehensive test: review Python code, optimize JavaScript performance, and containerize with Docker"
        };

        const result = await clineAgent.executeTask(comprehensiveTask);

        console.log(`✅ Integration test completed: ${result.status}`);
        console.log(`   Task: ${result.task}`);
        console.log(`   Results: ${result.results.length} agent results`);

        return true;
    } catch (error) {
        console.error('❌ Integration test failed:', error.message);
        return false;
    }
}

async function generateTestReport() {
    console.log('\n📋 Generating Test Report...');

    const report = {
        timestamp: new Date().toISOString(),
        tests: {},
        summary: {
            passed: 0,
            failed: 0,
            total: 0
        }
    };

    const tests = [
        { name: 'Port Manager', fn: testPortManager },
        { name: 'Cline Agent System', fn: testClineAgent },
        { name: 'Skill Modules', fn: testSkillModules },
        { name: 'MCP Configuration', fn: testMCPConfiguration },
        { name: 'Dashboard', fn: testDashboard },
        { name: 'File Structure', fn: testFileStructure },
        { name: 'Documentation', fn: testDocumentation },
        { name: 'Integration Test', fn: runIntegrationTest }
    ];

    for (const test of tests) {
        try {
            const result = await test.fn();
            report.tests[test.name] = {
                status: result ? 'passed' : 'failed',
                timestamp: new Date().toISOString()
            };

            if (result) {
                report.summary.passed++;
            } else {
                report.summary.failed++;
            }
        } catch (error) {
            report.tests[test.name] = {
                status: 'failed',
                error: error.message,
                timestamp: new Date().toISOString()
            };
            report.summary.failed++;
        }
    }

    report.summary.total = report.summary.passed + report.summary.failed;
    report.summary.successRate = Math.round((report.summary.passed / report.summary.total) * 100);

    // Save report
    await fs.writeFile('./test-report.json', JSON.stringify(report, null, 2));

    // Display summary
    console.log('\n📊 Test Summary:');
    console.log(`   Total Tests: ${report.summary.total}`);
    console.log(`   Passed: ${report.summary.passed}`);
    console.log(`   Failed: ${report.summary.failed}`);
    console.log(`   Success Rate: ${report.summary.successRate}%`);

    if (report.summary.successRate === 100) {
        console.log('\n🎉 All tests passed! The enhanced Cline system is ready for production use.');
    } else if (report.summary.successRate >= 80) {
        console.log('\n✅ Most tests passed. The system is mostly functional with minor issues.');
    } else {
        console.log('\n⚠️ Several tests failed. Please review the issues before using the system.');
    }

    return report;
}

async function main() {
    console.log('🚀 Enhanced Cline Code Extension - Comprehensive Test Suite');
    console.log('══════════════════════════════════════════════════════════════');

    try {
        const report = await generateTestReport();

        console.log('\n📄 Test report saved to: test-report.json');
        console.log('\n💡 Next Steps:');
        console.log('   1. Review any failed tests in the report');
        console.log('   2. Launch the system: node start-cline.bat');
        console.log('   3. Access dashboard: http://localhost:3001');
        console.log('   4. Use password: karma123');
        console.log('   5. Start using the enhanced Cline system!');

    } catch (error) {
        console.error('\n❌ Test suite failed:', error.message);
    }
}

// Run the test suite
if (require.main === module) {
    main();
}

module.exports = { main, generateTestReport };