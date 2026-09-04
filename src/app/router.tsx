import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell/AppShell';
import { HomePage } from '@/pages/Home/HomePage';
import { LearnPage } from '@/pages/Learn/LearnPage';
import { ModuleDetailPage } from '@/pages/Learn/ModuleDetailPage';
import { LessonViewPage } from '@/pages/Learn/LessonViewPage';
import { PathsPage } from '@/pages/Paths/PathsPage';
import { PathDetailPage } from '@/pages/Paths/PathDetailPage';
import { CommandsPage } from '@/pages/Commands/CommandsPage';
import { CommandDetailPage } from '@/pages/Commands/CommandDetailPage';
import { WorkflowsPage } from '@/pages/Workflows/WorkflowsPage';
import { EverydayGitPage } from '@/pages/Workflows/EverydayGitPage';
import { GitHubPrPage } from '@/pages/GitHub/GitHubPrPage';
import { TroubleshootingPage } from '@/pages/Troubleshooting/TroubleshootingPage';
import { TroubleshootingDetailPage } from '@/pages/Troubleshooting/TroubleshootingDetailPage';
import { InterviewPage } from '@/pages/Interview/InterviewPage';
import { InterviewOverviewPage } from '@/pages/Interview/InterviewOverviewPage';
import { InterviewTopicPage } from '@/pages/Interview/InterviewTopicPage';
import { InterviewMockPage } from '@/pages/Interview/InterviewMockPage';
import { PracticePage } from '@/pages/Practice/PracticePage';
import { PracticeSessionPage } from '@/pages/Practice/PracticeSessionPage';
import { AssessmentPage } from '@/pages/Practice/AssessmentPage';
import { CheatsheetPage } from '@/pages/Cheatsheet/CheatsheetPage';
import { GitCheatsheetPage } from '@/pages/Cheatsheet/GitCheatsheetPage';
import { InternalsExplorerPage } from '@/pages/Internals/InternalsExplorerPage';
import { DesignSystemPage } from '@/pages/DesignSystem/DesignSystemPage';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';

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
        element: <PathsPage />,
      },
      {
        path: 'learn/paths/:pathId',
        element: <PathDetailPage />,
      },
      {
        path: 'learn',
        children: [
          {
            index: true,
            element: <LearnPage />,
          },
          {
            path: ':subjectId',
            element: <LearnPage />,
          },
          {
            path: ':subjectId/:moduleId',
            element: <ModuleDetailPage />,
          },
          {
            path: ':subjectId/:moduleId/:lessonId',
            element: <LessonViewPage />,
          },
        ],
      },
      {
        path: 'commands',
        element: <CommandsPage />,
      },
      {
        path: 'commands/git/:commandSlug',
        element: <CommandDetailPage />,
      },
      {
        path: 'workflows',
        element: <WorkflowsPage />,
      },
      {
        path: 'workflows/everyday-git',
        element: <EverydayGitPage />,
      },
      {
        path: 'workflows/github-pr',
        element: <GitHubPrPage />,
      },
      {
        path: 'troubleshooting',
        element: <TroubleshootingPage />,
      },
      {
        path: 'troubleshooting/git/:scenarioSlug',
        element: <TroubleshootingDetailPage />,
      },
      {
        path: 'interview',
        element: <InterviewPage />,
      },
      {
        path: 'interview/git',
        element: <InterviewOverviewPage />,
      },
      {
        path: 'interview/git/mock',
        element: <InterviewMockPage />,
      },
      {
        path: 'interview/git/:categoryId',
        element: <InterviewTopicPage />,
      },
      {
        path: 'practice',
        element: <PracticePage />,
      },
      {
        path: 'practice/assessment',
        element: <AssessmentPage />,
      },
      {
        path: 'practice/:exerciseId',
        element: <PracticeSessionPage />,
      },
      {
        path: 'cheatsheet',
        element: <CheatsheetPage />,
      },
      {
        path: 'cheatsheet/git',
        element: <GitCheatsheetPage />,
      },
      {
        path: 'git/internals',
        element: <InternalsExplorerPage />,
      },
      {
        path: 'design-system',
        element: <DesignSystemPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
