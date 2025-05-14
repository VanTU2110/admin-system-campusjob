import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Typography,
  Space,
  Modal,
  Button,
  Descriptions,
  Tag,
  Card,
  Divider,
  Alert,
  message,
} from "antd";
import { EyeOutlined, FileTextOutlined, CloseOutlined } from "@ant-design/icons";
import { getPageCompany } from "../../services/companyService";
import { getPageListReport } from "../../services/reportService";
import type { CompanyDetail } from "../../types/company";
import type { Report } from "../../types/report";
import { Link } from "react-router-dom";
import { createWarning } from "../../services/warningService";
import { Text } from "lucide-react";

const { Title } = Typography;
const { Search } = Input;

const CompanyPage = () => {
  // Style chung
  const tableStyle = {
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
    overflow: 'hidden'
  };
  const [data, setData] = useState<CompanyDetail[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetail | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Thêm state cho báo cáo
  const [showReportSection, setShowReportSection] = useState(false);
  const [reportData, setReportData] = useState<Report[]>([]);
  const [reportPage, setReportPage] = useState(1);
  const [reportTotal, setReportTotal] = useState(0);
  const [loadingReports, setLoadingReports] = useState(false);
  const [currentReportCompany, setCurrentReportCompany] = useState<CompanyDetail | null>(null);
  //State cho cảnh báo
  // State for warning modal
  const [warningModalVisible, setWarningModalVisible] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>("");
  const [warningTargetUuid, setWarningTargetUuid] = useState<string>("");
  const fetchData = async () => {
    try {
      const res = await getPageCompany({
        page,
        pageSize,
        keyword: keyword.trim() || undefined,
      });
      setData(res.data.items);
      setTotal(res.data.pagination.totalCount);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu công ty:", error);
    }
  };

  // Hàm lấy dữ liệu báo cáo
  const fetchReportData = async (companyUuid: string) => {
    setLoadingReports(true);
    try {
      const res = await getPageListReport({
        page: reportPage,
        pageSize,
        targetType: "company",
        targetUuid: companyUuid,
      });
      setReportData(res.data.items);
      setReportTotal(res.data.pagination.totalCount);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu báo cáo:", error);
    } finally {
      setLoadingReports(false);
    }
  };
  const handleOpenWarningModal = (userUuid: string) => {
    setWarningTargetUuid(userUuid);
    setWarningModalVisible(true);
  };
  const handleSubmitWarning = async () => {
    if (!warningMessage.trim()) {
      message.error('Vui lòng nhập nội dung cảnh báo');
      return;
    }

    try {
      await createWarning({
        targetType: 'company',
        targetUuid: warningTargetUuid,
        messages: warningMessage
      });

      message.success('Đã gửi cảnh báo thành công');
      setWarningModalVisible(false);
      setWarningMessage("");
    } catch (error) {
      console.error('Error sending warning:', error);
      message.error('Không thể gửi cảnh báo, vui lòng thử lại sau');
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, keyword]);

  // Cập nhật báo cáo khi reportPage thay đổi
  useEffect(() => {
    if (currentReportCompany && showReportSection) {
      fetchReportData(currentReportCompany.uuid);
    }
  }, [reportPage, currentReportCompany, showReportSection]);

  const handleSearch = (value: string) => {
    setPage(1);
    setKeyword(value);
  };

  const openModal = (company: CompanyDetail) => {
    setSelectedCompany(company);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCompany(null);
  };

  // Hàm xem báo cáo
  const showCompanyReports = (company: CompanyDetail) => {
    setCurrentReportCompany(company);
    setReportPage(1);
    setShowReportSection(true);
    fetchReportData(company.uuid);
  };

  // Hàm đóng phần báo cáo
  const closeReportSection = () => {
    setShowReportSection(false);
    setCurrentReportCompany(null);
  };

  const columns = [
    {
      title: "Tên công ty",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: CompanyDetail) => (
        <Typography.Link onClick={() => openModal(record)}>
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Địa chỉ",
      key: "address",
      render: (_: any, record: CompanyDetail) =>
        `${record.xa?.name || ""}, ${record.qh?.name || ""}, ${record.tp?.name || ""}`,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_: any, record: CompanyDetail) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openModal(record)}
          >
            Xem
          </Button>
          <Button
            type="default"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => showCompanyReports(record)}
          >
            Báo cáo
          </Button>
          <Button
            type="default"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => handleOpenWarningModal(record.userUuid)}
          >
            Cảnh báo
          </Button>
        </Space>
      ),
    },
  ];

  // Cột cho báo cáo
  const reportColumns = [
    {
      title: "Người báo cáo",
      dataIndex: "reporterUuid",
      key: "reporterUuid",
      width: 150,
      render: (studentUuid: string) => (
        <Link
          to={`/student-detail/${studentUuid}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {studentUuid}
        </Link>
      )
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center" as "center",
      render: (status: string) => (
        <Tag color={status === "pending" ? "orange" : status === "approved" ? "green" : "red"}>
          {status === "pending" ? "Đang chờ" : status === "approved" ? "Đã duyệt" : "Từ chối"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Danh sách công ty</Title>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <Search
          placeholder="Tìm kiếm theo tên công ty..."
          onSearch={handleSearch}
          enterButton
          allowClear
          style={{ width: 300 }}
        />
        <div>
          <Typography.Text type="secondary">
            Tổng số: <strong>{total}</strong> công ty
          </Typography.Text>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="uuid"
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
        bordered
        style={tableStyle}
      />

      {/* Phần hiển thị báo cáo ở dưới bảng công ty */}
      {showReportSection && currentReportCompany && (
        <div style={{ marginTop: 20 }}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <FileTextOutlined style={{ marginRight: 8 }} />
                  <span style={{ fontWeight: 500 }}>Báo cáo của công ty: </span>
                  <Tag color="blue">{currentReportCompany.name}</Tag>
                </div>
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={closeReportSection}
                >
                  Đóng
                </Button>
              </div>
            }
            style={{ width: '100%' }}
            bordered
          >
            <Table
              columns={reportColumns}
              dataSource={reportData}
              rowKey="uuid"
              loading={loadingReports}
              pagination={{
                current: reportPage,
                pageSize,
                total: reportTotal,
                onChange: (p) => setReportPage(p),
                showSizeChanger: false,
                size: "small"
              }}
              bordered
              size="small"
              locale={{
                emptyText: "Không có báo cáo nào",
              }}
            />
          </Card>
        </div>
      )}
      {/* Warning Modal */}
      <Modal
        title="Gửi cảnh báo cho công ty"
        open={warningModalVisible}
        onCancel={() => setWarningModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setWarningModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmitWarning}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Gửi cảnh báo
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div>
            <Text strong>Nội dung cảnh báo:</Text>
            <Input.TextArea
              rows={4}
              value={warningMessage}
              onChange={(e) => setWarningMessage(e.target.value)}
              placeholder="Nhập nội dung cảnh báo cho công ty..."
              className="mt-2"
            />
          </div>
        </div>
      </Modal>
      {/* Modal chi tiết công ty */}
      <Modal
        title="Chi tiết công ty"
        visible={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedCompany && (
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Tên công ty">
              {selectedCompany.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedCompany.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedCompany.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Tỉnh/TP">
              <Tag color="blue">{selectedCompany.tp?.name}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Quận/Huyện">
              <Tag color="green">{selectedCompany.qh?.name}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Xã/Phường">
              <Tag color="cyan">{selectedCompany.xa?.name}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {selectedCompany.description || "Không có mô tả"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

    </div>
  );
}
export default CompanyPage;