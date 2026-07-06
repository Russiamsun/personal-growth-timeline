import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import Home from '@/pages/Home';
import YearPage from '@/pages/YearPage';
import RecordPage from '@/pages/RecordPage';
import CreatePage from '@/pages/CreatePage';
import EditPage from '@/pages/EditPage';

// 占位页面组件
function ArticlesPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">文章页面</h1>
        <p className="text-gray-600">功能开发中...</p>
      </div>
    </div>
  );
}

function TimelinePage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">时光轴页面</h1>
        <p className="text-gray-600">功能开发中...</p>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">关于页面</h1>
        <p className="text-gray-600">功能开发中...</p>
      </div>
    </div>
  );
}

// Layout组件
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      {/* 添加padding-top避免内容被固定的Header遮挡 */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/year/:year" element={<YearPage />} />
          <Route path="/record/:id" element={<RecordPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit/:id" element={<EditPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
