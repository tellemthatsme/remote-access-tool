/**
 * Code Reviewer Agent - Automated code quality and security analysis
 * 
 * This agent performs comprehensive code reviews including:
 * - Code quality analysis
 * - Security vulnerability detection
 * - Best practices enforcement
 * - Performance optimization suggestions
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class CodeReviewerAgent {
    constructor() {
        this.reviewHistory = [];
        this.securityPatterns = this.loadSecurityPatterns();
        this.qualityRules = this.loadQualityRules();
    }

    /**
     * Execute code review task
     */
    async execute(task, skills) {
        console.log(`🔍 Code Reviewer Agent: Starting review for task "${task.description}"`);

        try {
            const results = {
                task: task.description,
                timestamp: new Date().toISOString(),
                filesAnalyzed: 0,
                issuesFound: 0,
                securityIssues: 0,
                qualityIssues: 0,
                performanceIssues: 0,
                recommendations: [],
                detailedReport: []
            };

            // Analyze files mentioned in task
            const filesToReview = await this.identifyFilesToReview(task);

            for (const filePath of filesToReview) {
                const fileResults = await this.reviewFile(filePath);
                results.filesAnalyzed++;
                results.issuesFound += fileResults.issues.length;
                results.securityIssues += fileResults.securityIssues;
                results.qualityIssues += fileResults.qualityIssues;
                results.performanceIssues += fileResults.performanceIssues;
                results.detailedReport.push(...fileResults.issues);
            }

            // Generate recommendations
            results.recommendations = this.generateRecommendations(results);

            // Save review report
            await this.saveReviewReport(results);

            this.reviewHistory.push(results);

            return {
                status: 'completed',
                agent: 'code-reviewer',
                results,
                summary: `Reviewed ${results.filesAnalyzed} files, found ${results.issuesFound} issues`
            };

        } catch (error) {
            console.error('❌ Code Reviewer Agent failed:', error);
            return {
                status: 'failed',
                agent: 'code-reviewer',
                error: error.message
            };
        }
    }

    /**
     * Identify files that need to be reviewed
     */
    async identifyFilesToReview(task) {
        const files = [];

        // Extract file paths from task description
        const filePattern = /(?:file|path|src|lib)[:]?\s*([^\s\n]+)/gi;
        let match;

        while ((match = filePattern.exec(task.description)) !== null) {
            files.push(match[1]);
        }

        // If no specific files mentioned, review recent changes
        if (files.length === 0) {
            try {
                const recentFiles = await this.getRecentChangedFiles();
                files.push(...recentFiles);
            } catch (error) {
                console.warn('Could not get recent files:', error.message);
            }
        }

        // Filter valid files
        const validFiles = [];
        for (const file of files) {
            try {
                await fs.access(file);
                validFiles.push(file);
            } catch (error) {
                console.warn(`File not found: ${file}`);
            }
        }

        return validFiles;
    }

    /**
     * Get recently changed files from git
     */
    async getRecentChangedFiles() {
        return new Promise((resolve, reject) => {
            exec('git diff --name-only HEAD~1', (error, stdout) => {
                if (error) {
                    reject(error);
                    return;
                }

                const files = stdout.trim().split('\n').filter(f => f.length > 0);
                resolve(files);
            });
        });
    }

    /**
     * Review a single file
     */
    async reviewFile(filePath) {
        const content = await fs.readFile(filePath, 'utf8');
        const issues = [];

        // Security analysis
        const securityIssues = this.analyzeSecurity(content, filePath);
        issues.push(...securityIssues);

        // Quality analysis
        const qualityIssues = this.analyzeQuality(content, filePath);
        issues.push(...qualityIssues);

        // Performance analysis
        const performanceIssues = this.analyzePerformance(content, filePath);
        issues.push(...performanceIssues);

        return {
            file: filePath,
            issues,
            securityIssues: securityIssues.length,
            qualityIssues: qualityIssues.length,
            performanceIssues: performanceIssues.length
        };
    }

    /**
     * Analyze security vulnerabilities
     */
    analyzeSecurity(content, filePath) {
        const issues = [];
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            // Check for SQL injection vulnerabilities
            if (line.includes('SELECT') && line.includes('${') && line.includes('}')) {
                issues.push({
                    type: 'security',
                    severity: 'high',
                    line: index + 1,
                    issue: 'Potential SQL injection vulnerability',
                    description: 'Dynamic SQL query with string interpolation detected',
                    suggestion: 'Use parameterized queries or prepared statements'
                });
            }

            // Check for hardcoded secrets
            if (line.match(/(?:password|secret|key|token)\s*[=:]\s*['"][^'"]{8,}/i)) {
                issues.push({
                    type: 'security',
                    severity: 'high',
                    line: index + 1,
                    issue: 'Hardcoded secret detected',
                    description: 'Hardcoded credentials or secrets found in code',
                    suggestion: 'Use environment variables or secure configuration management'
                });
            }

            // Check for eval usage
            if (line.includes('eval(') || line.includes('Function(')) {
                issues.push({
                    type: 'security',
                    severity: 'high',
                    line: index + 1,
                    issue: 'Dangerous eval() usage',
                    description: 'Dynamic code execution detected',
                    suggestion: 'Avoid eval() and use safer alternatives'
                });
            }

            // Check for XSS vulnerabilities
            if (line.includes('innerHTML') && line.includes('${')) {
                issues.push({
                    type: 'security',
                    severity: 'medium',
                    line: index + 1,
                    issue: 'Potential XSS vulnerability',
                    description: 'Unescaped content inserted into DOM',
                    suggestion: 'Sanitize user input before inserting into DOM'
                });
            }
        });

        return issues;
    }

    /**
     * Analyze code quality
     */
    analyzeQuality(content, filePath) {
        const issues = [];
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            // Check for long lines
            if (line.length > 120) {
                issues.push({
                    type: 'quality',
                    severity: 'low',
                    line: index + 1,
                    issue: 'Line too long',
                    description: `Line exceeds 120 characters (${line.length} chars)`,
                    suggestion: 'Break long lines for better readability'
                });
            }

            // Check for console.log in production code
            if (line.includes('console.log') && !filePath.includes('test') && !filePath.includes('spec')) {
                issues.push({
                    type: 'quality',
                    severity: 'low',
                    line: index + 1,
                    issue: 'Console.log found',
                    description: 'Debug statement in production code',
                    suggestion: 'Remove or replace with proper logging'
                });
            }

            // Check for TODO comments
            if (line.includes('TODO') || line.includes('FIXME')) {
                issues.push({
                    type: 'quality',
                    severity: 'medium',
                    line: index + 1,
                    issue: 'TODO/FIXME comment',
                    description: 'Incomplete implementation or known issue',
                    suggestion: 'Address TODO items or create tracking tickets'
                });
            }

            // Check for empty catch blocks
            if (line.includes('catch') && lines[index + 1] && lines[index + 1].trim() === '}') {
                issues.push({
                    type: 'quality',
                    severity: 'medium',
                    line: index + 1,
                    issue: 'Empty catch block',
                    description: 'Exception handling without proper error handling',
                    suggestion: 'Add proper error handling or logging'
                });
            }
        });

        return issues;
    }

    /**
     * Analyze performance issues
     */
    analyzePerformance(content, filePath) {
        const issues = [];
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            // Check for inefficient loops
            if (line.includes('for') && line.includes('length') && !line.includes('const')) {
                issues.push({
                    type: 'performance',
                    severity: 'medium',
                    line: index + 1,
                    issue: 'Inefficient loop',
                    description: 'Loop recalculating length on each iteration',
                    suggestion: 'Cache array length in a variable'
                });
            }

            // Check for synchronous operations in async context
            if (line.includes('readFileSync') || line.includes('writeFileSync')) {
                issues.push({
                    type: 'performance',
                    severity: 'medium',
                    line: index + 1,
                    issue: 'Synchronous file operation',
                    description: 'Blocking file operation in async context',
                    suggestion: 'Use async file operations to prevent blocking'
                });
            }

            // Check for excessive DOM queries
            if (line.includes('document.getElementById') || line.includes('document.querySelector')) {
                issues.push({
                    type: 'performance',
                    severity: 'low',
                    line: index + 1,
                    issue: 'DOM query in loop',
                    description: 'DOM queries should be cached outside loops',
                    suggestion: 'Cache DOM elements in variables'
                });
            }
        });

        return issues;
    }

    /**
     * Generate recommendations based on review results
     */
    generateRecommendations(results) {
        const recommendations = [];

        if (results.securityIssues > 0) {
            recommendations.push({
                priority: 'high',
                category: 'security',
                title: 'Address Security Vulnerabilities',
                description: `${results.securityIssues} security issues found`,
                actions: [
                    'Review and fix all security vulnerabilities',
                    'Implement secure coding practices',
                    'Use security scanning tools in CI/CD pipeline'
                ]
            });
        }

        if (results.qualityIssues > 10) {
            recommendations.push({
                priority: 'medium',
                category: 'quality',
                title: 'Improve Code Quality',
                description: 'Multiple code quality issues detected',
                actions: [
                    'Establish coding standards and guidelines',
                    'Implement automated code quality checks',
                    'Conduct regular code reviews'
                ]
            });
        }

        if (results.performanceIssues > 5) {
            recommendations.push({
                priority: 'medium',
                category: 'performance',
                title: 'Optimize Performance',
                description: 'Performance bottlenecks identified',
                actions: [
                    'Profile application performance',
                    'Optimize critical code paths',
                    'Implement caching strategies'
                ]
            });
        }

        return recommendations;
    }

    /**
     * Save review report to file
     */
    async saveReviewReport(results) {
        const reportDir = path.join(process.cwd(), '.cline', 'reports');
        await fs.mkdir(reportDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportFile = path.join(reportDir, `code-review-${timestamp}.json`);

        await fs.writeFile(reportFile, JSON.stringify(results, null, 2));
        console.log(`📄 Code review report saved to: ${reportFile}`);
    }

    /**
     * Load security patterns for analysis
     */
    loadSecurityPatterns() {
        return [
            {
                pattern: /password\s*[=:]\s*['"][^'"]{8,}/i,
                severity: 'high',
                description: 'Hardcoded password detected'
            },
            {
                pattern: /api[_-]?key\s*[=:]\s*['"][^'"]{8,}/i,
                severity: 'high',
                description: 'Hardcoded API key detected'
            },
            {
                pattern: /eval\s*\(/i,
                severity: 'high',
                description: 'Dangerous eval() usage'
            },
            {
                pattern: /innerHTML\s*=/i,
                severity: 'medium',
                description: 'Potential XSS vulnerability'
            }
        ];
    }

    /**
     * Load quality rules for analysis
     */
    loadQualityRules() {
        return [
            {
                pattern: /console\.log/i,
                severity: 'low',
                description: 'Debug statement in production code'
            },
            {
                pattern: /TODO|FIXME/i,
                severity: 'medium',
                description: 'Incomplete implementation'
            },
            {
                pattern: /catch\s*\(\s*\)\s*{[\s]*}/,
                severity: 'medium',
                description: 'Empty catch block'
            }
        ];
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
        console.log('Code Reviewer Agent shutting down...');
        // Cleanup logic here
    }
}

module.exports = CodeReviewerAgent;