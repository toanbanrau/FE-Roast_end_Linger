import { Form, Input, Button, Select, message, Spin } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import type { IAdminBlogPostForm } from "../../../interfaces/blog";
import { updateBlogPost, getBlogPostById } from "../../../services/blogPostService";
import { getAllBlogCategories } from "../../../services/blogCategoryService";
import type { IAdminBlogCategory } from "../../../interfaces/category";

const { TextArea } = Input;
const { Option } = Select;

const EditBlogPost = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  // Lấy chi tiết bài viết
  const { data: blogPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ["blog-post", id],
    queryFn: () => getBlogPostById(Number(id)),
    enabled: !!id,
  });

  // Lấy danh sách danh mục blog
  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: getAllBlogCategories,
  });

  // Mutation để cập nhật bài viết blog
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IAdminBlogPostForm }) =>
      updateBlogPost(id, data),
    onSuccess: () => {
      message.success("Cập nhật bài viết blog thành công!");
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post", id] });
      navigate("/admin/blog-post");
    },
    onError: (error: any) => {
      console.error("Error updating blog post:", error);
      message.error("Có lỗi xảy ra khi cập nhật bài viết blog!");
    },
  });

  // Set form values khi data được load
  useEffect(() => {
    if (blogPost) {
      form.setFieldsValue({
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        blog_category_id: blogPost.category?.id,
        status: blogPost.status,
        featured_image: blogPost.featured_image,
      });
    }
  }, [blogPost, form]);

  const onFinish = (values: IAdminBlogPostForm) => {
    if (!id) {
      message.error("ID bài viết không hợp lệ!");
      return;
    }
    mutation.mutate({ id: Number(id), data: values });
  };

  if (isLoadingPost) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy bài viết!</p>
        <Button onClick={() => navigate("/admin/blog-post")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa bài viết</h1>
        <p className="text-gray-600">Cập nhật thông tin bài viết blog</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề bài viết!" }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item
          label="Tóm tắt"
          name="excerpt"
          rules={[{ required: true, message: "Vui lòng nhập tóm tắt bài viết!" }]}
        >
          <TextArea rows={3} placeholder="Nhập tóm tắt bài viết" />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[
            { required: true, message: "Vui lòng nhập nội dung bài viết!" },
            { min: 10, message: "Nội dung phải có ít nhất 10 ký tự!" },
          ]}
        >
          <TextArea
            rows={10}
            placeholder="Nhập nội dung bài viết (ít nhất 10 ký tự)"
          />
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

        <Form.Item
          label="Ảnh đại diện"
          name="featured_image"
        >
          <Input placeholder="URL ảnh đại diện (tùy chọn)" />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" initialValue="published">
          <Select>
            <Option value="draft">Bản nháp</Option>
            <Option value="published">Đã xuất bản</Option>
            <Option value="archived">Lưu trữ</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex gap-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Cập nhật bài viết
            </Button>
            <Button
              onClick={() => navigate("/admin/blog-post")}
              disabled={mutation.isPending}
            >
              Hủy
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditBlogPost;
