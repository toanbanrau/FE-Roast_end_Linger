import { Form, Input, Button, Select, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { IAdminBlogPostForm } from "../../../interfaces/blog";
import { createBlogPost } from "../../../services/blogPostService";
import { getAllBlogCategories } from "../../../services/blogCategoryService";
import type { IAdminBlogCategory } from "../../../interfaces/category";

const { TextArea } = Input;
const { Option } = Select;

const AddBlogPost = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Lấy danh sách danh mục blog
  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: getAllBlogCategories,
  });

  // Mutation để tạo bài viết blog
  const mutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      message.success("Thêm bài viết blog thành công!");
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      navigate("/admin/blog-post");
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi thêm bài viết blog!");
    },
  });

  const onFinish = (values: IAdminBlogPostForm) => {
    mutation.mutate(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="max-w-4xl mx-auto bg-white p-6 rounded shadow"
    >
      <Form.Item
        label="Tiêu đề"
        name="title"
        rules={[{ required: true, message: "Vui lòng nhập tiêu đề bài viết!" }]}
      >
        <Input placeholder="Nhập tiêu đề bài viết" />
      </Form.Item>

      <Form.Item
        label="Slug"
        name="slug"
        rules={[{ required: true, message: "Vui lòng nhập slug!" }]}
      >
        <Input placeholder="Nhập slug" />
      </Form.Item>

      <Form.Item
        label="Tóm tắt"
        name="summary"
        rules={[{ required: true, message: "Vui lòng nhập tóm tắt bài viết!" }]}
      >
        <TextArea rows={3} placeholder="Nhập tóm tắt bài viết" />
      </Form.Item>

      <Form.Item
        label="Nội dung"
        name="content"
        rules={[{ required: true, message: "Vui lòng nhập nội dung bài viết!" }]}
      >
        <TextArea rows={10} placeholder="Nhập nội dung bài viết" />
      </Form.Item>

      <Form.Item
        label="Danh mục blog"
        name="blog_category_id"
        rules={[{ required: true, message: "Vui lòng chọn danh mục blog!" }]}
      >
        <Select placeholder="Chọn danh mục blog">
          {categories.map((category: IAdminBlogCategory) => (
            <Option key={category.id} value={category.id}>
              {category.category_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Meta Title" name="meta_title">
        <Input placeholder="Nhập meta title" />
      </Form.Item>

      <Form.Item label="Meta Description" name="meta_description">
        <TextArea rows={3} placeholder="Nhập meta description" />
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        initialValue="published"
      >
        <Select>
          <Option value="published">Đã xuất bản</Option>
          <Option value="draft">Bản nháp</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={mutation.isPending}
          className="w-full"
        >
          Thêm Bài Viết Blog
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddBlogPost;