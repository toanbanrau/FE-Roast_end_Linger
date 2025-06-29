import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrigin } from '../../../services/originService';
import type { IOriginCreate } from '../../../interfaces/origin';

const AddOrigin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createOrigin,
    onSuccess: () => {
      message.success('Thêm xuất xứ thành công!');
      queryClient.invalidateQueries({ queryKey: ['origins'] });
      navigate('/admin/origin');
    },
    onError: () => {
      message.error('Thêm xuất xứ thất bại!');
    },
  });

  const onFinish = (values: IOriginCreate) => {
    mutation.mutate(values);
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Thêm Xuất Xứ</h2>
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
            Thêm xuất xứ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddOrigin;
