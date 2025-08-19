import React from "react";
import { Form, Input, Button, Select, Card, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUserDetail,
  createAdminUser,
  updateAdminUser,
} from "../../../services/adminUserService";
import type { IUser } from "../../../interfaces/user";

const { Option } = Select;

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  status: string;
}

const UserForm: React.FC<{ mode: "add" | "edit" }> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Query để lấy thông tin user khi edit
  const { data, isLoading } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => getAdminUserDetail(Number(id)),
    enabled: mode === "edit" && !!id,
  });

  // Mutation để tạo/cập nhật user
  const mutation = useMutation({
    mutationFn: (values: UserFormData) => {
      if (mode === "add") {
        return createAdminUser(values);
      } else {
        return updateAdminUser(Number(id), values);
      }
    },
    onSuccess: () => {
      message.success(
        mode === "add"
          ? "Thêm người dùng thành công!"
          : "Cập nhật người dùng thành công!"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      navigate("/admin/user");
    },
    onError: () => {
      message.error(
        mode === "add"
          ? "Thêm người dùng thất bại!"
          : "Cập nhật người dùng thất bại!"
      );
    },
  });

  // Set form values khi edit
  React.useEffect(() => {
    if (data && mode === "edit") {
      form.setFieldsValue({
        name: data.name || data.full_name,
        email: data.email,
        role: data.role,
        status: data.status,
      });
    }
  }, [data, mode, form]);

  const onFinish = (values: UserFormData) => {
    // Loại bỏ password nếu rỗng khi edit
    if (mode === "edit" && !values.password) {
      const { password, ...dataWithoutPassword } = values;
      mutation.mutate(dataWithoutPassword);
    } else {
      mutation.mutate(values);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <Card>
        <h2 style={{ marginBottom: 24 }}>
          {mode === "add" ? "Thêm người dùng" : "Sửa người dùng"}
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="name"
            label="Tên người dùng"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng!" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên người dùng" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              mode === "add"
                ? "Mật khẩu"
                : "Mật khẩu mới (để trống nếu không đổi)"
            }
            rules={
              mode === "add"
                ? [
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                  ]
                : [{ min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" }]
            }
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="admin">Admin</Option>
              <Option value="staff">Staff</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
              style={{ marginRight: 8 }}
            >
              {mode === "add" ? "Thêm người dùng" : "Cập nhật"}
            </Button>
            <Button onClick={() => navigate("/admin/user")}>Hủy</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserForm;
