import { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, message, Typography, Spin, Empty, Pagination } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import { getPageListSkill, createSkill } from "../../services/skillService";
import type { SkillItem, GetPageSkillParams } from "../../types/skill";

const { Title } = Typography;

const SkillPage = () => {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPage: 0,
  });

  const fetchSkills = async (params: GetPageSkillParams) => {
    setLoading(true);
    try {
      const response = await getPageListSkill(params);
      if (response.data) {
        setSkills(response.data.items);
        setPagination({
          ...pagination,
          current: params.page,
          total: response.data.pagination.totalCount, // Đã sửa: totalItems -> totalCount
          totalPage: response.data.pagination.totalPage,
        });
      } else if (response.error && response.error.code !== "success") {
        message.error(response.error.message || "Failed to fetch skills");
      }
    } catch (error) {
      message.error("An error occurred while fetching skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params: GetPageSkillParams = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: searchKeyword,
    };
    fetchSkills(params);
  }, [pagination.current, pagination.pageSize, searchKeyword]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const response = await createSkill({ name: values.name });
      
      if (response.data) {
        message.success("Skill created successfully");
        setIsModalVisible(false);
        fetchSkills({
          page: pagination.current,
          pageSize: pagination.pageSize,
          keyword: searchKeyword,
        });
      } else if (response.error && response.error.code !== "success") {
        message.error(response.error.message || "Failed to create skill");
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Failed to create skill");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize || pagination.pageSize,
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "UUID",
      dataIndex: "uuid",
      key: "uuid",
      render: (text: string) => (
        <span className="text-gray-500 text-sm">{text}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: SkillItem) => (
        <Button
          type="text"
          icon={<EditOutlined />}
          className="text-blue-500 hover:text-blue-600"
          onClick={() => message.info("Edit functionality would go here")}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <Title level={3} className="mb-0 text-gray-800">
            Skills Management
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 border-none"
          >
            Add Skill
          </Button>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search skills..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full max-w-md"
            allowClear
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : skills.length > 0 ? (
          <>
            <Table
              dataSource={skills}
              columns={columns}
              rowKey="uuid"
              pagination={false}
              className="border rounded-md"
              rowClassName="hover:bg-gray-50"
            />
            <div className="mt-4 flex justify-end">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `Total ${total} skills`}
              />
            </div>
          </>
        ) : (
          <Empty
            description="No skills found"
            className="py-10"
          />
        )}
      </div>

      <Modal
        title="Add New Skill"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Create"
        okButtonProps={{ className: "bg-blue-500 hover:bg-blue-600" }}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Skill Name"
            rules={[
              { required: true, message: "Please enter the skill name" },
              { max: 50, message: "Skill name cannot exceed 50 characters" }
            ]}
          >
            <Input placeholder="Enter skill name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SkillPage;