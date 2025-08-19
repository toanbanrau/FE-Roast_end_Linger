import { useEffect } from "react";
import { Form, Input, Button, InputNumber, Select, Spin } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useNavigate, useParams } from "react-router-dom";
import {
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../../../services/categoryService";
import type { ICategory, ICategoryForm } from "../../../interfaces/category";
import toast from "react-hot-toast";

const { Option } = Select;

const EditCategory = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  // Lấy dữ liệu danh mục hiện tại
  const { data: categoryResponse, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategoryById(Number(id)),
    enabled: !!id,
  });

  // Lấy danh sách tất cả danh mục để chọn danh mục cha
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Lấy dữ liệu category từ response
  const category = categoryResponse?.data;

  // Mutation cập nhật danh mục
  const mutation = useMutation({
    mutationFn: (values: Omit<ICategoryForm, "slug">) =>
      updateCategory(Number(id), values as ICategoryForm),
    onSuccess: () => {
      toast.success("Cập nhật danh mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/admin/category");
    },
    onError: (error: unknown) => {
      console.error("Update error:", error);
      toast.error("Có lỗi xảy ra khi cập nhật danh mục!");
    },
  });

  // Set dữ liệu lên form khi đã load xong
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        category_name: category.category_name,
        description: category.description,
        parent_category_id: category.parent_category_id,
        sort_order: category.sort_order,
        status: category.status ? 1 : 0,
      });
    }
  }, [category, form]);

  const onFinish = (values: {
    category_name: string;
    description: string;
    parent_category_id?: number;
    sort_order: number;
    status: number;
  }) => {
    const payload = {
      category_name: values.category_name,
      description: values.description,
      parent_category_id: values.parent_category_id || null,
      sort_order: values.sort_order,
      status: values.status === 1,
    };
    mutation.mutate(payload);
  };

  if (isLoadingCategory || isLoadingCategories) return <Spin />;

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Chỉnh Sửa Danh Mục</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 1, sort_order: 1 }}
      >
        <Form.Item
          name="category_name"
          label="Tên danh mục"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="parent_category_id" label="Danh mục cha">
          <Select allowClear placeholder="Chọn danh mục cha (nếu có)">
            {categories
              ?.filter(
                (cat: ICategory) => cat.id !== Number(id) // Loại bỏ chính nó
              )
              .map((cat: ICategory) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="sort_order"
          label="Thứ tự"
          rules={[{ required: true, message: "Vui lòng nhập thứ tự!" }]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Option value={1}>Hiện</Option>
            <Option value={0}>Ẩn</Option>
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
