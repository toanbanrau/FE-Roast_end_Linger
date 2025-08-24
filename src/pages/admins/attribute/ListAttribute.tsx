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
  Select,
  Row,
  Col,
  Statistic,
  Tooltip,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  SettingOutlined,
  SearchOutlined,
  EyeOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import {
  getAttributes,
  toggleAttributeStatus,
  deleteAttribute,
} from "../../../services/attributeService";
import type { IAttribute } from "../../../interfaces/attribute";
import ConfirmModal from "../../../components/ConfirmModal";
import { toast } from "react-toastify";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const ListAttribute: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // State cho confirm modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingAttribute, setDeletingAttribute] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Queries
  const { data: attributes = [], isLoading } = useQuery({
    queryKey: ["attributes", { search: searchText, status: statusFilter }],
    queryFn: () =>
      getAttributes({
        search: searchText || undefined,
        status: statusFilter === "all" ? undefined : statusFilter === "active",
        sort: "sort_order",
        order: "asc",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAttribute,
    onSuccess: () => {
      toast.success("Xóa thuộc tính thành công!");
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xóa thuộc tính!");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleAttributeStatus,
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    },
  });

  // Filtered data
  const filteredAttributes = attributes.filter((attr) => {
    const matchSearch = attr.attribute_name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && attr.status) ||
      (statusFilter === "inactive" && !attr.status);
    return matchSearch && matchStatus;
  });

  // Statistics
  const totalAttributes = attributes.length;
  const activeAttributes = attributes.filter((attr) => attr.status).length;
  const inactiveAttributes = attributes.filter((attr) => !attr.status).length;
  const requiredAttributes = attributes.filter(
    (attr) => attr.is_required
  ).length;

  // Handlers
  const handleDeleteAttribute = (id: number, name: string) => {
    setDeletingAttribute({ id, name });
    setIsConfirmModalOpen(true);
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = () => {
    if (deletingAttribute) {
      deleteMutation.mutate(deletingAttribute.id);
      setIsConfirmModalOpen(false);
      setDeletingAttribute(null);
    }
  };

  const handleToggleStatus = (id: number) => {
    toggleStatusMutation.mutate(id);
  };

  // Table columns
  const columns: ColumnsType<IAttribute> = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên thuộc tính",
      dataIndex: "attribute_name",
      key: "attribute_name",
      width: 200,
      sorter: (a, b) => a.attribute_name.localeCompare(b.attribute_name),
    },
    {
      title: "Loại",
      dataIndex: "attribute_type",
      key: "attribute_type",
      width: 100,
      render: (type: string) => (
        <Tag color="blue">{type === "select" ? "Lựa chọn" : type}</Tag>
      ),
    },
    {
      width: 200,
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Bắt buộc",
      dataIndex: "is_required",
      key: "is_required",
      width: 80,
      render: (required: boolean) => (
        <Tag color={required ? "red" : "default"}>
          {required ? "Bắt buộc" : "Tùy chọn"}
        </Tag>
      ),
    },
    {
      title: "Thứ tự",
      dataIndex: "sort_order",
      key: "sort_order",
      width: 80,
      sorter: (a, b) => a.sort_order - b.sort_order,
    },
    {
      title: "Số giá trị",
      key: "values_count",
      width: 100,
      render: (_, record) => (
        <Tag color="green">{record.attribute_values?.length || 0}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: boolean, record) => (
        <Switch
          checked={status}
          onChange={() => handleToggleStatus(record.id)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Tạm dừng"
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 280,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Link to={`/admin/attribute/${record.id}`}>
              <Button type="primary" size="small" icon={<EyeOutlined />}>
                Xem
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Link to={`/admin/attribute/edit/${record.id}`}>
              <Button type="default" size="small" icon={<EditOutlined />}>
                Sửa
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title="Quản lý giá trị">
            <Link to={`/admin/attribute/${record.id}/values`}>
              <Button type="dashed" size="small" icon={<SettingOutlined />}>
                Giá trị
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title="Xóa thuộc tính">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() =>
                handleDeleteAttribute(
                  record.id,
                  record.attribute_name || "Thuộc tính"
                )
              }
              loading={deleteMutation.isPending}
            >
              Xóa
            </Button>
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
      </Breadcrumb>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <SettingOutlined style={{ marginRight: 8 }} />
          Quản lý thuộc tính sản phẩm
        </Title>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng thuộc tính"
              value={totalAttributes}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={activeAttributes}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tạm dừng"
              value={inactiveAttributes}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bắt buộc"
              value={requiredAttributes}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm thuộc tính..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Đang hoạt động</Option>
              <Option value="inactive">Tạm dừng</Option>
            </Select>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/admin/attribute/add")}
                size="large"
              >
                Thêm thuộc tính mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredAttributes}
          rowKey="id"
          loading={isLoading}
          pagination={{
            total: filteredAttributes.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} thuộc tính`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setDeletingAttribute(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa thuộc tính"
        message={`Bạn có chắc muốn xóa thuộc tính "${deletingAttribute?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ListAttribute;
