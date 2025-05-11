import { Form, Input, Button, Typography, message, Card } from 'antd';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values: FormData) => {
    try {
      const res = await login(values);

      if (res.error.code !== 'success') {
        message.error('Đăng nhập thất bại!');
        return;
      }

      const { token, role, uuid } = res.data;

      if (role !== 3) {
        message.warning('Không có quyền đăng nhập vào admin system.');
        return;
      }
      localStorage.setItem('token', token);
      localStorage.setItem('useruuid', String(uuid));
        navigate('/student');
      
    } catch (err) {
      message.error('Sai tài khoản hoặc mật khẩu!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center mb-8">
        <Title level={2} className="text-gray-800">
          Chào mừng đến với
        </Title>
        <Paragraph className="text-lg text-gray-600">
          Trang quản trị hệ thống tuyển dụng
        </Paragraph>
      </div>

      <Card className="w-full max-w-md shadow-lg" bordered={false}>
        <Title level={3} className="text-center mb-6">
          Đăng nhập công ty
        </Title>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ email: '', password: '' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-blue-600 hover:bg-blue-700"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        
      </Card>
    </div>
  );
};

export default LoginPage;
