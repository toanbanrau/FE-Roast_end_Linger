import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Space,
  Tag,
  Card,
  Typography,
  Breadcrumb,
  Input,
  Modal,
  Form,
  message,
  Switch,
  Tooltip,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import {
  getAttributeValues,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
  getAttributeById,
} from "../../../services/attributeService";
import type {
  IAttributeValue,
  ICreateAttributeValueRequest,
  IUpdateAttributeValueRequest,
} from "../../../interfaces/attribute";

const { Title } = Typography;
const { confirm } = Modal;

const AttributeValues: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const attributeId = Number(id);

  // State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingValue, setEditingValue] = useState<IAttributeValue | null>(null);
  const [form] = Form.useForm();

  // Queries
  const { data: attribute } = useQuery({
    queryKey: ["attribute", attributeId],
    queryFn: () => getAttributeById(attributeId),
    enabled: !!attributeId,
  });

  const { data: attributeValuesData, isLoading } = useQuery({
    queryKey: ["attribute-values", attributeId],
    queryFn: () => getAttributeValues(attributeId),
    enabled: !!attributeId,
  });

  const values = attributeValuesData?.values || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: ICreateAttributeValueRequest) =>
      createAttributeValue(attributeId, data),
    onSuccess: () => {
      message.success("Tạo giá trị thành công!");
      queryClient.invalidateQueries({ queryKey: ["attribute-values", attributeId] });
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi tạo giá trị!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ valueId, data }: { valueId: number; data: IUpdateAttributeValueRequest }) =>
      updateAttributeValue(attributeId, valueId, data),
    onSuccess: () => {
      message.success("Cập nhật giá trị thành công!");
      queryClient.invalidateQueries({ queryKey: ["attribute-values", attributeId] });
      setIsModalVisible(false);
      setEditingValue(null);
      form.resetFields();
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi cập nhật giá trị!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (valueId: number) => deleteAttributeValue(attributeId, valueId),
    onSuccess: () => {
      message.success("Xóa giá trị thành công!");
      queryClient.invalidateQueries({ queryKey: ["attribute-values", attributeId] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi xóa giá trị!");
    },
  });

  // Statistics
  const totalValues = values.length;
  const activeValues = values.filter((v) => v.status).length;
  const inactiveValues = values.filter((v) => !v.status).length;

  // Handlers
  const handleAdd = () => {
    setEditingValue(null);
    form.resetFields();
    form.setFieldsValue({
      status: true,
      sort_order: totalValues + 1,
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record: IAttributeValue) => {
    setEditingValue(record);
    form.setFieldsValue({
      value: record.value,
      sort_order: record.sort_order,
      status: record.status,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record: IAttributeValue) => {
    confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa giá trị "${record.value}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        deleteMutation.mutate(record.id);
      },
    });
  };

  const handleSubmit = (formValues: any) => {
    if (editingValue) {
      updateMutation.mutate({
        valueId: editingValue.id,
        data: formValues,
      });
    } else {
      createMutation.mutate(formValues);
    }
  };

  // Table columns
  const columns: ColumnsType<IAttributeValue> = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => a.value.localeCompare(b.value),
    },
    {
      title: "Thứ tự",
      dataIndex: "sort_order",
      key: "sort_order",
      width: 100,
      sorter: (a, b) => a.sort_order - b.sort_order,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => (
        <Tag color={status ? "success" : "error"}>
          {status ? "Hoạt động" : "Tạm dừng"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              loading={deleteMutation.isPending}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined />
          <span>Trang chủ</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <SettingOutlined />
          <span>Quản lý thuộc tính</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span>Giá trị thuộc tính</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <SettingOutlined style={{ marginRight: 8 }} />
          Giá trị thuộc tính: {attribute?.attribute_name}
        </Title>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng giá trị"
              value={totalValues}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={activeValues}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tạm dừng"
              value={inactiveValues}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/attribute")}
          >
            Quay lại danh sách thuộc tính
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm giá trị mới
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={values}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} giá trị`,
          }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={editingValue ? "Sửa giá trị" : "Thêm giá trị mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingValue(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="value"
            label="Giá trị"
            rules={[
              { required: true, message: "Vui lòng nhập giá trị!" },
              { min: 1, message: "Giá trị phải có ít nhất 1 ký tự!" },
              { max: 100, message: "Giá trị không được quá 100 ký tự!" },
            ]}
          >
            <Input placeholder="VD: 100g, Large, Red..." />
          </Form.Item>

          <Form.Item
            name="sort_order"
            label="Thứ tự"
            rules={[
              { required: true, message: "Vui lòng nhập thứ tự!" },
              { type: "number", min: 1, message: "Thứ tự phải lớn hơn 0!" },
            ]}
          >
            <Input type="number" placeholder="1" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Hoạt động"
              unCheckedChildren="Tạm dừng"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingValue(null);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingValue ? "Cập nhật" : "Tạo mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AttributeValues;
