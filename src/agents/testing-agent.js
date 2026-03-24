/**
 * Testing Agent - Comprehensive test suite management and execution
 * 
 * This agent provides:
 * - Automated test generation and execution
 * - Test coverage analysis and reporting
 * - Performance testing and benchmarking
 * - Integration and E2E test management
 * - Test result analysis and optimization
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class TestingAgent {
    constructor() {
        this.testFrameworks = this.detectTestFrameworks();
        this.testResults = [];
        this.coverageReports = [];
    }

    /**
     * Execute testing task
     */
    async execute(task, skills) {
        console.log(`🧪 Testing Agent: Starting testing task "${task.description}"`);

        try {
            const results = {
                task: task.description,
                timestamp: new Date().toISOString(),
                frameworksDetected: this.testFrameworks,
                testsExecuted: 0,
                testsPassed: 0,
                testsFailed: 0,
                coverage: 0,
                performanceMetrics: {},
                recommendations: [],
                detailedResults: []
            };

            // Analyze testing requirements
            const testType = this.analyzeTestType(task);

            switch (testType) {
                case 'unit':
                    results.detailedResults = await this.runUnitTests();
                    break;
                case 'integration':
                    results.detailedResults = await this.runIntegrationTests();
                    break;
                case 'e2e':
                    results.detailedResults = await this.runE2ETests();
                    break;
                case 'performance':
                    results.detailedResults = await this.runPerformanceTests();
                    break;
                case 'coverage':
                    results.detailedResults = await this.runCoverageAnalysis();
                    break;
                case 'all':
                    results.detailedResults = await this.runAllTests();
                    break;
                default:
                    results.detailedResults = await this.runDefaultTests();
            }

            // Calculate metrics
            results.testsExecuted = results.detailedResults.length;
            results.testsPassed = results.detailedResults.filter(r => r.status === 'passed').length;
            results.testsFailed = results.detailedResults.filter(r => r.status === 'failed').length;

            // Generate recommendations
            results.recommendations = this.generateTestingRecommendations(results);

            // Save test report
            await this.saveTestReport(results);

            this.testResults.push(results);

            return {
                status: 'completed',
                agent: 'testing-agent',
                results,
                summary: `Testing completed: ${results.testsPassed}/${results.testsExecuted} tests passed`
            };

        } catch (error) {
            console.error('❌ Testing Agent failed:', error);
            return {
                status: 'failed',
                agent: 'testing-agent',
                error: error.message
            };
        }
    }

    /**
     * Analyze test type from task description
     */
    analyzeTestType(task) {
        const description = task.description.toLowerCase();

        if (description.includes('unit') || description.includes('pytest') || description.includes('unittest')) {
            return 'unit';
        } else if (description.includes('integration') || description.includes('api test')) {
            return 'integration';
        } else if (description.includes('e2e') || description.includes('end-to-end') || description.includes('playwright')) {
            return 'e2e';
        } else if (description.includes('performance') || description.includes('benchmark') || description.includes('load test')) {
            return 'performance';
        } else if (description.includes('coverage') || description.includes('test coverage')) {
            return 'coverage';
        } else if (description.includes('all tests') || description.includes('full test suite')) {
            return 'all';
        } else {
            return 'default';
        }
    }

    /**
     * Detect available test frameworks
     */
    detectTestFrameworks() {
        const frameworks = [];

        // Check for Python frameworks
        if (this.fileExists('requirements.txt') || this.fileExists('pyproject.toml')) {
            frameworks.push('pytest', 'unittest');
        }

        // Check for JavaScript frameworks
        if (this.fileExists('package.json')) {
            frameworks.push('jest', 'mocha', 'vitest');
        }

        // Check for browser testing
        if (this.fileExists('playwright.config.js') || this.fileExists('cypress.json')) {
            frameworks.push('playwright', 'cypress');
        }

        return frameworks;
    }

    /**
     * Run unit tests
     */
    async runUnitTests() {
        const results = [];

        if (this.testFrameworks.includes('pytest')) {
            const pytestResult = await this.executeCommand('pytest --tb=short -v');
            results.push({
                framework: 'pytest',
                status: pytestResult.success ? 'passed' : 'failed',
                output: pytestResult.output,
                duration: pytestResult.duration
            });
        }

        if (this.testFrameworks.includes('unittest')) {
            const unittestResult = await this.executeCommand('python -m unittest discover -v');
            results.push({
                framework: 'unittest',
                status: unittestResult.success ? 'passed' : 'failed',
                output: unittestResult.output,
                duration: unittestResult.duration
            });
        }

        if (this.testFrameworks.includes('jest')) {
            const jestResult = await this.executeCommand('npm test -- --verbose');
            results.push({
                framework: 'jest',
                status: jestResult.success ? 'passed' : 'failed',
                output: jestResult.output,
                duration: jestResult.duration
            });
        }

        return results;
    }

    /**
     * Run integration tests
     */
    async runIntegrationTests() {
        const results = [];

        // Look for integration test directories
        const integrationDirs = ['tests/integration', 'integration_tests', 'api_tests'];

        for (const dir of integrationDirs) {
            if (await this.directoryExists(dir)) {
                const result = await this.executeCommand(`cd ${dir} && pytest -v`);
                results.push({
                    framework: 'integration-tests',
                    directory: dir,
                    status: result.success ? 'passed' : 'failed',
                    output: result.output,
                    duration: result.duration
                });
                break;
            }
        }

        return results;
    }

    /**
     * Run E2E tests
     */
    async runE2ETests() {
        const results = [];

        if (this.testFrameworks.includes('playwright')) {
            const playwrightResult = await this.executeCommand('npx playwright test --reporter=html');
            results.push({
                framework: 'playwright',
                status: playwrightResult.success ? 'passed' : 'failed',
                output: playwrightResult.output,
                duration: playwrightResult.duration
            });
        }

        if (this.testFrameworks.includes('cypress')) {
            const cypressResult = await this.executeCommand('npx cypress run');
            results.push({
                framework: 'cypress',
                status: cypressResult.success ? 'passed' : 'failed',
                output: cypressResult.output,
                duration: cypressResult.duration
            });
        }

        return results;
    }

    /**
     * Run performance tests
     */
    async runPerformanceTests() {
        const results = [];

        // Python performance testing
        if (this.testFrameworks.includes('pytest')) {
            const perfResult = await this.executeCommand('pytest --benchmark-only --benchmark-sort=mean');
            results.push({
                framework: 'pytest-benchmark',
                status: perfResult.success ? 'passed' : 'failed',
                output: perfResult.output,
                duration: perfResult.duration
            });
        }

        // JavaScript performance testing
        if (this.testFrameworks.includes('jest')) {
            const perfResult = await this.executeCommand('npm run test:perf');
            results.push({
                framework: 'jest-performance',
                status: perfResult.success ? 'passed' : 'failed',
                output: perfResult.output,
                duration: perfResult.duration
            });
        }

        return results;
    }

    /**
     * Run coverage analysis
     */
    async runCoverageAnalysis() {
        const results = [];

        if (this.testFrameworks.includes('pytest')) {
            const coverageResult = await this.executeCommand('pytest --cov=. --cov-report=html --cov-report=term');
            results.push({
                framework: 'pytest-cov',
                status: coverageResult.success ? 'passed' : 'failed',
                output: coverageResult.output,
                duration: coverageResult.duration
            });
        }

        if (this.testFrameworks.includes('jest')) {
            const coverageResult = await this.executeCommand('npm test -- --coverage');
            results.push({
                framework: 'jest-coverage',
                status: coverageResult.success ? 'passed' : 'failed',
                output: coverageResult.output,
                duration: coverageResult.duration
            });
        }

        return results;
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        const results = [];

        // Run unit tests
        results.push(...await this.runUnitTests());

        // Run integration tests
        results.push(...await this.runIntegrationTests());

        // Run E2E tests
        results.push(...await this.runE2ETests());

        // Run performance tests
        results.push(...await this.runPerformanceTests());

        // Run coverage analysis
        results.push(...await this.runCoverageAnalysis());

        return results;
    }

    /**
     * Run default tests
     */
    async runDefaultTests() {
        // Try to find and run the most appropriate test command
        if (this.testFrameworks.includes('pytest')) {
            return await this.runUnitTests();
        } else if (this.testFrameworks.includes('jest')) {
            return await this.runUnitTests();
        } else {
            return [{
                framework: 'default',
                status: 'skipped',
                output: 'No test frameworks detected',
                duration: 0
            }];
        }
    }

    /**
     * Execute command with timeout
     */
    executeCommand(command) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            exec(command, { timeout: 300000 }, (error, stdout, stderr) => {
                const duration = Date.now() - startTime;
                const success = error === null;
                const output = stdout + (stderr || '');

                resolve({
                    success,
                    output,
                    duration,
                    error: error?.message
                });
            });
        });
    }

    /**
     * Check if file exists
     */
    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if directory exists
     */
    async directoryExists(dirPath) {
        try {
            const stats = await fs.stat(dirPath);
            return stats.isDirectory();
        } catch {
            return false;
        }
    }

    /**
     * Generate testing recommendations
     */
    generateTestingRecommendations(results) {
        const recommendations = [];

        // Coverage recommendations
        if (results.coverage < 80) {
            recommendations.push({
                priority: 'high',
                category: 'coverage',
                title: 'Improve Test Coverage',
                description: `Current coverage is ${results.coverage}%. Aim for 80%+ coverage.`,
                actions: [
                    'Add tests for uncovered code paths',
                    'Focus on edge cases and error conditions',
                    'Use mutation testing to improve test quality'
                ]
            });
        }

        // Performance recommendations
        if (results.performanceMetrics.averageTime > 1000) {
            recommendations.push({
                priority: 'medium',
                category: 'performance',
                title: 'Optimize Test Performance',
                description: `Tests are running slowly (avg: ${results.performanceMetrics.averageTime}ms)`,
                actions: [
                    'Use fixtures to reduce setup time',
                    'Run tests in parallel when possible',
                    'Mock external dependencies'
                ]
            });
        }

        // Test quality recommendations
        if (results.testsFailed > 0) {
            recommendations.push({
                priority: 'high',
                category: 'quality',
                title: 'Fix Failing Tests',
                description: `${results.testsFailed} tests are failing`,
                actions: [
                    'Review and fix failing test cases',
                    'Ensure tests are deterministic',
                    'Check for flaky tests that need stabilization'
                ]
            });
        }

        return recommendations;
    }

    /**
     * Save test report
     */
    async saveTestReport(results) {
        const reportDir = path.join(process.cwd(), '.cline', 'reports', 'testing');
        await fs.mkdir(reportDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportFile = path.join(reportDir, `test-report-${timestamp}.json`);

        await fs.writeFile(reportFile, JSON.stringify(results, null, 2));
        console.log(`📄 Test report saved to: ${reportFile}`);
    }

    /**
     * Get agent status
     */
    getStatus() {
        return 'ready';
    }

    /**
     * Shutdown agent
     */
    async shutdown() {
        console.log('Testing Agent shutting down...');
        // Cleanup logic here
    }
}

module.exports = TestingAgent;