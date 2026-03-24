/**
 * JavaScript Skill Module - Modern JavaScript/TypeScript development expertise
 * 
 * This skill provides expertise in:
 * - Modern JavaScript ES6+ features and syntax
 * - TypeScript development and type safety
 * - Frontend framework best practices
 * - Performance optimization techniques
 * - Security best practices for web development
 */

const fs = require('fs').promises;
const path = require('path');

class JavaScriptSkill {
    constructor() {
        this.bestPractices = this.loadBestPractices();
        this.codePatterns = this.loadCodePatterns();
        this.securityGuidelines = this.loadSecurityGuidelines();
    }

    /**
     * Execute JavaScript development task
     */
    async execute(context) {
        console.log(`⚡ JavaScript Skill: Executing task "${context.task}"`);

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
                    results.recommendations = this.getJavaScriptReviewRecommendations(context);
                    break;
                case 'optimization':
                    results.recommendations = this.getJavaScriptOptimizationRecommendations(context);
                    break;
                case 'security':
                    results.recommendations = this.getJavaScriptSecurityRecommendations(context);
                    break;
                case 'best-practices':
                    results.recommendations = this.getJavaScriptBestPracticesRecommendations(context);
                    break;
                case 'typescript':
                    results.recommendations = this.getTypeScriptRecommendations(context);
                    break;
                case 'react':
                    results.recommendations = this.getReactRecommendations(context);
                    break;
                default:
                    results.recommendations = this.getDefaultJavaScriptRecommendations(context);
            }

            // Generate code examples if requested
            if (context.includeExamples) {
                results.codeExamples = this.generateJavaScriptCodeExamples(taskType, context);
            }

            // Add relevant best practices
            results.bestPractices = this.getRelevantJavaScriptBestPractices(taskType);

            // Add security notes if applicable
            if (taskType !== 'security') {
                results.securityNotes = this.getJavaScriptSecurityNotes(taskType);
            }

