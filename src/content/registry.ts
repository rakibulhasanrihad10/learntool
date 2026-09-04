import { SubjectMeta } from '@/types/content';

/**
 * Scalable Subject Registry
 *
 * Designed to seamlessly expand to additional Computer Science domains
 * without requiring architectural rewrites of the application shell.
 */
export const AVAILABLE_SUBJECTS: SubjectMeta[] = [
  {
    id: 'git',
    title: 'Git Version Control',
    description: 'Deep-dive into snapshots, branching mechanics, merge resolution, and the .git directory internals.',
    icon: 'git-branch',
    moduleCount: 12,
    isAvailable: true,
  },
  {
    id: 'github',
    title: 'GitHub & Collaboration',
    description: 'Pull Request workflows, Actions CI/CD pipelines, releases, forks, and team collaboration.',
    icon: 'github',
    moduleCount: 8,
    isAvailable: true,
  },
  {
    id: 'linux',
    title: 'Linux Fundamentals & Shell',
    description: 'File permissions, process management, bash scripting, and server administration.',
    icon: 'terminal',
    moduleCount: 10,
    isAvailable: false, // Planned for future phase
  },
  {
    id: 'docker',
    title: 'Docker & Containerization',
    description: 'Images, Dockerfiles, Compose orchestration, volume mounts, and container networks.',
    icon: 'container',
    moduleCount: 8,
    isAvailable: false,
  },
  {
    id: 'sql',
    title: 'SQL & Database Architecture',
    description: 'Relational schemas, query optimization, indexing, ACID transactions, and joins.',
    icon: 'database',
    moduleCount: 10,
    isAvailable: false,
  },
  {
    id: 'system-design',
    title: 'System Design & Scalability',
    description: 'Load balancing, caching strategies, microservices, CAP theorem, and distributed systems.',
    icon: 'network',
    moduleCount: 14,
    isAvailable: false,
  },
];
