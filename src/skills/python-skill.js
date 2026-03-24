/**
 * Python Skill Module - Advanced Python development patterns and best practices
 * 
 * This skill provides expertise in:
 * - Python best practices and conventions
 * - Modern Python features and syntax
 * - Performance optimization techniques
 * - Security best practices
 * - Testing and debugging strategies
 */

const fs = require('fs').promises;
const path = require('path');

class PythonSkill {
    constructor() {
        this.bestPractices = this.loadBestPractices();
        this.codePatterns = this.loadCodePatterns();
        this.securityGuidelines = this.loadSecurityGuidelines();
    }

    /**
     * Execute Python development task
     */
    async execute(context) {
        console.log(`🐍 Python Skill: Executing task "${context.task}"`);

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
                case 'code-review':
                    results.recommendations = this.getCodeReviewRecommendations(context);
                    break;
                case 'optimization':
                    results.recommendations = this.getOptimizationRecommendations(context);
                    break;
                case 'security':
                    results.recommendations = this.getSecurityRecommendations(context);
                    break;
                case 'best-practices':
                    results.recommendations = this.getBestPracticesRecommendations(context);
                    break;
                case 'testing':
                    results.recommendations = this.getTestingRecommendations(context);
                    break;
                default:
                    results.recommendations = this.getDefaultRecommendations(context);
            }

            // Generate code examples if requested
            if (context.includeExamples) {
                results.codeExamples = this.generateCodeExamples(taskType, context);
            }

            // Add relevant best practices
            results.bestPractices = this.getRelevantBestPractices(taskType);

            // Add security notes if applicable
            if (taskType !== 'security') {
                results.securityNotes = this.getSecurityNotes(taskType);
            }

