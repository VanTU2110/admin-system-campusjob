import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building,
  GraduationCap,
  Settings2,
  FileBarChart2,
  LogOut,
} from 'lucide-react';

const menu = [
  { label: 'Công ty', path: '/company', icon: <Building size={20} /> },
  { label: 'Sinh viên', path: '/student', icon: <GraduationCap size={20} /> },
  { label: 'Kĩ năng', path: '/skill', icon: <Settings2 size={20} /> },
  { label: 'Báo cáo', path: '/reports', icon: <FileBarChart2 size={20} /> },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // hoặc 'accessToken' tùy cách bạn lưu
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between fixed left-0 top-0 p-5">
      <div>
        <h1 className="text-2xl font-bold mb-8">Quản trị</h1>
        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                location.pathname === item.path
                  ? 'bg-gray-700'
                  : 'hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Nút đăng xuất */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 mt-10 rounded-md bg-red-600 hover:bg-red-700 transition"
      >
        <LogOut size={20} />
        <span>Đăng xuất</span>
      </button>
    </aside>
  );
}
