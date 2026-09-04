/**
 * Concept-level search entries for GitHub collaboration.
 * These fold into the existing SearchModal lesson results (same icon, same
 * keyboard nav) — no parallel search UI. Each entry maps natural phrases
 * (§26 examples) to the best existing route: lesson, workflow view,
 * simulator, command reference, or troubleshooting guide.
 */
export interface GithubSearchEntry {
  id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  keywords: string[];
  route: string;
}

export const GITHUB_SEARCH_ENTRIES: GithubSearchEntry[] = [
  {
    id: 'github.search.what-is-pr',
    title: 'Pull Request',
    titleBn: 'পুল রিকোয়েস্ট',
    subtitle: 'What is a Pull Request? — GitHub lesson',
    subtitleBn: 'পুল রিকোয়েস্ট কী? — গিটহাব পাঠ',
    keywords: ['what is pr', 'pull request', 'pr meaning', 'pr proposal'],
    route: '/learn/github/pull-requests/what-is-a-pull-request',
  },
  {
    id: 'github.search.fork-vs-clone',
    title: 'Fork vs Clone',
    titleBn: 'ফোর্ক বনাম ক্লোন',
    subtitle: 'Fork vs Clone — GitHub lesson',
    subtitleBn: 'ফোর্ক বনাম ক্লোন — গিটহাব পাঠ',
    keywords: ['fork vs clone', 'fork or clone', 'difference fork clone', 'fork clone'],
    route: '/learn/github/collaboration/fork-vs-clone',
  },
  {
    id: 'github.search.origin-upstream',
    title: 'origin vs upstream',
    titleBn: 'origin বনাম upstream',
    subtitle: 'origin and upstream — GitHub lesson',
    subtitleBn: 'origin ও upstream — গিটহাব পাঠ',
    keywords: ['origin upstream', 'origin vs upstream', 'what is origin', 'what is upstream', 'upstream remote'],
    route: '/learn/github/basics/origin-and-upstream',
  },
  {
    id: 'github.search.code-review',
    title: 'Code Review',
    titleBn: 'কোড রিভিউ',
    subtitle: 'Reviewing Changes — GitHub lesson',
    subtitleBn: 'পরিবর্তন রিভিউ — গিটহাব পাঠ',
    keywords: ['code review', 'review changes', 'reviewer', 'review comments', 'approve pr'],
    route: '/learn/github/pull-requests/reviewing-changes',
  },
  {
    id: 'github.search.pr-rejected',
    title: 'Push rejected / PR blocked',
    titleBn: 'পুশ প্রত্যাখ্যাত / PR আটকে গেছে',
    subtitle: 'Why was my push rejected? — recovery guide',
    subtitleBn: 'পুশ কেন প্রত্যাখ্যাত? — রিকভারি গাইড',
    keywords: ['pr rejected', 'push rejected', 'pr blocked', 'cannot merge', 'merge blocked'],
    route: '/troubleshooting/git/push-rejected',
  },
  {
    id: 'github.search.github-workflow',
    title: 'GitHub Flow',
    titleBn: 'গিটহাব ফ্লো',
    subtitle: 'GitHub Flow — complete workflow lesson',
    subtitleBn: 'গিটহাব ফ্লো — সম্পূর্ণ ওয়ার্কফ্লো পাঠ',
    keywords: ['github workflow', 'github flow', 'team workflow', 'feature branch workflow', 'collaboration workflow'],
    route: '/learn/github/team-workflows/github-flow',
  },
  {
    id: 'github.search.git-vs-github',
    title: 'Git vs GitHub',
    titleBn: 'গিট বনাম গিটহাব',
    subtitle: 'Git vs GitHub — GitHub lesson',
    subtitleBn: 'গিট বনাম গিটহাব — গিটহাব পাঠ',
    keywords: ['git vs github', 'difference git github', 'git and github'],
    route: '/learn/github/basics/git-vs-github',
  },
  {
    id: 'github.search.merge-conflict-pr',
    title: 'PR merge conflicts',
    titleBn: 'PR মার্জ কনফ্লিক্ট',
    subtitle: 'Resolving Collaboration Conflicts — GitHub lesson',
    subtitleBn: 'সহযোগিতা কনফ্লিক্ট সমাধান — গিটহাব পাঠ',
    keywords: ['pr conflict', 'merge conflict pr', 'conflicted pull request', 'resolve pr conflict'],
    route: '/learn/github/team-workflows/resolve-collaboration-conflicts',
  },
  {
    id: 'github.search.fork-sync',
    title: 'Keep a fork updated',
    titleBn: 'ফোর্ক হালনাগাদ রাখা',
    subtitle: 'Keeping a Fork Updated — GitHub lesson',
    subtitleBn: 'ফোর্ক হালনাগাদ রাখা — গিটহাব পাঠ',
    keywords: ['sync fork', 'update fork', 'fork outdated', 'fork behind', 'fetch upstream'],
    route: '/learn/github/collaboration/keep-fork-updated',
  },
  {
    id: 'github.search.pr-simulator',
    title: 'PR simulator',
    titleBn: 'PR সিমুলেটর',
    subtitle: 'Interactive pull request walkthrough — no account needed',
    subtitleBn: 'ইন্টারেক্টিভ পুল রিকোয়েস্ট — অ্যাকাউন্ট ছাড়াই',
    keywords: ['pr simulator', 'practice pull request', 'simulate pr', 'try pull request'],
    route: '/workflows/github-pr',
  },
  {
    id: 'github.search.draft-pr',
    title: 'Draft pull requests',
    titleBn: 'ড্রাফট পুল রিকোয়েস্ট',
    subtitle: 'Draft Pull Requests — GitHub lesson',
    subtitleBn: 'ড্রাফট পুল রিকোয়েস্ট — গিটহাব পাঠ',
    keywords: ['draft pr', 'draft pull request', 'wip pr', 'work in progress pr'],
    route: '/learn/github/pull-requests/draft-pull-requests',
  },
  {
    id: 'github.search.merge-strategies',
    title: 'Merge strategies',
    titleBn: 'মার্জ কৌশল',
    subtitle: 'Merging a Pull Request — merge, squash, rebase',
    subtitleBn: 'পুল রিকোয়েস্ট মার্জ — মার্জ, স্কোয়াশ, রিবেস',
    keywords: ['merge strategy', 'squash merge', 'rebase merge', 'merge commit', 'how to merge pr'],
    route: '/learn/github/pull-requests/merging-pr',
  },
  {
    id: 'github.search.open-source',
    title: 'Contribute to open source',
    titleBn: 'ওপেন সোর্সে অবদান',
    subtitle: 'Contributing to Open Source — GitHub lesson',
    subtitleBn: 'ওপেন সোর্সে অবদান — গিটহাব পাঠ',
    keywords: ['open source', 'contribute', 'first contribution', 'good first issue', 'contributor'],
    route: '/learn/github/collaboration/contributing-open-source',
  },
  {
    id: 'github.search.branch-protection',
    title: 'Branch protection & CI checks',
    titleBn: 'ব্রাঞ্চ সুরক্ষা ও CI চেক',
    subtitle: 'Approving a Pull Request — rules, checks, approvals',
    subtitleBn: 'পুল রিকোয়েস্ট অনুমোদন — নিয়ম, চেক, অনুমোদন',
    keywords: ['branch protection', 'protected branch', 'status checks', 'ci checks', 'required reviews', 'ruleset'],
    route: '/learn/github/pull-requests/approving-pr',
  },
];