            return {
                status: 'completed',
                skill: 'python-pro',
                results,
                summary: `Python skill executed successfully for ${taskType} task`
            };

        } catch (error) {
            console.error('❌ Python Skill failed:', error);
            return {
                status: 'failed',
                skill: 'python-pro',
                error: error.message
            };
        }
    }

    /**
     * Analyze task type
     */
    analyzeTaskType(task) {
        const taskLower = task.toLowerCase();

        if (taskLower.includes('review') || taskLower.includes('analyze')) {
            return 'code-review';
        } else if (taskLower.includes('optimize') || taskLower.includes('performance')) {
            return 'optimization';
        } else if (taskLower.includes('security') || taskLower.includes('vulnerability')) {
            return 'security';
        } else if (taskLower.includes('best practice') || taskLower.includes('convention')) {
            return 'best-practices';
        } else if (taskLower.includes('test') || taskLower.includes('pytest')) {
            return 'testing';
        } else {
            return 'general';
        }
    }

    /**
     * Get code review recommendations
     */
    getCodeReviewRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Code Quality',
            priority: 'high',
            title: 'Follow PEP 8 Style Guide',
            description: 'Ensure code follows Python Enhancement Proposal 8 (PEP 8) style guidelines',
            suggestions: [
                'Use 4 spaces for indentation',
                'Limit lines to 79 characters',
                'Use meaningful variable and function names',
                'Import modules in the correct order'
            ]
        });

        recommendations.push({
            category: 'Function Design',
            priority: 'medium',
            title: 'Keep Functions Focused',
            description: 'Functions should do one thing and do it well',
            suggestions: [
                'Limit function length to 20-30 lines',
                'Use descriptive function names',
                'Limit function parameters to 3-4',
                'Use type hints for better code documentation'
            ]
        });

        recommendations.push({
            category: 'Error Handling',
            priority: 'high',
            title: 'Implement Proper Error Handling',
            description: 'Handle exceptions appropriately and provide meaningful error messages',
            suggestions: [
                'Use specific exception types',
                'Don\'t catch all exceptions with bare except:',
                'Provide context in error messages',
                'Use context managers for resource management'
            ]
        });

        return recommendations;
    }

    /**
     * Get optimization recommendations
     */
    getOptimizationRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Performance',
            priority: 'high',
            title: 'Use Built-in Functions and Libraries',
            description: 'Built-in functions are optimized and faster than custom implementations',
            suggestions: [
                'Use list comprehensions instead of for loops when appropriate',
                'Use built-in functions like map(), filter(), and reduce()',
                'Use collections.Counter for counting elements',
                'Use itertools for efficient iteration patterns'
            ]
        });

        recommendations.push({
            category: 'Memory Management',
            priority: 'medium',
            title: 'Optimize Memory Usage',
            description: 'Reduce memory footprint and improve garbage collection',
            suggestions: [
                'Use generators for large datasets',
                'Use __slots__ for classes with many instances',
                'Avoid creating unnecessary copies of data',
                'Use del to explicitly delete large objects'
            ]
        });

        recommendations.push({
            category: 'Algorithm Efficiency',
            priority: 'high',
            title: 'Choose Appropriate Data Structures',
            description: 'Select data structures based on access patterns and operations',
            suggestions: [
                'Use sets for membership testing',
                'Use dictionaries for key-value lookups',
                'Use collections.deque for queue operations',
                'Use heapq for priority queues'
            ]
        });

        return recommendations;
    }

    /**
     * Get security recommendations
     */
    getSecurityRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Input Validation',
            priority: 'high',
            title: 'Validate All Inputs',
            description: 'Never trust user input - always validate and sanitize',
            suggestions: [
                'Use type hints and runtime validation',
                'Validate input length and format',
                'Sanitize user input before processing',
                'Use parameterized queries for database operations'
            ]
        });

        recommendations.push({
            category: 'Secure Coding',
            priority: 'high',
            title: 'Follow Secure Coding Practices',
            description: 'Implement security best practices in all code',
            suggestions: [
                'Never hardcode secrets or keys in code',
                'Use environment variables for configuration',
                'Implement proper authentication and authorization',
                'Use HTTPS for all network communications'
            ]
        });

        recommendations.push({
            category: 'Dependency Management',
            priority: 'medium',
            title: 'Manage Dependencies Securely',
            description: 'Keep dependencies up to date and secure',
            suggestions: [
                'Pin dependency versions in requirements.txt',
                'Regularly update dependencies',
                'Use virtual environments',
                'Audit dependencies for known vulnerabilities'
            ]
        });

        return recommendations;
    }

    /**
     * Get best practices recommendations
     */
    getBestPracticesRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Code Organization',
            priority: 'medium',
            title: 'Follow Python Conventions',
            description: 'Organize code following Python community standards',
            suggestions: [
                'Use meaningful package and module names',
                'Follow the single responsibility principle',
                'Use __init__.py files appropriately',
                'Document public APIs with docstrings'
            ]
        });

        recommendations.push({
            category: 'Version Control',
            priority: 'low',
            title: 'Use Git Best Practices',
            description: 'Follow Git workflow best practices',
            suggestions: [
                'Write meaningful commit messages',
                'Use .gitignore for generated files',
                'Create feature branches for new development',
                'Use pull requests for code review'
            ]
        });

        return recommendations;
    }

    /**
     * Get testing recommendations
     */
    getTestingRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Test Structure',
            priority: 'high',
            title: 'Follow Testing Best Practices',
            description: 'Implement comprehensive testing strategy',
            suggestions: [
                'Use pytest for testing framework',
                'Follow AAA pattern (Arrange, Act, Assert)',
                'Test both positive and negative cases',
                'Use fixtures for test data setup'
            ]
        });

        recommendations.push({
            category: 'Test Coverage',
            priority: 'medium',
            title: 'Achieve Good Test Coverage',
            description: 'Ensure critical code paths are tested',
            suggestions: [
                'Aim for 80%+ test coverage',
                'Test edge cases and error conditions',
                'Use mocking for external dependencies',
                'Test performance-critical code paths'
            ]
        });

        return recommendations;
    }

    /**
     * Get default recommendations
     */
    getDefaultRecommendations(context) {
        return [
            {
                category: 'General',
                priority: 'medium',
                title: 'Follow Python Best Practices',
                description: 'Apply general Python development best practices',
                suggestions: [
                    'Use meaningful variable names',
                    'Write clear and concise code',
                    'Document your code with docstrings',
                    'Handle errors gracefully'
                ]
            }
        ];
    }

    /**
     * Generate code examples
     */
    generateCodeExamples(taskType, context) {
        const examples = [];

        switch (taskType) {
            case 'optimization':
                examples.push({
                    title: 'List Comprehension vs For Loop',
                    code: `
# Inefficient
result = []
for item in items:
    if item > 0:
        result.append(item * 2)

# Efficient
result = [item * 2 for item in items if item > 0]
          `,
                    explanation: 'List comprehensions are faster and more readable'
                });

                examples.push({
                    title: 'Generator for Memory Efficiency',
                    code: `
# Memory intensive
def get_squares(n):
    return [x**2 for x in range(n)]

# Memory efficient
def get_squares_gen(n):
    for x in range(n):
        yield x**2
          `,
                    explanation: 'Generators use less memory for large datasets'
                });
                break;

            case 'security':
                examples.push({
                    title: 'Safe Input Handling',
                    code: `
import re
from typing import Optional

def validate_email(email: str) -> Optional[str]:
    """Validate email format and return normalized email or None."""
    if not email or not isinstance(email, str):
        return None
    
    email = email.strip().lower()
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    
    if re.match(email_pattern, email):
        return email
    return None
          `,
                    explanation: 'Always validate and sanitize user input'
                });
                break;

            case 'testing':
                examples.push({
                    title: 'Pytest Example with Fixtures',
                    code: `
import pytest
from unittest.mock import Mock

@pytest.fixture
def sample_data():
    return {'name': 'test', 'value': 42}

def test_process_data(sample_data):
    # Arrange
    processor = DataProcessor()
    
    # Act
    result = processor.process(sample_data)
    
    # Assert
    assert result['processed'] is True
    assert result['value'] == 42
          `,
                    explanation: 'Use fixtures for test data and follow AAA pattern'
                });
                break;
        }

        return examples;
    }

    /**
     * Get relevant best practices
     */
    getRelevantBestPractices(taskType) {
        const practices = [];

        practices.push({
            title: 'PEP 8 Compliance',
            description: 'Follow Python Enhancement Proposal 8 for code style',
            resources: ['https://pep8.org/', 'https://www.python.org/dev/peps/pep-0008/']
        });

        practices.push({
            title: 'Type Hints',
            description: 'Use type hints for better code documentation and IDE support',
            resources: ['https://docs.python.org/3/library/typing.html']
        });

        practices.push({
            title: 'Virtual Environments',
            description: 'Use virtual environments to manage dependencies',
            resources: ['https://docs.python.org/3/library/venv.html']
        });

        return practices;
    }

    /**
     * Get security notes
     */
    getSecurityNotes(taskType) {
        const notes = [];

        notes.push({
            title: 'Input Validation',
            description: 'Always validate and sanitize user input to prevent injection attacks'
        });

        notes.push({
            title: 'Dependency Security',
            description: 'Regularly update dependencies and check for known vulnerabilities'
        });

        notes.push({
            title: 'Secrets Management',
            description: 'Never hardcode secrets in source code - use environment variables'
        });

        return notes;
    }

    /**
     * Load best practices
     */
    loadBestPractices() {
        return [
            {
                category: 'Code Style',
                rules: [
                    'Follow PEP 8 style guide',
                    'Use meaningful variable names',
                    'Limit line length to 79 characters',
                    'Use docstrings for public functions and classes'
                ]
            },
            {
                category: 'Performance',
                rules: [
                    'Use built-in functions when possible',
                    'Choose appropriate data structures',
                    'Use generators for large datasets',
                    'Avoid unnecessary object creation'
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
                name: 'Context Manager',
                pattern: 'Use context managers for resource management',
                example: 'with open(file) as f: ...'
            },
            {
                name: 'List Comprehension',
                pattern: 'Use list comprehensions for simple transformations',
                example: '[x**2 for x in range(10)]'
            }
        ];
    }

    /**
     * Load security guidelines
     */
    loadSecurityGuidelines() {
        return [
            {
                category: 'Input Validation',
                guidelines: [
                    'Validate all user inputs',
                    'Use parameterized queries',
                    'Sanitize data before processing'
                ]
            },
            {
                category: 'Authentication',
                guidelines: [
                    'Use secure password hashing',
                    'Implement proper session management',
                    'Use HTTPS for all communications'
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

module.exports = PythonSkill;