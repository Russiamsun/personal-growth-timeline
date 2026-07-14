import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from '@/contexts/DataContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { EditModeProvider, useEditMode } from '@/contexts/EditModeContext';
import { Header } from '@/components/layout/Header';
import { ErrorBoundary } from '@/components/common';
import Home from '@/pages/Home';
import ExperiencesPage from '@/pages/ExperiencesPage';
import QuestionsPage from '@/pages/QuestionsPage';
import ReflectionPage from '@/pages/ReflectionPage';
import ActivityDetailPage from '@/pages/ActivityDetailPage';
import TimelinePage from '@/pages/TimelinePage';
import StatsPage from '@/pages/StatsPage';
import CreateActivityPage from '@/pages/CreateActivityPage';
import EditActivityPage from '@/pages/EditActivityPage';
import CreateQuestionPage from '@/pages/CreateQuestionPage';
import EditQuestionPage from '@/pages/EditQuestionPage';
import CreateReflectionPage from '@/pages/CreateReflectionPage';
import EditReflectionPage from '@/pages/EditReflectionPage';

// Layout组件
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}

// 编辑路由守卫组件 - 未开启编辑模式时重定向到首页
function EditRoute({ children }: { children: React.ReactNode }) {
  const { isEditMode } = useEditMode();
  
  if (!isEditMode) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <DataProvider>
          <ToastProvider>
            <EditModeProvider>
              <Router basename="/personal-growth-timeline">
                <Layout>
                  <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/experiences" element={<ExperiencesPage />} />
                  <Route path="/questions" element={<QuestionsPage />} />
                  <Route path="/reflection" element={<ReflectionPage />} />
                  <Route path="/activity/:id" element={<ActivityDetailPage />} />
                  <Route path="/activity/create" element={<EditRoute><CreateActivityPage /></EditRoute>} />
                  <Route path="/activity/edit/:id" element={<EditRoute><EditActivityPage /></EditRoute>} />
                  <Route path="/question/create" element={<EditRoute><CreateQuestionPage /></EditRoute>} />
                  <Route path="/question/edit/:id" element={<EditRoute><EditQuestionPage /></EditRoute>} />
                  <Route path="/reflection/create" element={<EditRoute><CreateReflectionPage /></EditRoute>} />
                  <Route path="/reflection/edit/:id" element={<EditRoute><EditReflectionPage /></EditRoute>} />
                  <Route path="/timeline" element={<TimelinePage />} />
                  <Route path="/stats" element={<StatsPage />} />
                </Routes>
              </Layout>
            </Router>
          </EditModeProvider>
        </ToastProvider>
      </DataProvider>
    </LanguageProvider>
    </ErrorBoundary>
  );
}