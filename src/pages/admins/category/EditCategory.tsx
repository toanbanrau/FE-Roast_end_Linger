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

const { Option } = Select;

const EditCategory = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  // Lấy dữ liệu danh mục hiện tại
  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategoryById(Number(id)),
    enabled: !!id,
  });

  // Lấy danh sách tất cả danh mục để chọn danh mục cha
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
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

  const onFinish = (values: ICategory) => {
    mutation.mutate(values);
  };

  if (isLoadingCategory || isLoadingCategories) return <Spin />;

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Chỉnh Sửa Danh Mục</h2>
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
            {categories?.filter((cat: ICategory) => cat.parent_category_id === null || cat.id !== Number(id)).map((cat: ICategory) => (
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
            Cập nhật danh mục
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCategory;
