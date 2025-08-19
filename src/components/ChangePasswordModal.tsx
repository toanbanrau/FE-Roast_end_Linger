import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { changePassword, type ChangePasswordPayload } from '../services/authService';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [form] = Form.useForm();

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      message.success('Đổi mật khẩu thành công!');
      form.resetFields();
      onClose();
    },
    onError: (error: any) => {
      const errorData = error?.response?.data;

      // Nếu có lỗi validation chi tiết
      if (errorData?.errors) {
        // Hiển thị từng lỗi validation
        Object.entries(errorData.errors).forEach(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg: string) => {
              message.error(msg);
            });
          }
        });
      } else {
        // Hiển thị lỗi chung
        const errorMessage = errorData?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
        message.error(errorMessage);
      }
    },
  });

  const handleSubmit = (values: ChangePasswordPayload) => {
    mutation.mutate(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="current_password"
          label="Mật khẩu hiện tại"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu hiện tại!',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-stone-400" />}
            placeholder="Nhập mật khẩu hiện tại"
            size="large"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu mới"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu mới!',
            },
            {
              min: 8,
              message: 'Mật khẩu phải có ít nhất 8 ký tự!',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-stone-400" />}
            placeholder="Nhập mật khẩu mới"
            size="large"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item
          name="password_confirmation"
          label="Xác nhận mật khẩu mới"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Vui lòng xác nhận mật khẩu mới!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-stone-400" />}
            placeholder="Xác nhận mật khẩu mới"
            size="large"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={handleCancel}
            size="large"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending}
            size="large"
            className="bg-amber-800 hover:bg-amber-900 border-amber-800 hover:border-amber-900"
          >
            {mutation.isPending ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
