import { Form, Input, Button, Select, message, Spin, Upload, Card } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import type { IAdminBlogPostForm } from "../../../interfaces/blog";
import {
  updateBlogPost,
  getBlogPostById,
} from "../../../services/blogPostService";
import { getAllBlogCategories } from "../../../services/blogCategoryService";
import type { IAdminBlogCategory } from "../../../interfaces/category";
import type { UploadFile } from "antd/es/upload/interface";

const { TextArea } = Input;
const { Option } = Select;

const EditBlogPost = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
        slug: blogPost.slug,
        summary: blogPost.summary,
        content: blogPost.content,
        blog_category_id: blogPost.category?.id,
        meta_title: blogPost.meta_title,
        meta_description: blogPost.meta_description,
        status: blogPost.status,
        // Không set featured_image vào form vì nó là File object
      });

      // Set existing image if available
      if (blogPost.featured_image) {
        setFileList([
          {
            uid: "-1",
            name: "featured_image",
            status: "done",
            url: blogPost.featured_image.startsWith("http")
              ? blogPost.featured_image
              : `http://localhost:8000/storage/${blogPost.featured_image}`,
          },
        ]);
      }
    }
  }, [blogPost, form]);

  const onFinish = (values: IAdminBlogPostForm) => {
    if (!id) {
      message.error("ID bài viết không hợp lệ!");
      return;
    }

    const formData = {
      ...values,
    };

    // Chỉ thêm featured_image nếu user upload file mới để thay thế
    if (fileList[0]?.originFileObj) {
      formData.featured_image = fileList[0].originFileObj;
    }
    // Nếu không có file mới thì không gửi featured_image field → giữ ảnh hiện tại
    // API không hỗ trợ xóa ảnh mà không thay thế

    mutation.mutate({ id: Number(id), data: formData });
  };

  const handleUploadChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ có thể upload file ảnh!");
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      return false;
    }

    return false; // Prevent auto upload
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
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/blog-post")}
          >
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chỉnh sửa bài viết
            </h1>
            <p className="text-gray-600">Cập nhật thông tin bài viết blog</p>
          </div>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Thông tin cơ bản" className="shadow-sm">
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tiêu đề bài viết!",
                  },
                ]}
              >
                <Input placeholder="Nhập tiêu đề bài viết" />
              </Form.Item>

              <Form.Item
                label="Tóm tắt"
                name="summary"
                help="Tóm tắt ngắn gọn về bài viết (tối đa 1000 ký tự)"
              >
                <TextArea
                  rows={3}
                  placeholder="Nhập tóm tắt bài viết"
                  maxLength={1000}
                  showCount
                />
              </Form.Item>

              <Form.Item
                label="Nội dung"
                name="content"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nội dung bài viết!",
                  },
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
                rules={[
                  { required: true, message: "Vui lòng chọn danh mục blog!" },
                ]}
              >
                <Select placeholder="Chọn danh mục blog">
                  {categories.map((category: IAdminBlogCategory) => (
                    <Option key={category.id} value={category.id}>
                      {category.category_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Ảnh đại diện" name="featured_image">
                <Input placeholder="URL ảnh đại diện (tùy chọn)" />
              </Form.Item>

              <Form.Item
                label="Trạng thái"
                name="status"
                initialValue="published"
              >
                <Select>
                  <Option value="draft">Bản nháp</Option>
                  <Option value="published">Đã xuất bản</Option>
                  <Option value="archived">Lưu trữ</Option>
                </Select>
              </Form.Item>
            </Card>

            <Card title="Ảnh đại diện" className="shadow-sm">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                {fileList.length === 0 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-500">
                  Chỉ hỗ trợ file ảnh, tối đa 2MB
                </p>

                {/* Thông báo trạng thái ảnh */}
                {fileList.length > 0 && fileList[0]?.originFileObj && (
                  <p className="text-sm text-green-600">
                    ✅ Ảnh mới sẽ thay thế ảnh hiện tại
                  </p>
                )}

                {blogPost?.featured_image &&
                  (fileList.length === 0 || !fileList[0]?.originFileObj) && (
                    <p className="text-sm text-blue-600">📷 Giữ ảnh hiện tại</p>
                  )}

                {!blogPost?.featured_image && fileList.length === 0 && (
                  <p className="text-sm text-gray-500">
                    📷 Chưa có ảnh đại diện
                  </p>
                )}

                {/* Thông tin về API limitation */}
                {blogPost?.featured_image && (
                  <p className="text-xs text-gray-400">
                    💡 Lưu ý: Chỉ có thể thay thế ảnh, không thể xóa ảnh hiện
                    tại
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  🔧 File upload sử dụng POST + _method override để tương thích
                  tốt hơn
                </p>
              </div>
            </Card>

            <Card className="shadow-sm">
              <div className="space-y-3">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={mutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="large"
                >
                  {mutation.isPending
                    ? "Đang cập nhật..."
                    : "Cập nhật bài viết"}
                </Button>
                <Button
                  onClick={() => navigate("/admin/blog-post")}
                  className="w-full"
                  size="large"
                  disabled={mutation.isPending}
                >
                  Hủy
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EditBlogPost;
