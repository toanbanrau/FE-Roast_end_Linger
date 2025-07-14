import { Form, Input, Button, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { IContactForm } from '../../../interfaces/contact';
import { createContact } from '../../../services/adminContactService';

const { TextArea } = Input;

export default function AddContact() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Mutation tạo contact mới
  const mutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      message.success('Thêm liên hệ thành công!');
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      navigate('/admin/contact');
    },
    onError: (error: any) => {
      console.error('Error creating contact:', error);
      message.error('Có lỗi xảy ra khi thêm liên hệ!');
    },
  });

  const onFinish = (values: IContactForm) => {
    mutation.mutate(values);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/contact')}
        >
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thêm liên hệ mới</h1>
          <p className="text-gray-600">Tạo liên hệ mới từ cuộc gọi hoặc yêu cầu khách hàng</p>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột trái */}
          <div>
            <Form.Item
              label="Họ và tên"
              name="full_name"
              rules={[
                { required: true, message: 'Vui lòng nhập họ và tên!' },
                { max: 100, message: 'Họ và tên không được quá 100 ký tự!' },
                {
                  pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                  message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng!'
                }
              ]}
            >
              <Input placeholder="Nhập họ và tên khách hàng" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không đúng định dạng!' }
              ]}
            >
              <Input placeholder="Nhập email khách hàng" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone_number"
              rules={[
                { max: 20, message: 'Số điện thoại không được quá 20 ký tự!' },
                {
                  pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                  message: 'Số điện thoại không đúng định dạng (VD: 0901234567)!'
                }
              ]}
            >
              <Input placeholder="Nhập số điện thoại (tùy chọn)" />
            </Form.Item>
          </div>

          {/* Cột phải */}
          <div>
            <Form.Item
              label="Chủ đề"
              name="subject"
              rules={[
                { max: 200, message: 'Chủ đề không được quá 200 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập chủ đề liên hệ (tùy chọn)" />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              name="message"
              rules={[
                { required: true, message: 'Vui lòng nhập nội dung liên hệ!' },
                { min: 10, message: 'Nội dung phải có ít nhất 10 ký tự!' }
              ]}
            >
              <TextArea
                rows={8}
                placeholder="Nhập nội dung chi tiết của liên hệ..."
                showCount
                maxLength={1000}
              />
            </Form.Item>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
          <Button
            onClick={() => navigate('/admin/contact')}
            disabled={mutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Thêm liên hệ
          </Button>
        </div>
      </Form>
    </div>
  );
}
