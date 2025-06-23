import { Form, Input, Button, InputNumber, Select, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { IAdminBlogCategoryForm, IAdminBlogCategory } from "../../../interfaces/category";
import { createBlogCategory, getAllBlogCategories } from "../../../services/blogCategoryService";

const AddBlogCategory = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: getAllBlogCategories,
  });

  const mutation = useMutation({
    mutationFn: createBlogCategory,
    onSuccess: () => {
      message.success("Thêm danh mục blog thành công!");
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi thêm danh mục blog!");
    },
  });

  const onFinish = (values: IAdminBlogCategoryForm) => {
    mutation.mutate(values);
  };

  const parentOptions = categories.map((cat: IAdminBlogCategory) => ({
    value: cat.id,
    label: cat.category_name,
  }));

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      className="max-w-md mx-auto bg-white p-6 rounded shadow"
    >
      <Form.Item
        label="Tên danh mục blog"
        name="category_name"
        rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
      >
        <Input placeholder="Nhập tên danh mục blog" />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <Input.TextArea rows={3} placeholder="Nhập mô tả (nếu có)" />
      </Form.Item>

      <Form.Item label="Slug" name="slug">
        <Input placeholder="Nhập slug (nếu có)" />
      </Form.Item>

      <Form.Item label="Danh mục cha" name="parent_category_id">
        <Select
          allowClear
          placeholder="Chọn danh mục cha (nếu có)"
          options={parentOptions}
        />
      </Form.Item>

      <Form.Item label="Thứ tự sắp xếp" name="sort_order">
        <InputNumber
          min={0}
          className="w-full"
          placeholder="Nhập thứ tự sắp xếp"
        />
      </Form.Item>

      <Form.Item label="Trạng thái" name="status" initialValue={true}>
        <Select>
          <Select.Option value={true}>Hiển thị</Select.Option>
          <Select.Option value={false}>Ẩn</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full" loading={mutation.isPending}>
          Thêm Danh Mục Blog
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddBlogCategory; 