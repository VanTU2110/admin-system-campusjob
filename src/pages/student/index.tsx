import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, Tooltip, Spin, Empty, Modal, Select, DatePicker, Form, message } from 'antd';
import { SearchOutlined, UserAddOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { getPageListStudent } from '../../services/studentService';
import type { StudentDetail, ListStudentResponse } from '../../types/student';
import type { Location } from '../../types/location';
import type { Pagination } from '../../types/pagination';

const { Option } = Select;

const StudentPage = () => {
  const [students, setStudents] = useState<StudentDetail[]>([]);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    page: 1,
    totalCount: 0,
    totalPage: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [genderFilter, setGenderFilter] = useState<number | null>(null);

  // Fetch student data
  const fetchStudents = async (page = 1, pageSize = 10, keyword = '') => {
    setLoading(true);
    try {
      const response = await getPageListStudent({
        page,
        pageSize,
        keyword: keyword.trim() || undefined,
      });
      
      // Debug response format
      console.log('API Response:', response);
      
      // Kiểm tra cấu trúc response và xử lý theo cấu trúc thực tế
      if (response && response.data && response.data.items) {
        setStudents(response.data.items);
        if (response.data.pagination) {
          setPagination({
            page: page,
            pageSize: pageSize,
            totalCount: response.data.pagination.totalCount,
            totalPage: response.data.pagination.totalPage
          });
        }
      } else {
        console.error('Invalid response structure:', response);
        message.error('Không thể lấy dữ liệu sinh viên');
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      message.error('Đã xảy ra lỗi khi tải dữ liệu');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(pagination.page, pagination.pageSize, searchKeyword);
  }, []);

  const handleTableChange = (tablePagination: any) => {
    fetchStudents(tablePagination.current, tablePagination.pageSize, searchKeyword);
  };

  const handleSearch = () => {
    fetchStudents(1, pagination.pageSize, searchKeyword);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewStudent = (student: StudentDetail) => {
    setSelectedStudent(student);
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
    setSelectedStudent(null);
  };

  const getGenderLabel = (gender: number) => {
    switch (gender) {
      case 0:
        return <Tag color="blue">Nam</Tag>;
      case 1:
        return <Tag color="pink">Nữ</Tag>;
      default:
        return <Tag color="purple">Khác</Tag>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };
  
  const formatLocation = (location: Location | undefined) => {
    if (!location) return 'N/A';
    return location.name || 'N/A';
  };

  const applyFilters = (data: StudentDetail[]) => {
    let filteredData = [...data];
    
    if (genderFilter !== null) {
      filteredData = filteredData.filter(student => student.gender === genderFilter);
    }
    
    return filteredData;
  };

  const resetFilters = () => {
    setGenderFilter(null);
    fetchStudents(1, pagination.pageSize, searchKeyword);
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (text: string, record: StudentDetail) => (
        <span className="font-medium">{text || 'N/A'}</span>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: number) => getGenderLabel(gender),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Trường đại học',
      dataIndex: 'university',
      key: 'university',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text || 'N/A'}>
          <span>{text || 'N/A'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Chuyên ngành',
      dataIndex: 'major',
      key: 'major',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text || 'N/A'}>
          <span>{text || 'N/A'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: StudentDetail) => (
        <Space size="small">
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => handleViewStudent(record)}
            className="text-blue-500 hover:text-blue-700"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            className="text-green-500 hover:text-green-700"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-500 hover:text-red-700"
          />
        </Space>
      ),
    },
  ];

  const filteredStudents = applyFilters(students);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card 
        className="shadow-md" 
        title={
          <div className="flex items-center text-xl font-bold">
            <span className="mr-2">Quản lý sinh viên</span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Thêm sinh viên
          </Button>
        }
      >
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
            <Input.Search
              placeholder="Tìm kiếm sinh viên..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              onKeyPress={handleKeyPress}
              className="w-full sm:w-64"
              allowClear
            />
            
            <Select
              placeholder="Lọc theo giới tính"
              className="w-full sm:w-40"
              value={genderFilter}
              onChange={setGenderFilter}
              allowClear
            >
              <Option value={0}>Nam</Option>
              <Option value={1}>Nữ</Option>
              <Option value={2}>Khác</Option>
            </Select>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button 
              icon={<FilterOutlined />} 
              onClick={resetFilters}
              className="bg-gray-200 hover:bg-gray-300"
            >
              Xóa bộ lọc
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => fetchStudents(pagination.page, pagination.pageSize, searchKeyword)}
              className="bg-gray-200 hover:bg-gray-300"
            >
              Làm mới
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Spin size="large" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <Empty description="Không tìm thấy sinh viên nào" />
        ) : (
          <div className="overflow-x-auto">
            <Table
              dataSource={filteredStudents}
              columns={columns}
              rowKey="uuid"
              pagination={{
                current: pagination.page,
                pageSize: pagination.pageSize,
                total: pagination.totalCount,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Tổng cộng: ${total} sinh viên`,
              }}
              onChange={handleTableChange}
              className="bg-white"
            />
          </div>
        )}
      </Card>

      {/* Student Detail Modal */}
      <Modal
        title="Thông tin chi tiết sinh viên"
        open={viewModalVisible}
        onCancel={closeViewModal}
        footer={[
          <Button key="close" onClick={closeViewModal}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-xl font-bold text-center mb-2">{selectedStudent.fullname || 'N/A'}</h3>
              <div className="flex justify-center">
                {getGenderLabel(selectedStudent.gender)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Mã sinh viên</p>
                <p className="font-medium">{selectedStudent.uuid || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Ngày sinh</p>
                <p className="font-medium">{formatDate(selectedStudent.birthday)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Số điện thoại</p>
                <p className="font-medium">{selectedStudent.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Trường đại học</p>
                <p className="font-medium">{selectedStudent.university || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Chuyên ngành</p>
                <p className="font-medium">{selectedStudent.major || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Mã người dùng</p>
                <p className="font-medium">{selectedStudent.userUuid || 'N/A'}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Địa chỉ</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Tỉnh/Thành phố</p>
                  <p className="font-medium">{formatLocation(selectedStudent.tp)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Quận/Huyện</p>
                  <p className="font-medium">{formatLocation(selectedStudent.qh)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phường/Xã</p>
                  <p className="font-medium">{formatLocation(selectedStudent.xa)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentPage;