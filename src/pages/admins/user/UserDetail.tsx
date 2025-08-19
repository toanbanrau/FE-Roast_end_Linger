import React from "react";
import { Descriptions, Button, Card, Space, Tag } from "antd";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAdminUserDetail } from "../../../services/adminUserService";

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => getAdminUserDetail(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    return <div>Không tìm thấy người dùng!</div>;
  }

  return (
    <div>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/user")}
          >
            Quay lại
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/user/edit/${user.id}`)}
          >
            Chỉnh sửa
          </Button>
        </Space>

        <h2 style={{ marginBottom: 24 }}>Chi tiết người dùng</h2>

        <Descriptions bordered column={1} style={{ marginTop: 16 }}>
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Tên">
            {user.name || user.full_name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Tag
              color={
                user.role === "admin"
                  ? "red"
                  : user.role === "staff"
                  ? "blue"
                  : "green"
              }
            >
              {user.role === "admin"
                ? "Admin"
                : user.role === "staff"
                ? "Staff"
                : "User"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={user.status === "active" ? "green" : "red"}>
              {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {user.phone_number || "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {user.date_of_birth
              ? new Date(user.date_of_birth).toLocaleDateString("vi-VN")
              : "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {user.gender || "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {user.created_at
              ? new Date(user.created_at).toLocaleDateString("vi-VN")
              : ""}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            {user.updated_at
              ? new Date(user.updated_at).toLocaleDateString("vi-VN")
              : ""}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default UserDetail;
