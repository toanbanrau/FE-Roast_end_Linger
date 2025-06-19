import { useEffect } from "react";
import { Form, Input, Button, InputNumber, Select, Spin, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useNavigate, useParams } from "react-router-dom";
import {
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../../../services/categoryService";
import type { ICategory } from "../../../interfaces/category";
import toast from "react-hot-toast";

const EditCategory = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  // Lấy dữ liệu danh mục hiện tại
  const { data: category, isLoading } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategoryById(Number(id)),
    enabled: !!id,
  });

  // Lấy danh sách tất cả danh mục để chọn danh mục cha
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Mutation cập nhật danh mục
  const mutation = useMutation({
    mutationFn: (values: ICategory) => updateCategory(Number(id), values),
    onSuccess: () => {
      toast.success("Cập nhật danh mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/categories");
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi cập nhật danh mục!");
    },
  });

  // Set dữ liệu lên form khi đã load xong
  useEffect(() => {
    if (category) {
      form.setFieldsValue(category);
    }
  }, [category, form]);

  // Loại bỏ chính nó khỏi danh mục cha
  const parentOptions =
    categories
      ?.filter((c) => c.id !== Number(id))
      .map((c) => ({
        label: c.category_name,
        value: c.id,
      })) || [];

  const onFinish = (values: ICategory) => {
    mutation.mutate(values);
  };

  if (isLoading) return <Spin />;

  return (
    <Form
      form={form}
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
        <Button
          type="primary"
          htmlType="submit"
          loading={mutation.isPending}
          className="w-full"
        >
          Lưu thay đổi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditCategory;
