import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, Tooltip, Spin, Empty, Modal, Select, Collapse, Typography, Divider, message } from 'antd';
import { SearchOutlined, UserAddOutlined, InfoCircleOutlined, ReloadOutlined, FilterOutlined, FileTextOutlined, CloseOutlined } from '@ant-design/icons';
import { getPageListStudent } from '../../services/studentService';
import { getPageListReport } from '../../services/reportService';
import type { StudentDetail, ListStudentResponse } from '../../types/student';
import type { Report, ListReportResponse } from '../../types/report';
import type { Location } from '../../types/location';
import type { Pagination } from '../../types/pagination';

const { Option } = Select;
const { Title, Text } = Typography;
const { Panel } = Collapse;

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
  
  // Thêm state cho báo cáo
  const [showReports, setShowReports] = useState<boolean>(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState<boolean>(false);
  const [reportsPagination, setReportsPagination] = useState({
    pageSize: 5,
    page: 1,
    totalCount: 0,
    totalPage: 1,
  });
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<StudentDetail | null>(null);

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

  // Thêm hàm fetch báo cáo
  const fetchReports = async (targetUuid: string, page = 1, pageSize = 5) => {
    setReportsLoading(true);
    try {
      const response = await getPageListReport({
        page,
        pageSize,
        targetType: 'student',
        targetUuid,
      });
      
      console.log('Report API Response:', response);
      
      if (response && response.data && response.data.items) {
        setReports(response.data.items);
        if (response.data.pagination) {
          setReportsPagination({
            page: page,
            pageSize: pageSize,
            totalCount: response.data.pagination.totalCount,
            totalPage: response.data.pagination.totalPage
          });
        }
      } else {
        console.error('Invalid report response structure:', response);
        message.error('Không thể lấy dữ liệu báo cáo');
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      message.error('Đã xảy ra lỗi khi tải dữ liệu báo cáo');
      setReports([]);
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(pagination.page, pagination.pageSize, searchKeyword);
  }, []);

  const handleTableChange = (tablePagination: any) => {
    fetchStudents(tablePagination.current, tablePagination.pageSize, searchKeyword);
  };

  // Xử lý thay đổi phân trang báo cáo
  const handleReportTableChange = (tablePagination: any) => {
    if (selectedStudent) {
      fetchReports(selectedStudent.uuid, tablePagination.current, tablePagination.pageSize);
    }
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

  // Xử lý khi nhấn xem báo cáo
  const handleViewReports = (student: StudentDetail) => {
    // Nếu đã đang xem báo cáo của sinh viên này, đóng lại
    if (showReports && selectedStudentForReport?.uuid === student.uuid) {
      setShowReports(false);
      setSelectedStudentForReport(null);
      setReports([]);
    } else {
      // Nếu chưa xem hoặc đang xem báo cáo của sinh viên khác
      setSelectedStudentForReport(student);
      setShowReports(true);
      fetchReports(student.uuid);
    }
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
    setSelectedStudent(null);
  };

  // Đóng phần báo cáo
  const closeReports = () => {
    setShowReports(false);
    setSelectedStudentForReport(null);
    setReports([]);
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

  const getReportStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Tag color="orange">Chờ xử lý</Tag>;
      case 'processing':
        return <Tag color="blue">Đang xử lý</Tag>;
      case 'resolved':
        return <Tag color="green">Đã giải quyết</Tag>;
      case 'rejected':
        return <Tag color="red">Từ chối</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
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
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<FileTextOutlined />}
            onClick={() => handleViewReports(record)}
            className="text-orange-500 hover:text-orange-700"
            title="Xem báo cáo"
          />
        </Space>
      ),
    },
  ];

  // Định nghĩa cột cho bảng báo cáo
  const reportColumns = [
    {
      title: 'Mã báo cáo',
      dataIndex: 'uuid',
      key: 'uuid',
      render: (text: string) => (
        <span className="font-medium">{text || 'N/A'}</span>
      ),
      ellipsis: true,
    },
    {
      title: 'Người báo cáo',
      dataIndex: 'reporterUuid',
      key: 'reporterUuid',
      render: (text: string) => (
        <span>{text || 'N/A'}</span>
      ),
      ellipsis: true,
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text || 'N/A'}>
          <span>{text || 'N/A'}</span>
        </Tooltip>
      ),
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getReportStatusLabel(status),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
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

      {/* Reports Section */}
      {showReports && selectedStudentForReport && (
        <Card 
          className="shadow-md mt-6" 
          title={
            <div className="flex justify-between items-center">
              <Title level={4} className="m-0">
                Báo cáo về sinh viên: {selectedStudentForReport.fullname}
              </Title>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={closeReports}
                className="text-gray-500"
              />
            </div>
          }
        >
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Text type="secondary" className="block">Họ tên</Text>
                  <Text strong>{selectedStudentForReport.fullname || 'N/A'}</Text>
                </div>
                <div>
                  <Text type="secondary" className="block">Mã sinh viên</Text>
                  <Text strong>{selectedStudentForReport.uuid || 'N/A'}</Text>
                </div>
                <div>
                  <Text type="secondary" className="block">Trường</Text>
                  <Text strong>{selectedStudentForReport.university || 'N/A'}</Text>
                </div>
              </div>
            </div>
            
            <div>
              <Divider orientation="left">Danh sách báo cáo</Divider>
              
              {reportsLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Spin size="large" />
                </div>
              ) : reports.length === 0 ? (
                <Empty description="Không có báo cáo nào về sinh viên này" />
              ) : (
                <div className="overflow-x-auto">
                  <Table
                    dataSource={reports}
                    columns={reportColumns}
                    rowKey="uuid"
                    pagination={{
                      current: reportsPagination.page,
                      pageSize: reportsPagination.pageSize,
                      total: reportsPagination.totalCount,
                      showSizeChanger: true,
                      showTotal: (total) => `Tổng cộng: ${total} báo cáo`,
                    }}
                    onChange={handleReportTableChange}
                    className="bg-white"
                    expandable={{
                      expandedRowRender: (record) => (
                        <div className="p-4 bg-gray-50">
                          <Text strong className="block mb-2">Mô tả chi tiết:</Text>
                          <Text>{record.description || 'Không có mô tả'}</Text>
                        </div>
                      ),
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentPage;