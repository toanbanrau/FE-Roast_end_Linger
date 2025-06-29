import { Form, Input, Button, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOriginById, updateOrigin } from '../../../services/originService';
import type { IOriginUpdate } from '../../../interfaces/origin';
import { useEffect } from 'react';

const EditOrigin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data: origin, isLoading } = useQuery({
    queryKey: ['origin', id],
    queryFn: () => getOriginById(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (origin) {
      form.setFieldsValue(origin);
    }
  }, [origin, form]);

  const mutation = useMutation({
    mutationFn: (values: IOriginUpdate) => updateOrigin(Number(id), values),
    onSuccess: () => {
      message.success('Cập nhật xuất xứ thành công!');
      queryClient.invalidateQueries({ queryKey: ['origins'] });
      navigate('/admin/origin');
    },
    onError: () => {
      message.error('Cập nhật xuất xứ thất bại!');
    },
  });

  const onFinish = (values: IOriginUpdate) => {
    mutation.mutate(values);
  };

  if (isLoading) return <Spin tip="Đang tải dữ liệu..." />;

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Chỉnh Sửa Xuất Xứ</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="origin_name"
          label="Tên xuất xứ"
          rules={[{ required: true, message: 'Vui lòng nhập tên xuất xứ!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="country"
          label="Quốc gia"
          rules={[{ required: true, message: 'Vui lòng nhập quốc gia!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Cập nhật xuất xứ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditOrigin;
