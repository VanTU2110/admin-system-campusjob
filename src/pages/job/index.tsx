import React, { useState, useEffect } from "react";
import { 
  Table, Card, Input, Button, Tag, Space, Modal, Tabs,
  Select, Form, InputNumber, Pagination, Spin, Badge, Tooltip,
  Drawer, Divider, Typography, DatePicker, Empty, Popconfirm, message
} from "antd";
import { 
  SearchOutlined, FileSearchOutlined, FilterOutlined,
  CalendarOutlined, TeamOutlined, DollarOutlined,
  EyeOutlined, SyncOutlined, ClockCircleOutlined,
  InfoCircleOutlined, BankOutlined, BarsOutlined,
  FileTextOutlined, WarningOutlined, CloseOutlined
} from "@ant-design/icons";

import { getListPageJob, detailJob } from "../../services/jobService";
import type { JobItem, GetJobListParams } from "../../types/job";
import { getPageListReport } from '../../services/reportService';
import type { Report, ListReportResponse } from '../../types/report';
import { getPageCompany } from "../../services/companyService";
import type { CompanyDetail, GetPageCompanyParams } from '../../types/company';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const JobsPage = () => {
  // State
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<GetJobListParams>({
    page: 1,
    pageSize: 10,
  });
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  
  // Report states
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState<boolean>(false);
  const [reportParams, setReportParams] = useState({
    page: 1,
    pageSize: 10,
    targetUuid: ''
  });
  const [reportTotalItems, setReportTotalItems] = useState<number>(0);
  const [reportTotalPages, setReportTotalPages] = useState<number>(0);
  const [showReports, setShowReports] = useState<boolean>(false);
  
  // Company states for filter
  const [companies, setCompanies] = useState<CompanyDetail[]>([]);
  const [companyLoading, setCompanyLoading] = useState<boolean>(false);
  const [companySearch, setCompanySearch] = useState<string>('');

  // Constants for job properties
  const jobTypes = [
    { value: "remote", label: "Remote", color: "blue" },
    { value: "parttime", label: "Part Time", color: "purple" },
    { value: "internship", label: "Internship", color: "green" },
    { value: "fulltime", label: "Full Time", color: "geekblue" },
  ];
  
  const salaryTypes = [
    { value: "fixed", label: "Fixed", color: "cyan" },
    { value: "monthly", label: "Monthly", color: "volcano" },
    { value: "daily", label: "Daily", color: "orange" },
    { value: "hourly", label: "Hourly", color: "gold" },
  ];

  // Report status colors
  const reportStatusColors = {
    "PENDING": "orange",
    "APPROVED": "green",
    "REJECTED": "red",
    "RESOLVED": "blue"
  };

  // Fetch jobs on mount and when params change
  useEffect(() => {
    fetchJobs();
  }, [params]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getListPageJob(params);
      
      if (response && response.data) {
        setJobs(response.data.items);
        setTotalItems(response.data.pagination.totalCount);
        setTotalPages(response.data.pagination.totalPage);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewJobDetail = async (uuid: string) => {
    try {
      setDetailLoading(true);
      const response = await detailJob(uuid);
      
      if (response && response.data) {
        setSelectedJob(response.data);
        setVisible(true);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  // Fetch reports for a job
  const fetchReports = async (jobUuid: string) => {
    try {
      setReportsLoading(true);
      const response = await getPageListReport({
        ...reportParams,
        targetUuid: jobUuid
      });
      
      if (response && response.data) {
        setReports(response.data.items);
        setReportTotalItems(response.data.pagination.totalCount);
        setReportTotalPages(response.data.pagination.totalPage);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setReportsLoading(false);
    }
  };

  // Handle view reports for a job
  const handleViewReports = (jobUuid: string) => {
    setReportParams(prev => ({
      ...prev,
      page: 1,
      targetUuid: jobUuid
    }));
    fetchReports(jobUuid);
    setShowReports(true);
  };

  // Handle close reports section
  const handleCloseReports = () => {
    setShowReports(false);
    setReports([]);
    setReportParams(prev => ({
      ...prev,
      targetUuid: ''
    }));
  };

  // Fetch companies for filter
  const fetchCompanies = async (search: string = '') => {
    try {
      setCompanyLoading(true);
      const response = await getPageCompany({
        page: 1,
        pageSize: 10,
        keyword: search
      });
      
      if (response && response.data) {
        setCompanies(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setCompanyLoading(false);
    }
  };

  // Handle company search
  const handleCompanySearch = (value: string) => {
    setCompanySearch(value);
    fetchCompanies(value);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setParams(prev => ({
      ...prev,
      page,
      pageSize
    }));
  };

  const handleReportPageChange = (page: number, pageSize: number) => {
    setReportParams(prev => ({
      ...prev,
      page,
      pageSize
    }));
    fetchReports(reportParams.targetUuid);
  };

  const handleSearch = (value: string) => {
    setParams(prev => ({
      ...prev,
      page: 1,
      keyword: value
    }));
  };

  const handleFilterSubmit = (values: any) => {
    setParams(prev => ({
      ...prev,
      page: 1,
      ...values
    }));
    setFilterVisible(false);
  };

  const resetFilters = () => {
    form.resetFields();
    setParams({
      page: 1,
      pageSize: params.pageSize
    });
    setFilterVisible(false);
  };

  // Format salary display
  const formatSalary = (job: JobItem) => {
    const { salaryType, salaryMin, salaryMax, salaryFixed, currency } = job;
    
    if (salaryType === "fixed" && salaryFixed) {
      return `${salaryFixed.toLocaleString()} ${currency}`;
    } else if (salaryMin && salaryMax) {
      return `${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()} ${currency}`;
    } else if (salaryMin) {
      return `From ${salaryMin.toLocaleString()} ${currency}`;
    } else if (salaryMax) {
      return `Up to ${salaryMax.toLocaleString()} ${currency}`;
    }
    
    return "Thương lượng";
  };

  // Get job type tag color
  const getJobTypeColor = (type: string) => {
    const jobType = jobTypes.find(t => t.value === type);
    return jobType ? jobType.color : "default";
  };

  // Get salary type label
  const getSalaryTypeLabel = (type: string) => {
    const salaryType = salaryTypes.find(t => t.value === type);
    return salaryType ? salaryType.label : type;
  };

  // Render days of week schedule
  const renderSchedule = (schedule: any[]) => {
    if (!schedule || schedule.length === 0) return <Text className="text-gray-500">Không có lịch cụ thể</Text>;
    
    // Group by day of week
    const scheduleByDay: any = {};
    schedule.forEach(s => {
      if (!scheduleByDay[s.dayOfWeek]) {
        scheduleByDay[s.dayOfWeek] = [];
      }
      scheduleByDay[s.dayOfWeek].push(`${s.startTime.substring(0, 5)} - ${s.endTime.substring(0, 5)}`);
    });
    
    const dayNames: any = {
      "MONDAY": "Thứ Hai",
      "TUESDAY": "Thứ Ba",
      "WEDNESDAY": "Thứ Tư",
      "THURSDAY": "Thứ Năm",
      "FRIDAY": "Thứ Sáu",
      "SATURDAY": "Thứ Bảy",
      "SUNDAY": "Chủ Nhật"
    };
    
    return (
      <div className="grid grid-cols-1 gap-1">
        {Object.keys(scheduleByDay).map(day => (
          <div key={day} className="flex gap-2">
            <Badge status="processing" />
            <Text strong>{dayNames[day] || day}:</Text>
            <Text>{scheduleByDay[day].join(", ")}</Text>
          </div>
        ))}
      </div>
    );
  };

  // Table columns
  const columns = [
    {
      title: "Công ty",
      dataIndex: "company",
      key: "company",
      render: (company: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-2">
            {company.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{company.name}</div>
            <div className="text-xs text-gray-500">{company.code}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Tiêu đề công việc",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: JobItem) => (
        <div>
          <div className="font-medium">{title}</div>
          <div className="mt-1">
            <Tag color={getJobTypeColor(record.jobType)}>{record.jobType.toUpperCase()}</Tag>
            {record.listSkill && record.listSkill.slice(0, 2).map(jobSkill => (
              <Tag key={jobSkill.uuid} className="mr-1 mt-1">{jobSkill.skill.name}</Tag>
            ))}
            {record.listSkill && record.listSkill.length > 2 && (
              <Tag className="mt-1">+{record.listSkill.length - 2}</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Lương",
      dataIndex: "salary",
      key: "salary",
      render: (_: any, record: JobItem) => (
        <div>
          <div className="font-medium">{formatSalary(record)}</div>
          <div className="text-xs text-gray-500">{getSalaryTypeLabel(record.salaryType)}</div>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created",
      key: "created",
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString("vi-VN");
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: JobItem) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewJobDetail(record.uuid)}
          >
            Chi tiết
          </Button>
          <Button
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => handleViewReports(record.uuid)}
          >
            Báo cáo
          </Button>
        </Space>
      ),
    },
  ];

  // Report table columns
  const reportColumns = [
    {
      title: "ID Báo cáo",
      dataIndex: "uuid",
      key: "uuid",
      render: (uuid: string) => (
        <Tooltip title={uuid}>
          <span>{uuid.substring(0, 8)}...</span>
        </Tooltip>
      ),
    },
    {
      title: "Người báo cáo",
      dataIndex: "reporterUuid",
      key: "reporterUuid",
      render: (reporterUuid: string) => (
        <Tooltip title={reporterUuid}>
          <span>{reporterUuid.substring(0, 8)}...</span>
        </Tooltip>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={reportStatusColors[status as keyof typeof reportStatusColors] || "default"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString("vi-VN");
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Report) => (
        <Space size="middle">
          <Button size="small" icon={<EyeOutlined />}>
            Xem
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa báo cáo này?"
            onConfirm={() => message.success('Đã xóa báo cáo')}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small" icon={<CloseOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card bordered={false} className="mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <Title level={3} className="m-0">Quản lý Công việc</Title>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 w-full md:w-auto">
            <Input
              placeholder="Tìm kiếm công việc..."
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
              className="w-full md:w-64"
            />
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => {
                setFilterVisible(true);
                fetchCompanies();
              }}
            >
              Bộ lọc
            </Button>
            <Button 
              type="primary" 
              icon={<SyncOutlined />} 
              onClick={() => fetchJobs()}
            >
              Làm mới
            </Button>
          </div>
        </div>
        
        <Table
          columns={columns}
          dataSource={jobs}
          rowKey="uuid"
          loading={loading}
          pagination={false}
          className="mb-4"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có dữ liệu"
              />
            )
          }}
        />
        
        <div className="flex justify-between items-center mt-4 flex-wrap">
          <div className="text-gray-500 mb-2 md:mb-0">
            Hiển thị {jobs.length} / {totalItems} công việc
          </div>
          <Pagination
            current={params.page}
            pageSize={params.pageSize}
            total={totalItems}
            showSizeChanger
            onChange={handlePageChange}
            showTotal={(total) => `Tổng ${total} công việc`}
          />
        </div>
      </Card>

      {/* Reports Section */}
      {showReports && (
        <Card 
          bordered={false} 
          className="mb-4"
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <WarningOutlined className="mr-2 text-red-500" />
                <span>Danh sách báo cáo</span>
              </div>
              <Button 
                icon={<CloseOutlined />} 
                size="small" 
                onClick={handleCloseReports}
              />
            </div>
          }
          extra={
            <Button 
              type="primary" 
              size="small" 
              icon={<SyncOutlined />} 
              onClick={() => fetchReports(reportParams.targetUuid)}
            >
              Làm mới
            </Button>
          }
        >
          <Table
            columns={reportColumns}
            dataSource={reports}
            rowKey="uuid"
            loading={reportsLoading}
            pagination={false}
            className="mb-4"
            expandable={{
              expandedRowRender: (record) => (
                <div className="p-4 bg-gray-50 rounded">
                  <Text strong>Mô tả chi tiết:</Text>
                  <Paragraph className="mt-2">{record.description || "Không có mô tả chi tiết"}</Paragraph>
                </div>
              ),
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Không có báo cáo"
                />
              )
            }}
          />
          
          <div className="flex justify-between items-center mt-4 flex-wrap">
            <div className="text-gray-500 mb-2 md:mb-0">
              Hiển thị {reports.length} / {reportTotalItems} báo cáo
            </div>
            <Pagination
              current={reportParams.page}
              pageSize={reportParams.pageSize}
              total={reportTotalItems}
              showSizeChanger
              onChange={handleReportPageChange}
              showTotal={(total) => `Tổng ${total} báo cáo`}
            />
          </div>
        </Card>
      )}

      {/* Filter Drawer */}
      <Drawer
        title="Bộ lọc nâng cao"
        placement="right"
        width={320}
        onClose={() => setFilterVisible(false)}
        open={filterVisible}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={resetFilters}>Đặt lại</Button>
            <Button 
              type="primary" 
              onClick={() => form.submit()}
            >
              Áp dụng
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFilterSubmit}
          initialValues={params}
        >
          <Form.Item name="companyUuid" label="Công ty">
            <Select
              placeholder="Chọn công ty"
              allowClear
              showSearch
              filterOption={false}
              onSearch={handleCompanySearch}
              loading={companyLoading}
            >
              {companies.map(company => (
                <Option key={company.uuid} value={company.uuid}>
                  {company.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="jobType" label="Loại công việc">
            <Select
              placeholder="Chọn loại công việc"
              allowClear
            >
              {jobTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  <Tag color={type.color}>{type.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="salaryType" label="Loại lương">
            <Select
              placeholder="Chọn loại lương"
              allowClear
            >
              {salaryTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Divider orientation="left" plain>Mức lương</Divider>
          
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="salaryMin" label="Tối thiểu">
              <InputNumber
                placeholder="Min"
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value ? value.replace(/\$\s?|(,*)/g, '') : ''}
                className="w-full"
              />
            </Form.Item>
            
            <Form.Item name="salaryMax" label="Tối đa">
              <InputNumber
                placeholder="Max"
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value ? value.replace(/\$\s?|(,*)/g, '') : ''}
                className="w-full"
              />
            </Form.Item>
          </div>
          
          <Form.Item name="status" label="Trạng thái">
            <Select
              placeholder="Chọn trạng thái"
              allowClear
            >
              <Option value={1}>Đang hoạt động</Option>
              <Option value={0}>Ngừng hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Job Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileSearchOutlined />
            <span>Chi tiết công việc</span>
          </div>
        }
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {detailLoading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : selectedJob ? (
          <div className="job-detail-container overflow-auto max-h-[70vh]">
            <div className="flex items-start justify-between mb-4 flex-wrap">
              <div className="flex items-center mb-2 md:mb-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-3">
                  <BankOutlined style={{ fontSize: '24px' }} />
                </div>
                <div>
                  <Title level={4} className="m-0">{selectedJob.title}</Title>
                  <Text>{selectedJob.company.name}</Text>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Tag color={getJobTypeColor(selectedJob.jobType)} className="text-base px-3 py-1">
                  {selectedJob.jobType.toUpperCase()}
                </Tag>
                <Text type="secondary" className="mt-1">
                  Cập nhật: {selectedJob.updated ? new Date(selectedJob.updated).toLocaleDateString("vi-VN") : new Date(selectedJob.created).toLocaleDateString("vi-VN")}
                </Text>
              </div>
            </div>

            <Tabs defaultActiveKey="1">
              <TabPane 
                tab={
                  <span>
                    <InfoCircleOutlined />
                    Thông tin
                  </span>
                } 
                key="1"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Card size="small" title="Mức lương" className="bg-gray-50">
                    <div className="flex items-center">
                      <DollarOutlined className="text-green-600 mr-2" />
                      <Text className="text-lg">{formatSalary(selectedJob)}</Text>
                    </div>
                    <Text type="secondary" className="block mt-1">Loại: {getSalaryTypeLabel(selectedJob.salaryType)}</Text>
                  </Card>
                  
                  <Card size="small" title="Kỹ năng" className="bg-gray-50">
                    <div className="flex flex-wrap gap-1">
                      {selectedJob.listSkill && selectedJob.listSkill.length > 0 ? (
                        selectedJob.listSkill.map(jobSkill => (
                          <Tag key={jobSkill.uuid} color="blue">
                            {jobSkill.skill.name}
                          </Tag>
                        ))
                      ) : (
                        <Text className="text-gray-500">Không yêu cầu kỹ năng cụ thể</Text>
                      )}
                    </div>
                  </Card>
                </div>
                
                <Card size="small" title="Lịch làm việc" className="mb-4 bg-gray-50">
                  <div className="flex items-start">
                    <CalendarOutlined className="mt-1 mr-2 text-blue-600" />
                    {renderSchedule(selectedJob.schedule)}
                  </div>
                </Card>
                
                <Card size="small" title="Mô tả công việc" className="mb-4">
                  <Paragraph>
                    {selectedJob.description || "Không có mô tả"}
                  </Paragraph>
                </Card>
                
                <Card size="small" title="Yêu cầu" className="bg-gray-50">
                  <Paragraph>
                    {selectedJob.requirements || "Không có yêu cầu cụ thể"}
                  </Paragraph>
                </Card>
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <BarsOutlined />
                    Thông tin thêm
                  </span>
                } 
                key="2"
              >
                <div className="grid grid-cols-1 gap-4">
                  <Card size="small" title="Thông tin công ty" className="bg-gray-50">
                    <div className="flex items-center mb-2">
                      <BankOutlined className="mr-2 text-blue-600" />
                      <Text strong>Tên công ty:</Text>
                      <Text className="ml-2">{selectedJob.company.name}</Text>
                    </div>
                    <div className="flex items-center">
                      <TeamOutlined className="mr-2 text-blue-600" />
                      <Text strong>Mã công ty:</Text>
                      <Text className="ml-2">{selectedJob.company.code}</Text>
                    </div>
                  </Card>
                  
                  <Card size="small" title="Thời gian" className="bg-gray-50">
                    <div className="flex items-center mb-2">
                      <ClockCircleOutlined className="mr-2 text-green-600" /> 
                      <Text strong>Ngày tạo:</Text>
                      <Text className="ml-2">{new Date(selectedJob.created).toLocaleDateString("vi-VN")}</Text>
                    </div>
                    {selectedJob.updated && (
                      <div className="flex items-center">
                        <SyncOutlined className="mr-2 text-orange-600" />
                        <Text strong>Cập nhật lần cuối:</Text>
                        <Text className="ml-2">{new Date(selectedJob.updated).toLocaleDateString("vi-VN")}</Text>
                      </div>
                    )}
                  </Card>
                </div>
              </TabPane>
            </Tabs>
          </div>
        ) : (
          <Empty description="Không tìm thấy thông tin" />
        )}
      </Modal>
    </div>
  );
};

export default JobsPage;