import React, { useState } from 'react';
import { Container, Stack, Grid, Section, Divider } from '@/components/layout';
import { Heading, Text, CodeText } from '@/components/typography';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { Chip } from '@/components/common/Chip/Chip';
import { DifficultyBadge } from '@/components/common/DifficultyBadge/DifficultyBadge';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { CopyButton } from '@/components/common/CopyButton/CopyButton';
import { Modal } from '@/components/feedback/Modal/Modal';
import { Callout } from '@/components/feedback/Callout/Callout';
import { CircularProgress } from '@/components/feedback/CircularProgress/CircularProgress';
import { StatusState } from '@/components/feedback/StatusState/StatusState';
import { CodeBlock } from '@/components/data-display/CodeBlock/CodeBlock';
import { TerminalPreview } from '@/components/data-display/TerminalPreview/TerminalPreview';
import { CommandBlock } from '@/components/data-display/CommandBlock/CommandBlock';
import { CommandCard } from '@/components/data-display/CommandCard/CommandCard';
import {
  LessonHeader,
  LearningObjective,
  KeyConcept,
  TakeawayCard,
  PreviousNextNavigation,
} from '@/components/learning';
import { QuizCard } from '@/components/evaluation/QuizCard/QuizCard';
import { InterviewQuestionCard } from '@/components/evaluation/InterviewQuestionCard/InterviewQuestionCard';
import {
  SearchInput,
  SearchResultItem,
  SearchResultGroup,
} from '@/components/search/SearchUI/SearchUI';
import {
  XPBadge,
  LevelBadge,
  StreakBadge,
  DailyChallengeCard,
  AchievementCard,
  ProgressBar,
} from '@/components/gamification';
import { useLanguage } from '@/i18n/context';
import { useTheme } from '@/app/themeContext';
import { QuizQuestion, InterviewQuestion } from '@/types/content';
import {
  Sparkles,
  Play,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import './DesignSystemPage.css';

// Mock data for Quiz UI demonstration
const mockQuizQuestion: QuizQuestion = {
  id: 'demo-quiz-1',
  subjectId: 'git',
  difficulty: 'beginner',
  question: 'Which Git command stages modified files in the working directory preparing them for commit?',
  questionBn: 'কোন গিট কমান্ডটি ওয়ার্কিং ডিরেক্টরির পরিবর্তিত ফাইলগুলোকে কমিটের জন্য স্টেজিং এরিয়াতে যুক্ত করে?',
  codeSnippet: '$ git status\nChanges not staged for commit:\n  modified: app.js',
  options: [
    { id: 'opt-1', text: 'git commit -m "update"', textBn: 'git commit -m "update"', isCorrect: false },
    { id: 'opt-2', text: 'git add .', textBn: 'git add .', isCorrect: true },
    { id: 'opt-3', text: 'git push origin main', textBn: 'git push origin main', isCorrect: false },
    { id: 'opt-4', text: 'git init', textBn: 'git init', isCorrect: false },
  ],
  explanation: '`git add .` (or `git add <file>`) stages the file changes into Git’s staging index before committing.',
  explanationBn: '`git add .` (বা `git add <file>`) ফাইল পরিবর্তনের রেকর্ডগুলো কমিট করার আগে গিট স্টেজিং ইনডেক্সে যুক্ত করে।',
};

// Mock data for Interview question demonstration
const mockInterviewQuestion: InterviewQuestion = {
  id: 'demo-int-1',
  subjectId: 'git',
  category: 'Branching & History',
  difficulty: 'intermediate',
  question: 'What is the difference between git merge and git rebase?',
  questionBn: 'git merge এবং git rebase এর মধ্যে মূল পার্থক্য কী?',
  answer:
    'Both merge and rebase integrate changes from one branch into another. Git merge preserves chronological commit history and creates an explicit merge commit. Git rebase rewrites project history by reapplying commits on top of the target tip, creating a linear progression.',
  answerBn:
    'উভয় কমান্ডই এক শাখার পরিবর্তন অন্য শাখায় যুক্ত করে। Git merge পূর্ববর্তী সমস্ত কমিটের সঠিক সময়ক্রম বজায় রেখে একটি অতিরিক্ত মার্জ কমিট তৈরি করে। পক্ষান্তরে Git rebase টার্গেট শাখার শেষ কমিটের ওপর নতুন করে পরিবর্তনগুলো বসিয়ে একটি রৈখিক (linear) ইতিহাস প্রদান করে।',
  keyPoints: [
    'Merge creates a non-destructive 3-way merge commit',
    'Rebase creates a linear, cleaner commit history without merge bubbles',
    'Golden Rule: Never rebase commits pushed to a shared public branch',
  ],
  keyPointsBn: [
    'মার্জ সম্পূর্ণ ইতিহাস সংরক্ষণ করে মার্জ কমিট বানায়',
    'রিব্যাস সম্পূর্ণ সরলরৈখিক সুন্দর হিস্ট্রি প্রদান করে',
    'পাবলিক বা শেয়ার্ড শাখায় কখনোই রিব্যাস করা উচিত নয়',
  ],
  followUpQuestions: [
    'What are the dangers of rebasing on a public branch?',
    'When would you prefer interactive rebase (`git rebase -i`)?',
  ],
};

export const DesignSystemPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  // Interactive component state demos
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chipSelected, setChipSelected] = useState<Record<string, boolean>>({
    git: true,
    cli: false,
    branching: true,
  });

  return (
    <div className="gv-design-system-page">
      {/* Top Banner / Hero */}
      <div className="gv-design-system-hero">
        <Container width="wide">
          <div className="gv-design-system-hero__content">
            <div className="gv-design-system-hero__badge">
              <Sparkles size={14} />
              <span>GitVerse Design System v1.0</span>
            </div>
            <Heading level={1} className="gv-design-system-hero__title">
              Visual Language & Component Library
            </Heading>
            <Text variant="body-lg" color="muted" className="gv-design-system-hero__subtitle">
              A developer-centric, accessible, Material 3-inspired design system built for clarity,
              calm focus, and technical precision.
            </Text>

            <div className="gv-design-system-hero__controls">
              <Button
                variant="outlined"
                size="sm"
                iconLeft={theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </Button>
              <Button
                variant="outlined"
                size="sm"
                iconLeft={<Globe size={15} />}
                onClick={toggleLanguage}
              >
                {language === 'en' ? 'Switch to বাংলা' : 'Switch to English'}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container width="wide" className="gv-design-system-body">
        {/* 1. Color Tokens & Surface Hierarchy */}
        <Section
          title="1. Color System & Semantic Surfaces"
          subtitle="Semantic M3-inspired color roles supporting high-contrast Dark and Light modes."
        >
          <Grid columns={3} gap="4">
            <Card variant="filled" padding="md">
              <Heading level={4} className="gv-palette-title">Surface Hierarchy</Heading>
              <Stack gap="2" className="gv-swatch-stack">
                <div className="gv-swatch" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-outline-variant)' }}>
                  <span>--color-surface</span>
                </div>
                <div className="gv-swatch" style={{ background: 'var(--color-surface-container-low)' }}>
                  <span>--color-surface-container-low</span>
                </div>
                <div className="gv-swatch" style={{ background: 'var(--color-surface-container)' }}>
                  <span>--color-surface-container</span>
                </div>
                <div className="gv-swatch" style={{ background: 'var(--color-surface-container-high)' }}>
                  <span>--color-surface-container-high</span>
                </div>
              </Stack>
            </Card>

            <Card variant="filled" padding="md">
              <Heading level={4} className="gv-palette-title">Brand Roles</Heading>
              <Stack gap="2" className="gv-swatch-stack">
                <div className="gv-swatch" style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                  <span>Primary Brand (Indigo)</span>
                </div>
                <div className="gv-swatch" style={{ background: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}>
                  <span>Secondary (Cyan/Teal)</span>
                </div>
                <div className="gv-swatch" style={{ background: 'var(--color-tertiary)', color: 'var(--color-on-tertiary)' }}>
                  <span>Tertiary (Purple)</span>
                </div>
              </Stack>
            </Card>

            <Card variant="filled" padding="md">
              <Heading level={4} className="gv-palette-title">Semantic States</Heading>
              <Stack gap="2" className="gv-swatch-stack">
                <div className="gv-swatch" style={{ background: 'var(--color-success)', color: 'var(--color-on-success)' }}>
                  <span>Success State</span>
                </div>
                <div className="gv-swatch" style={{ background: 'var(--color-warning)', color: 'var(--color-on-warning)' }}>
                  <span>Warning State</span>
                </div>
                <div className="gv-swatch" style={{ background: 'var(--color-error)', color: 'var(--color-on-error)' }}>
                  <span>Error / Destructive</span>
                </div>
                <div className="gv-swatch" style={{ background: 'var(--color-info)', color: 'var(--color-on-info)' }}>
                  <span>Info State</span>
                </div>
              </Stack>
            </Card>
          </Grid>
        </Section>

        <Divider spacing="lg" />

        {/* 2. Typography System */}
        <Section
          title="2. Typography Hierarchy"
          subtitle="Proportional type scale optimized for technical documentation and dual-language reading (Inter & Noto Sans Bengali)."
        >
          <Card variant="outlined" padding="lg">
            <Stack gap="4">
              <div className="gv-type-sample">
                <span className="gv-type-label label-sm">Level 1 Heading</span>
                <Heading level={1}>Heading 1 — Git Version Control Fundamentals</Heading>
              </div>
              <Divider spacing="sm" />
              <div className="gv-type-sample">
                <span className="gv-type-label label-sm">Level 2 Heading</span>
                <Heading level={2}>Heading 2 — Understanding the Three Trees</Heading>
              </div>
              <Divider spacing="sm" />
              <div className="gv-type-sample">
                <span className="gv-type-label label-sm">Level 3 Heading</span>
                <Heading level={3}>Heading 3 — Working Directory vs Staging Area</Heading>
              </div>
              <Divider spacing="sm" />
              <div className="gv-type-sample">
                <span className="gv-type-label label-sm">Body Large</span>
                <Text variant="body-lg">
                  Git does not store changes as differences between files; it stores snapshots of your
                  miniature filesystem over time.
                </Text>
              </div>
              <div className="gv-type-sample">
                <span className="gv-type-label label-sm">Body Medium</span>
                <Text variant="body-md">
                  When you make a commit, Git takes a snapshot of what all your files look like at that
                  moment and stores a reference to that snapshot.
                </Text>
              </div>
              <div className="gv-type-sample">
                <span className="gv-type-label label-sm">Inline Code</span>
                <Text variant="body-md">
                  Use <CodeText>git init</CodeText> to create an empty repository, or <CodeText>git clone &lt;url&gt;</CodeText> to mirror an existing project.
                </Text>
              </div>
            </Stack>
          </Card>
        </Section>

        <Divider spacing="lg" />

        {/* 3. Button System */}
        <Section
          title="3. Button System & Actions"
          subtitle="Accessible button variants, icon controls, loading states, and copy-to-clipboard interactions."
        >
          <Stack gap="4">
            <div className="gv-demo-row">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary / Tonal</Button>
              <Button variant="outlined">Outlined</Button>
              <Button variant="tertiary">Tertiary / Text</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="elevated">Elevated</Button>
            </div>

            <div className="gv-demo-row">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" isLoading>Loading State</Button>
              <Button variant="primary" disabled>Disabled State</Button>
              <Button variant="primary" iconLeft={<Play size={14} />}>With Icon</Button>
            </div>

            <div className="gv-demo-row">
              <span className="label-md">Interactive Copy Button:</span>
              <CopyButton text="git checkout -b feature/auth" showLabel size="sm" variant="tonal" />
              <CopyButton text="https://gitverse.dev" variant="icon" size="sm" />
            </div>
          </Stack>
        </Section>

        <Divider spacing="lg" />

        {/* 4. Card System */}
        <Section
          title="4. Card System"
          subtitle="Versatile card variants for displaying modules, commands, achievements, and interactive widgets."
        >
          <Grid columns={4} gap="4">
            <Card variant="filled" padding="md">
              <Heading level={4}>Filled / Default</Heading>
              <Text variant="body-sm" color="muted">
                Flat subtle surface for grouping content without heavy shadows.
              </Text>
            </Card>

            <Card variant="elevated" padding="md">
              <Heading level={4}>Elevated Card</Heading>
              <Text variant="body-sm" color="muted">
                Elevated with soft M3 drop-shadows for high visual hierarchy.
              </Text>
            </Card>

            <Card variant="outlined" padding="md">
              <Heading level={4}>Outlined Card</Heading>
              <Text variant="body-sm" color="muted">
                Transparent body with crisp border outlines for secondary panels.
              </Text>
            </Card>

            <Card variant="highlighted" interactive padding="md">
              <Heading level={4}>Highlighted & Hover</Heading>
              <Text variant="body-sm" color="muted">
                Focus border and active hover lift for recommended items.
              </Text>
            </Card>
          </Grid>
        </Section>

        <Divider spacing="lg" />

        {/* 5. Badges, Status & Chips */}
        <Section
          title="5. Badges, Chips & Status Indicators"
          subtitle="Semantic metadata tags for difficulty rating, learning progress, categories, and filterable chips."
        >
          <Stack gap="4">
            <div className="gv-demo-row">
              <span className="label-sm gv-demo-label">Difficulty Badges:</span>
              <DifficultyBadge difficulty="beginner" />
              <DifficultyBadge difficulty="intermediate" />
              <DifficultyBadge difficulty="advanced" />
            </div>

            <div className="gv-demo-row">
              <span className="label-sm gv-demo-label">Learning Status Badges:</span>
              <StatusBadge status="not_started" />
              <StatusBadge status="in_progress" />
              <StatusBadge status="completed" />
              <StatusBadge status="locked" />
            </div>

            <div className="gv-demo-row">
              <span className="label-sm gv-demo-label">Filterable Chips:</span>
              <Chip
                selected={chipSelected.git}
                onClick={() => setChipSelected((prev) => ({ ...prev, git: !prev.git }))}
              >
                Git Core
              </Chip>
              <Chip
                selected={chipSelected.cli}
                onClick={() => setChipSelected((prev) => ({ ...prev, cli: !prev.cli }))}
              >
                CLI Commands
              </Chip>
              <Chip
                selected={chipSelected.branching}
                onClick={() => setChipSelected((prev) => ({ ...prev, branching: !prev.branching }))}
              >
                Branching
              </Chip>
            </div>
          </Stack>
        </Section>

        <Divider spacing="lg" />

        {/* 6. Feedback, Callouts & Progress */}
        <Section
          title="6. Feedback, Documentation Callouts & Progress"
          subtitle="Contextual alerts, notification banners, linear progress, and SVG circular gauges."
        >
          <Stack gap="4">
            <Grid columns={2} gap="4">
              <Callout type="tip" title="Pro Tip: Safe Branching">
                Always create a new branch when testing risky changes. Your <code>main</code> branch remains clean.
              </Callout>

              <Callout type="warning" title="Caution: Destructive Commands">
                <code>git reset --hard</code> permanently discards uncommitted changes in your working tree.
              </Callout>

              <Callout type="note" title="Note: Working Tree">
                Your working directory consists of actual files on your disk that you are currently editing.
              </Callout>

              <Callout type="interviewTip" title="Interview Tip">
                Interviewers frequently ask about the difference between working directory, staging area, and commit history.
              </Callout>
            </Grid>

            <Grid columns={2} gap="4">
              <StatusState
                type="success"
                title="Lesson Completed!"
                description="You've earned +20 XP and your 3-day streak remains active."
              />
              <StatusState
                type="info"
                title="Reference Mode Active"
                description="Viewing quick syntax and command cheat sheets without step-by-step guides."
              />
            </Grid>

            <Card variant="filled" padding="md">
              <Heading level={4} className="mb-3">Progress Indicators</Heading>
              <Grid columns={3} gap="4">
                <Stack gap="2">
                  <span className="label-sm">Linear Progress: 65%</span>
                  <ProgressBar value={65} max={100} color="primary" />
                </Stack>
                <div className="gv-circular-demo">
                  <CircularProgress value={45} variant="primary" size={60} />
                  <span className="label-sm">Module Progress</span>
                </div>
                <div className="gv-circular-demo">
                  <CircularProgress value={100} variant="success" size={60} />
                  <span className="label-sm">Completed Module</span>
                </div>
              </Grid>
            </Card>
          </Stack>
        </Section>

        <Divider spacing="lg" />

        {/* 7. Code, Command & Terminal UI */}
        <Section
          title="7. Code Blocks, Commands & Terminal Preview"
          subtitle="Monospace code displays, compact command bars, full command encyclopedia cards, and presentation terminal previews."
        >
          <Stack gap="4">
            <CommandBlock
              command="git commit -m 'feat: implement design tokens'"
              description="Record staged changes to local repository"
            />

            <CodeBlock
              language="bash"
              filename="quickstart.sh"
              showLineNumbers
              code={`# Initialize new Git repository\ngit init my-awesome-app\ncd my-awesome-app\n\n# Stage and commit files\ngit add .\ngit commit -m "feat: initial commit"`}
            />

            <TerminalPreview
              title="zsh"
              path="~/dev/gitverse"
              command="git status"
              output={`On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n\tmodified: src/styles/tokens.css\n\tnew file: src/components/layout/Container.tsx`}
            />

            <CommandCard
              command="git rebase -i HEAD~3"
              category="Branching & History"
              difficulty="advanced"
              explanation="Opens an interactive session allowing you to squash, reorder, edit, or drop the last 3 commits before pushing."
              tags={['interactive', 'history-rewrite', 'squash']}
              syntax="git rebase -i [commit-hash | HEAD~N]"
              context="Clean up messy intermediate commits prior to opening a pull request."
              example="git rebase -i origin/main"
              output="pick 3f2a1b1 feat: initial ui\nsquash 4b9c2d1 fix: typo in styles\npick 8a7e3f2 docs: update readme"
            />
          </Stack>
        </Section>

        <Divider spacing="lg" />

        {/* 8. Learning Content Primitives */}
        <Section
          title="8. Learning Content Components"
          subtitle="Header banners, learning objectives, key concepts, takeaways, and previous/next navigation."
        >
          <Card variant="outlined" padding="lg">
            <LessonHeader
              title="What is Git and Distributed Version Control?"
              moduleTitle="Git Fundamentals"
              difficulty="beginner"
              durationMinutes={8}
              summary="Understand the core mental model of version control systems, local repositories, and why Git powers modern software collaboration."
            />

            <Container width="reading" gutters={false}>
              <LearningObjective
                objectives={[
                  'Understand the fundamental difference between Centralized and Distributed VCS',
                  'Identify the Three States: Working Directory, Staging Index, and Git Repository',
                  'Learn how Git tracks snapshots rather than file differences',
                ]}
              />

              <KeyConcept title="The Three Trees Mental Model" conceptKey="CORE_CONCEPT">
                Git manages three distinct environments: your Working Directory (where you edit), the
                Staging Area (where you prepare upcoming commits), and the Git Directory (.git) where
                permanent snapshot records live.
              </KeyConcept>

              <TakeawayCard
                takeaways={[
                  'Git is completely local and does not require an active internet connection to commit.',
                  'Commits in Git are immutable cryptographic SHA-1/SHA-256 snapshots.',
                  'Always inspect your staged files using git status before committing.',
                ]}
              />

              <PreviousNextNavigation
                prev={{ title: 'Welcome to GitVerse', url: '#' }}
                next={{ title: 'Installing & Configuring Git', url: '#' }}
              />
            </Container>
          </Card>
        </Section>

        <Divider spacing="lg" />

        {/* 9. Evaluation: Interactive Quiz & Interview Foundations */}
        <Section
          title="9. Evaluation: Interactive Quiz & Technical Interview UI"
          subtitle="Interactive single-choice quiz cards with instant feedback and collapsible interview question accordions."
        >
          <Grid columns={2} gap="4">
            <QuizCard
              question={mockQuizQuestion}
              currentIndex={0}
              totalQuestions={5}
            />

            <InterviewQuestionCard item={mockInterviewQuestion} />
          </Grid>
        </Section>

        <Divider spacing="lg" />

        {/* 10. Gamification Foundation UI */}
        <Section
          title="10. Gamification & Motivation Widgets"
          subtitle="Subtle, calm, professional badges and milestone tracking."
        >
          <Stack gap="4">
            <div className="gv-demo-row">
              <XPBadge xp={25} />
              <LevelBadge level={3} title="Branch Navigator" />
              <StreakBadge days={7} />
            </div>

            <Grid columns={2} gap="4">
              <DailyChallengeCard
                challenge={{
                  id: 'dc-demo',
                  date: '2026-09-04',
                  difficulty: 'beginner',
                  type: 'command_recall',
                  xpReward: 30,
                  title: 'Working Tree Status Check',
                  titleBn: 'ওয়ার্কিং ট্রি স্ট্যাটাস চেক',
                  description: 'Which command shows the current state of your working directory and staging index?',
                  descriptionBn: 'কোন কমান্ডটি বর্তমান ওয়ার্কিং ডিরেক্টরি এবং স্টেজিং এরিয়ার অবস্থা প্রদর্শন করে?',
                  isCompleted: false,
                  options: [
                    { id: 'opt-1', text: 'git log', isCorrect: false },
                    { id: 'opt-2', text: 'git status', isCorrect: true },
                    { id: 'opt-3', text: 'git diff', isCorrect: false },
                    { id: 'opt-4', text: 'git show', isCorrect: false },
                  ],
                }}
                onComplete={() => {}}
              />

              <AchievementCard
                achievement={{
                  id: 'first-commit',
                  title: 'First Commit',
                  titleBn: 'প্রথম কমিট',
                  description: 'Complete your first Git lesson and mark it completed.',
                  descriptionBn: 'আপনার প্রথম গিট পাঠ সম্পন্ন করুন।',
                  iconName: 'GitCommit',
                  category: 'progress',
                  xpReward: 50,
                  isUnlocked: true,
                  unlockedAt: '2026-09-04T12:00:00Z',
                }}
              />
            </Grid>
          </Stack>
        </Section>

        <Divider spacing="lg" />

        {/* 11. Search UI & Dialog Modal */}
        <Section
          title="11. Search UI & Accessible Dialog Foundation"
          subtitle="Search input fields, categorized search result rows, empty states, and accessible dialogs."
        >
          <Grid columns={2} gap="4">
            <Card variant="filled" padding="md">
              <Heading level={4} className="mb-3">Search UI Primitives</Heading>
              <Stack gap="3">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  placeholder="Filter demonstration results..."
                />

                <SearchResultGroup title="Lessons" count={2}>
                  <SearchResultItem
                    title="What is Git and Distributed VCS?"
                    category="Git Fundamentals"
                    description="Introduction to version control and Git architecture"
                    iconType="lesson"
                  />
                  <SearchResultItem
                    title="Git Branching in Depth"
                    category="Branching"
                    description="Creating, switching, and merging branches"
                    iconType="lesson"
                  />
                </SearchResultGroup>

                <SearchResultGroup title="Commands" count={1}>
                  <SearchResultItem
                    title="git status"
                    category="Inspection"
                    description="Show the working tree status"
                    iconType="command"
                  />
                </SearchResultGroup>
              </Stack>
            </Card>

            <Card variant="filled" padding="md">
              <Heading level={4} className="mb-3">Accessible Dialog / Modal</Heading>
              <Text variant="body-sm" color="muted" className="mb-4">
                Full focus-trapped dialog with backdrop dismiss, Escape keyboard listener, and screen-reader accessibility.
              </Text>
              <Button variant="primary" onClick={() => setIsDemoModalOpen(true)}>
                Open Accessible Dialog Demo
              </Button>
            </Card>
          </Grid>
        </Section>
      </Container>

      {/* Accessible Demo Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="GitVerse Dialog Foundation"
      >
        <Stack gap="3">
          <Text variant="body-md">
            This dialog satisfies all Material 3 elevation and accessibility standards. Press{' '}
            <kbd className="code-inline">Escape</kbd> or click the backdrop to close.
          </Text>
          <Callout type="tip" title="Keyboard Navigation">
            Focus is trapped within this dialog while open, and restored when closed.
          </Callout>
          <div className="gv-modal-actions">
            <Button variant="outlined" onClick={() => setIsDemoModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsDemoModalOpen(false)}>
              Understood
            </Button>
          </div>
        </Stack>
      </Modal>
    </div>
  );
};
