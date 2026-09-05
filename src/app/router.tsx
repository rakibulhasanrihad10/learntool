import { Suspense, lazy, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { getBasePath } from '@/utils/siteUrl';
import { AppShell } from '@/layouts/AppShell/AppShell';
import { PageLoader } from '@/components/feedback/PageLoader/PageLoader';
// Eager: shell + home + 404 only. Hubs lazy-load so their content
// datasets (module/lesson bodies, command encyclopedia) leave the
// initial chunk; Suspense keeps navigation smooth.
import { HomePage } from '@/pages/Home/HomePage';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';
const LearnPage = lazy(() =>
  import('@/pages/Learn/LearnPage').then((m) => ({ default: m.LearnPage }))
);
const CommandsPage = lazy(() =>
  import('@/pages/Commands/CommandsPage').then((m) => ({ default: m.CommandsPage }))
);

// Lazy: heavier feature routes split into their own chunks so the initial
// bundle stays lean. Content data (lessons, practice, interview, guides)
// travels with its route instead of loading up front.
const ModuleDetailPage = lazy(() =>
  import('@/pages/Learn/ModuleDetailPage').then((m) => ({ default: m.ModuleDetailPage }))
);
const LessonViewPage = lazy(() =>
  import('@/pages/Learn/LessonViewPage').then((m) => ({ default: m.LessonViewPage }))
);
const PathsPage = lazy(() =>
  import('@/pages/Paths/PathsPage').then((m) => ({ default: m.PathsPage }))
);
const PathDetailPage = lazy(() =>
  import('@/pages/Paths/PathDetailPage').then((m) => ({ default: m.PathDetailPage }))
);
const ProgressPage = lazy(() =>
  import('@/pages/Progress/ProgressPage').then((m) => ({ default: m.ProgressPage }))
);
const SearchPage = lazy(() =>
  import('@/pages/Search/SearchPage').then((m) => ({ default: m.SearchPage }))
);
const CommandDetailPage = lazy(() =>
  import('@/pages/Commands/CommandDetailPage').then((m) => ({ default: m.CommandDetailPage }))
);
const WorkflowsPage = lazy(() =>
  import('@/pages/Workflows/WorkflowsPage').then((m) => ({ default: m.WorkflowsPage }))
);
const EverydayGitPage = lazy(() =>
  import('@/pages/Workflows/EverydayGitPage').then((m) => ({ default: m.EverydayGitPage }))
);
const GitHubPrPage = lazy(() =>
  import('@/pages/GitHub/GitHubPrPage').then((m) => ({ default: m.GitHubPrPage }))
);
const TroubleshootingPage = lazy(() =>
  import('@/pages/Troubleshooting/TroubleshootingPage').then((m) => ({ default: m.TroubleshootingPage }))
);
const TroubleshootingDetailPage = lazy(() =>
  import('@/pages/Troubleshooting/TroubleshootingDetailPage').then((m) => ({ default: m.TroubleshootingDetailPage }))
);
const InterviewPage = lazy(() =>
  import('@/pages/Interview/InterviewPage').then((m) => ({ default: m.InterviewPage }))
);
const InterviewOverviewPage = lazy(() =>
  import('@/pages/Interview/InterviewOverviewPage').then((m) => ({ default: m.InterviewOverviewPage }))
);
const InterviewTopicPage = lazy(() =>
  import('@/pages/Interview/InterviewTopicPage').then((m) => ({ default: m.InterviewTopicPage }))
);
const InterviewMockPage = lazy(() =>
  import('@/pages/Interview/InterviewMockPage').then((m) => ({ default: m.InterviewMockPage }))
);
const PracticePage = lazy(() =>
  import('@/pages/Practice/PracticePage').then((m) => ({ default: m.PracticePage }))
);
const PracticeSessionPage = lazy(() =>
  import('@/pages/Practice/PracticeSessionPage').then((m) => ({ default: m.PracticeSessionPage }))
);
const AssessmentPage = lazy(() =>
  import('@/pages/Practice/AssessmentPage').then((m) => ({ default: m.AssessmentPage }))
);
const CheatsheetPage = lazy(() =>
  import('@/pages/Cheatsheet/CheatsheetPage').then((m) => ({ default: m.CheatsheetPage }))
);
const GitCheatsheetPage = lazy(() =>
  import('@/pages/Cheatsheet/GitCheatsheetPage').then((m) => ({ default: m.GitCheatsheetPage }))
);
const InternalsExplorerPage = lazy(() =>
  import('@/pages/Internals/InternalsExplorerPage').then((m) => ({ default: m.InternalsExplorerPage }))
);
const DesignSystemPage = lazy(() =>
  import('@/pages/DesignSystem/DesignSystemPage').then((m) => ({ default: m.DesignSystemPage }))
);

const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

// Basename mirrors Vite `base` (VITE_BASE_PATH) so subpath hosting works.
// No trailing slash: React Router joins it with route paths itself.
const basename = getBasePath().replace(/\/+$/, '') || '/';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'learn/paths',
        element: withSuspense(<PathsPage />),
      },
      {
        path: 'learn/paths/:pathId',
        element: withSuspense(<PathDetailPage />),
      },
      {
        path: 'progress',
        element: withSuspense(<ProgressPage />),
      },
      {
        path: 'search',
        element: withSuspense(<SearchPage />),
      },
      {
        path: 'learn',
        children: [
          {
            index: true,
            element: withSuspense(<LearnPage />),
          },
          {
            path: ':subjectId',
            element: withSuspense(<LearnPage />),
          },
          {
            path: ':subjectId/:moduleId',
            element: withSuspense(<ModuleDetailPage />),
          },
          {
            path: ':subjectId/:moduleId/:lessonId',
            element: withSuspense(<LessonViewPage />),
          },
        ],
      },
      {
        path: 'commands',
        element: withSuspense(<CommandsPage />),
      },
      {
        path: 'commands/git/:commandSlug',
        element: withSuspense(<CommandDetailPage />),
      },
      {
        path: 'workflows',
        element: withSuspense(<WorkflowsPage />),
      },
      {
        path: 'workflows/everyday-git',
        element: withSuspense(<EverydayGitPage />),
      },
      {
        path: 'workflows/github-pr',
        element: withSuspense(<GitHubPrPage />),
      },
      {
        path: 'troubleshooting',
        element: withSuspense(<TroubleshootingPage />),
      },
      {
        path: 'troubleshooting/git/:scenarioSlug',
        element: withSuspense(<TroubleshootingDetailPage />),
      },
      {
        path: 'interview',
        element: withSuspense(<InterviewPage />),
      },
      {
        path: 'interview/git',
        element: withSuspense(<InterviewOverviewPage />),
      },
      {
        path: 'interview/git/mock',
        element: withSuspense(<InterviewMockPage />),
      },
      {
        path: 'interview/git/:categoryId',
        element: withSuspense(<InterviewTopicPage />),
      },
      {
        path: 'practice',
        element: withSuspense(<PracticePage />),
      },
      {
        path: 'practice/assessment',
        element: withSuspense(<AssessmentPage />),
      },
      {
        path: 'practice/:exerciseId',
        element: withSuspense(<PracticeSessionPage />),
      },
      {
        path: 'cheatsheet',
        element: withSuspense(<CheatsheetPage />),
      },
      {
        path: 'cheatsheet/git',
        element: withSuspense(<GitCheatsheetPage />),
      },
      {
        path: 'git/internals',
        element: withSuspense(<InternalsExplorerPage />),
      },
      {
        path: 'design-system',
        element: withSuspense(<DesignSystemPage />),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
], { basename });
