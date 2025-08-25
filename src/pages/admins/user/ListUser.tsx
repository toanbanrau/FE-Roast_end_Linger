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
  message,
  Tag,
} from "antd";
import type { TablePaginationConfig } from "antd";
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
import ConfirmModal from "../../../components/ConfirmModal";
import { toast } from "react-toastify";
import { useUserStore } from "../../../stores/useUserStore";

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
  const currentUser = useUserStore((state) => state.user);
  const [filters, setFilters] = useState<UserQueryParams>({});
  const [searchEmail, setSearchEmail] = useState("");

  // State cho confirm modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () => getAdminUsers(filters),
  });

  // Mutation để xóa user
  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      toast.success("Xóa người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
      // Kiểm tra xem lỗi có phải là lỗi xác thực/phân quyền không
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // Nếu là lỗi 401 hoặc 403, hiển thị thông báo lỗi mà không đăng xuất
        const message =
          error.response.status === 401
            ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            : "Bạn không có quyền thực hiện hành động này.";
        toast.error(error.response.data.message || message);
      } else {
        // Các lỗi khác
        toast.error(
          error.response?.data?.message || "Có lỗi xảy ra khi xóa người dùng!"
        );
      }
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
    setFilters({ ...filters, page: 1, [key]: value });
  };

  // Handle table pagination change
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setFilters({
      ...filters,
      page: pagination.current,
    });
  };

  // Handle delete - mở confirm modal
  const handleDelete = (id: number, name: string, email: string) => {
    if (currentUser && currentUser.id === id) {
      toast.error("Bạn không thể tự xóa tài khoản của chính mình.");
      return;
    }
    setDeletingUser({ id, name, email });
    setIsConfirmModalOpen(true);
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = () => {
    if (deletingUser) {
      console.log("Confirming delete for user:", deletingUser.id); // Debug log
      deleteMutation.mutate(deletingUser.id);
      setIsConfirmModalOpen(false);
      setDeletingUser(null);
    }
  };

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, index: number) => index + 1,
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
        <Tag
          style={{
            color: role === "admin" ? "#1890ff" : "#52c41a",
            fontWeight: "bold",
          }}
        >
          {role === "admin" ? "Admin" : role === "staff" ? "Staff" : "User"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          style={{
            color: status === "active" ? "#52c41a" : "#ff4d4f",
            fontWeight: "bold",
          }}
        >
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
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
      render: (_: any, record: IUser) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/user/${record.id}`)}
          ></Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/user/edit/${record.id}`)}
          ></Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              handleDelete(
                record.id,
                record.name || record.full_name || "Người dùng",
                record.email
              )
            }
            loading={deleteMutation.isPending}
            disabled={!!(currentUser && currentUser.id === record.id)}
          ></Button>
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
          dataSource={data?.data} // Corrected: The user list is in data.data
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: data?.current_page, // Corrected: read from data object
            pageSize: data?.per_page, // Corrected: read from data object
            total: data?.total, // Corrected: read from data object
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa người dùng"
        message={`Bạn có chắc muốn xóa người dùng "${deletingUser?.name}" (${deletingUser?.email})? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ListUser;