            return {
                status: 'completed',
                skill: 'javascript-pro',
                results,
                summary: `JavaScript skill executed successfully for ${taskType} task`
            };

        } catch (error) {
            console.error('❌ JavaScript Skill failed:', error);
            return {
                status: 'failed',
                skill: 'javascript-pro',
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
        } else if (taskLower.includes('typescript') || taskLower.includes('ts')) {
            return 'typescript';
        } else if (taskLower.includes('react') || taskLower.includes('vue') || taskLower.includes('angular')) {
            return 'react'; // General frontend framework
        } else {
            return 'general';
        }
    }

    /**
     * Get JavaScript code review recommendations
     */
    getJavaScriptReviewRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Code Quality',
            priority: 'high',
            title: 'Follow Modern JavaScript Standards',
            description: 'Ensure code follows ES6+ standards and modern best practices',
            suggestions: [
                'Use const/let instead of var',
                'Use arrow functions for concise syntax',
                'Destructure objects and arrays appropriately',
                'Use template literals for string interpolation'
            ]
        });

        recommendations.push({
            category: 'Error Handling',
            priority: 'high',
            title: 'Implement Proper Error Handling',
            description: 'Handle errors gracefully and provide meaningful feedback',
            suggestions: [
                'Use try-catch blocks for async operations',
                'Implement proper error boundaries in React',
                'Use meaningful error messages',
                'Log errors appropriately for debugging'
            ]
        });

        recommendations.push({
            category: 'Performance',
            priority: 'medium',
            title: 'Optimize JavaScript Performance',
            description: 'Implement performance best practices',
            suggestions: [
                'Avoid memory leaks with proper cleanup',
                'Use memoization for expensive calculations',
                'Implement lazy loading for components',
                'Optimize event handlers and callbacks'
            ]
        });

        return recommendations;
    }

    /**
     * Get JavaScript optimization recommendations
     */
    getJavaScriptOptimizationRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Performance',
            priority: 'high',
            title: 'Optimize JavaScript Execution',
            description: 'Improve JavaScript runtime performance',
            suggestions: [
                'Use efficient algorithms and data structures',
                'Minimize DOM manipulation',
                'Debounce/throttle event handlers',
                'Use virtualization for long lists'
            ]
        });

        recommendations.push({
            category: 'Bundle Size',
            priority: 'medium',
            title: 'Reduce Bundle Size',
            description: 'Optimize bundle size for faster loading',
            suggestions: [
                'Use tree shaking to eliminate dead code',
                'Implement code splitting',
                'Lazy load non-critical components',
                'Use dynamic imports'
            ]
        });

        recommendations.push({
            category: 'Memory Management',
            priority: 'medium',
            title: 'Prevent Memory Leaks',
            description: 'Ensure proper memory management',
            suggestions: [
                'Remove event listeners on component unmount',
                'Clear timers and intervals',
                'Avoid circular references',
                'Use WeakMap/WeakSet for temporary data'
            ]
        });

        return recommendations;
    }

    /**
     * Get JavaScript security recommendations
     */
    getJavaScriptSecurityRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Input Validation',
            priority: 'high',
            title: 'Validate All User Input',
            description: 'Prevent XSS and injection attacks',
            suggestions: [
                'Sanitize user input before rendering',
                'Use DOMPurify for HTML sanitization',
                'Avoid innerHTML with user data',
                'Use proper encoding for URLs and data'
            ]
        });

        recommendations.push({
            category: 'API Security',
            priority: 'high',
            title: 'Secure API Communications',
            description: 'Protect data in transit and at rest',
            suggestions: [
                'Use HTTPS for all API calls',
                'Implement proper authentication',
                'Use CSRF tokens for state-changing operations',
                'Validate API responses'
            ]
        });

        recommendations.push({
            category: 'Client-Side Security',
            priority: 'medium',
            title: 'Secure Client-Side Code',
            description: 'Protect against client-side attacks',
            suggestions: [
                'Use Content Security Policy (CSP)',
                'Implement proper CORS configuration',
                'Avoid storing sensitive data in localStorage',
                'Use secure cookie settings'
            ]
        });

        return recommendations;
    }

    /**
     * Get TypeScript recommendations
     */
    getTypeScriptRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Type Safety',
            priority: 'high',
            title: 'Leverage TypeScript Type System',
            description: 'Use TypeScript for better type safety and developer experience',
            suggestions: [
                'Define proper interfaces for data structures',
                'Use strict mode for better type checking',
                'Implement generic types for reusable code',
                'Use union types for better type narrowing'
            ]
        });

        recommendations.push({
            category: 'Development Experience',
            priority: 'medium',
            title: 'Improve Developer Experience',
            description: 'Enhance development workflow with TypeScript',
            suggestions: [
                'Use type definitions for external libraries',
                'Implement proper error types',
                'Use enums for constants',
                'Enable strict null checks'
            ]
        });

        return recommendations;
    }

    /**
     * Get React recommendations
     */
    getReactRecommendations(context) {
        const recommendations = [];

        recommendations.push({
            category: 'Hooks Best Practices',
            priority: 'high',
            title: 'Follow React Hooks Guidelines',
            description: 'Use React hooks properly and efficiently',
            suggestions: [
                'Use useState for local state management',
                'Use useEffect for side effects with proper cleanup',
                'Use useMemo for expensive calculations',
                'Use useCallback for function memoization'
            ]
        });

        recommendations.push({
            category: 'Component Design',
            priority: 'medium',
            title: 'Design Reusable Components',
            description: 'Create maintainable and reusable React components',
            suggestions: [
                'Use functional components over class components',
                'Implement proper prop validation',
                'Use composition over inheritance',
                'Keep components focused and small'
            ]
        });

        recommendations.push({
            category: 'State Management',
            priority: 'medium',
            title: 'Manage State Effectively',
            description: 'Choose appropriate state management strategies',
            suggestions: [
                'Use local state for component-specific data',
                'Use context for shared state',
                'Consider Redux/Zustand for complex state',
                'Avoid prop drilling with proper architecture'
            ]
        });

        return recommendations;
    }

    /**
     * Get default JavaScript recommendations
     */
    getDefaultJavaScriptRecommendations(context) {
        return [
            {
                category: 'General',
                priority: 'medium',
                title: 'Follow JavaScript Best Practices',
                description: 'Apply general JavaScript development best practices',
                suggestions: [
                    'Use modern ES6+ syntax',
                    'Write clean and readable code',
                    'Handle errors gracefully',
                    'Optimize for performance'
                ]
            }
        ];
    }

    /**
     * Generate JavaScript code examples
     */
    generateJavaScriptCodeExamples(taskType, context) {
        const examples = [];

        switch (taskType) {
            case 'optimization':
                examples.push({
                    title: 'Memoization with useMemo',
                    code: `
// Inefficient: Recalculates on every render
const expensiveCalculation = heavyCalculation(data);

// Efficient: Memoized calculation
const expensiveCalculation = useMemo(() => 
  heavyCalculation(data), [data]
);
          `,
                    explanation: 'Use useMemo to cache expensive calculations'
                });

                examples.push({
                    title: 'Event Handler Optimization',
                    code: `
// Inefficient: Creates new function on every render
<button onClick={() => handleClick(id)}>Click</button>

// Efficient: Memoized callback
const handleClick = useCallback((id) => {
  // handle click
}, []);

<button onClick={() => handleClick(id)}>Click</button>
          `,
                    explanation: 'Use useCallback to prevent unnecessary re-renders'
                });
                break;

            case 'typescript':
                examples.push({
                    title: 'TypeScript Interface Definition',
                    code: `
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
}

interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// Usage
const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date(),
  isActive: true
};
          `,
                    explanation: 'Define clear interfaces for type safety'
                });
                break;

            case 'react':
                examples.push({
                    title: 'Custom Hook Pattern',
                    code: `
import { useState, useEffect, useCallback } from 'react';

function useApiData(url: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Usage
function MyComponent() {
  const { data, loading, error } = useApiData('/api/data');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
          `,
                    explanation: 'Create reusable custom hooks for common patterns'
                });
                break;
        }

        return examples;
    }

    /**
     * Get relevant JavaScript best practices
     */
    getRelevantJavaScriptBestPractices(taskType) {
        const practices = [];

        practices.push({
            title: 'ES6+ Features',
            description: 'Use modern JavaScript features for better code',
            resources: ['https://developer.mozilla.org/en-US/docs/Web/JavaScript', 'https://es6-features.org/']
        });

        practices.push({
            title: 'TypeScript',
            description: 'Use TypeScript for type safety and better IDE support',
            resources: ['https://www.typescriptlang.org/', 'https://basarat.gitbook.io/typescript/']
        });

        practices.push({
            title: 'Performance Optimization',
            description: 'Follow performance best practices',
            resources: ['https://web.dev/fast/', 'https://developers.google.com/web/fundamentals/performance']
        });

        return practices;
    }

    /**
     * Get JavaScript security notes
     */
    getJavaScriptSecurityNotes(taskType) {
        const notes = [];

        notes.push({
            title: 'XSS Prevention',
            description: 'Always sanitize user input to prevent XSS attacks'
        });

        notes.push({
            title: 'CORS Configuration',
            description: 'Properly configure CORS for API security'
        });

        notes.push({
            title: 'Secure Storage',
            description: 'Avoid storing sensitive data in client-side storage'
        });

        return notes;
    }

    /**
     * Load best practices
     */
    loadBestPractices() {
        return [
            {
                category: 'Modern JavaScript',
                rules: [
                    'Use const/let instead of var',
                    'Use arrow functions for concise syntax',
                    'Destructure objects and arrays',
                    'Use template literals for strings'
                ]
            },
            {
                category: 'Performance',
                rules: [
                    'Minimize DOM manipulation',
                    'Use efficient algorithms',
                    'Implement proper caching',
                    'Optimize bundle size'
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
                name: 'Error Handling',
                pattern: 'Use try-catch for async operations',
                example: 'try { await fetchData(); } catch (error) { console.error(error); }'
            },
            {
                name: 'State Management',
                pattern: 'Use state management libraries for complex state',
                example: 'Redux, Zustand, or Context API'
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
                    'Sanitize all user input',
                    'Use proper encoding',
                    'Validate data types',
                    'Implement rate limiting'
                ]
            },
            {
                category: 'API Security',
                guidelines: [
                    'Use HTTPS for all communications',
                    'Implement proper authentication',
                    'Use CSRF protection',
                    'Validate API responses'
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

module.exports = JavaScriptSkill;