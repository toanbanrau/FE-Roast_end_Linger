import { Form, Input, Button, Select, InputNumber, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllCategories, createCategory } from '../../../services/categoryService';
import type { ICategory } from '../../../interfaces/category';

const { Option } = Select;

const AddCategory = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      message.success('Thêm danh mục thành công!');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('/admin/category');
    },
    onError: () => {
      message.error('Thêm danh mục thất bại!');
    },
  });

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Thêm Danh Mục</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'active', sort_order: 1 }}
      >
        <Form.Item
          name="category_name"
          label="Tên danh mục"
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
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
        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="image"
          label="Ảnh (URL)"
          rules={[{ required: true, message: 'Vui lòng nhập link ảnh!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="parent_category_id" label="Danh mục cha">
          <Select allowClear placeholder="Chọn danh mục cha (nếu có)">
            {categories?.filter((cat: ICategory) => cat.parent_category_id === null).map((cat: ICategory) => (
              <Option key={cat.id} value={cat.id}>{cat.category_name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="sort_order"
          label="Thứ tự"
          rules={[{ required: true, message: 'Vui lòng nhập thứ tự!' }]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select>
            <Option value="active">Hiện</Option>
            <Option value="inactive">Ẩn</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Thêm danh mục
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCategory;
