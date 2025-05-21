import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building,
  GraduationCap,
  Settings2,
  BriefcaseBusiness,
  FileBarChart2,
  
  LogOut,
} from 'lucide-react';
import { logout } from '../services/authService';

const menu = [
  { label: 'Công ty', path: '/company', icon: <Building size={20} /> },
  { label: 'Công việc', path: '/job', icon: <BriefcaseBusiness size={20} /> },
  { label: 'Sinh viên', path: '/student', icon: <GraduationCap size={20} /> },
  { label: 'Kĩ năng', path: '/skill', icon: <Settings2 size={20} /> },
  { label: 'Báo cáo', path: '/reports', icon: <FileBarChart2 size={20} /> },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Gọi API để backend xử lý đăng xuất
    } catch (error) {
      console.error('Lỗi khi gọi logout service:', error);
      // Có thể toast.warning('Không thể kết nối máy chủ') nếu muốn
    } finally {
      localStorage.removeItem('token'); // Xóa token phía frontend
      navigate('/login'); // Điều hướng về trang đăng nhập
    }
  };
  

  return (
    <aside className="w-64 h-screen bg-[#f4f6f8] text-gray-800 flex flex-col justify-between fixed left-0 top-0 p-6 border-r border-gray-200 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold mb-8">🎓 Quản trị</h1>
        <nav className="space-y-2">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white shadow text-blue-600'
                    : 'hover:bg-gray-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
       className="w-full flex bg-sky-50 items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 font-medium transition-all duration-200"
      >
        <LogOut size={20} />
        <span>Đăng xuất</span>
      </button>
    </aside>
  );
}
