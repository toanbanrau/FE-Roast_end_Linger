import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Card,
  Row,
  Col,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getAdminUsers,
  deleteAdminUser,
} from "../../../services/adminUserService";
import type { IUser } from "../../../interfaces/user";

const { Option } = Select;

interface UserQueryParams {
  role?: string;
  email?: string;
  status?: string;
  page?: number;
}

const ListUser: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UserQueryParams>({});
  const [searchEmail, setSearchEmail] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () => getAdminUsers(filters),
  });

  // Mutation để xóa user
  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      message.success("Xóa người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      message.error("Xóa người dùng thất bại!");
    },
  });

  // Handle search
  const handleSearch = () => {
    setFilters({ ...filters, email: searchEmail });
  };

  // Handle filter change
  const handleFilterChange = (
    key: keyof UserQueryParams,
    value: string | undefined
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  // Handle delete
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: IUser) => record.name || record.full_name,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <span
          style={{
            color: role === "admin" ? "#1890ff" : "#52c41a",
            fontWeight: "bold",
          }}
        >
          {role === "admin" ? "Admin" : role === "staff" ? "Staff" : "User"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          style={{
            color: status === "active" ? "#52c41a" : "#ff4d4f",
            fontWeight: "bold",
          }}
        >
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_: any, record: IUser) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/user/${record.id}`)}
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/user/edit/${record.id}`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              loading={deleteMutation.isPending}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <h2 style={{ margin: 0 }}>Quản lý người dùng</h2>
          </Col>
        </Row>

        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Input
              placeholder="Tìm kiếm theo email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onPressEnter={handleSearch}
              suffix={
                <SearchOutlined
                  onClick={handleSearch}
                  style={{ cursor: "pointer" }}
                />
              }
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Vai trò"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("role", value)}
            >
              <Option value="admin">Admin</Option>
              <Option value="staff">Staff</Option>
              <Option value="user">User</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("status", value)}
            >
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/user/add")}
            >
              Thêm người dùng
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={data?.data || []}
          loading={isLoading}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
        />
      </Card>
    </div>
  );
};

export default ListUser;
