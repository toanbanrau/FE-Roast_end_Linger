import { Form, Input, Button, InputNumber, Select, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import type { ICategoryForm } from "../../../interfaces/category";
import { createCategory } from "../../../services/categoryService";

const AddCategory = () => {
  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      message.success("Thêm danh mục thành công!");
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi thêm thương hiệu!");
    },
  });

  const onFinish = (values: ICategoryForm) => {
    mutation.mutate(values);
  };

  const parentOptions = [
    { value: 1, label: "Danh mục cha 1" },
    { value: 2, label: "Danh mục cha 2" },
    { value: 3, label: "Danh mục cha 3" },
  ];

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      className="max-w-md mx-auto bg-white p-6 rounded shadow"
    >
      <Form.Item
        label="Tên danh mục"
        name="category_name"
        rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
      >
        <Input placeholder="Nhập tên danh mục" />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <Input.TextArea rows={3} placeholder="Nhập mô tả (nếu có)" />
      </Form.Item>

      <Form.Item label="Slug" name="slug">
        <Input placeholder="Nhập slug (nếu có)" />
      </Form.Item>

      <Form.Item label="Hình ảnh" name="image">
        <Input placeholder="Nhập link hình ảnh (nếu có)" />
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

      <Form.Item label="Trạng thái" name="status" initialValue={1}>
        <Select>
          <Select.Option value={1}>Hiển thị</Select.Option>
          <Select.Option value={0}>Ẩn</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Thêm Danh Mục
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddCategory;
