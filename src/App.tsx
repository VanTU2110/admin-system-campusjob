import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/auth/login';
import StudentPage from './pages/student';
import CompanyPage from './pages/company';
import SkillPage from './pages/skills';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import StudentDetailPage from './pages/student/studentdetail';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Bọc Layout trong RequireAuth */}
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/skill" element={<SkillPage />} />
        <Route path="/reports" element={<div>Báo cáo</div>} />
        <Route path="/student-detail/:studentUuid" element={<StudentDetailPage />} />

      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
