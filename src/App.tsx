import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from '@/contexts/DataContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { Header } from '@/components/layout/Header';
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

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <ToastProvider>
          <Router basename="/personal-growth-timeline">
            <Layout>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/questions" element={<QuestionsPage />} />
              <Route path="/reflection" element={<ReflectionPage />} />
              <Route path="/activity/:id" element={<ActivityDetailPage />} />
              <Route path="/activity/create" element={<CreateActivityPage />} />
              <Route path="/activity/edit/:id" element={<EditActivityPage />} />
              <Route path="/question/create" element={<CreateQuestionPage />} />
              <Route path="/question/edit/:id" element={<EditQuestionPage />} />
              <Route path="/reflection/create" element={<CreateReflectionPage />} />
              <Route path="/reflection/edit/:id" element={<EditReflectionPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/stats" element={<StatsPage />} />
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </DataProvider>
  </LanguageProvider>
  );
}