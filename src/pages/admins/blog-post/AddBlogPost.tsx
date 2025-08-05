import { Form, Input, Button, Select, message, Upload, Card } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import type { IAdminBlogPostForm } from "../../../interfaces/blog";
import { createBlogPost } from "../../../services/blogPostService";
import { getAllBlogCategories } from "../../../services/blogCategoryService";
import type { IAdminBlogCategory } from "../../../interfaces/category";
import type { UploadFile } from "antd/es/upload/interface";

const { TextArea } = Input;
const { Option } = Select;

const AddBlogPost = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
    onError: (error: any) => {
      console.error("Create blog post error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi thêm bài viết blog!";
      message.error(errorMessage);
    },
  });

  const onFinish = (values: IAdminBlogPostForm) => {
    const formData = {
      ...values,
      featured_image: fileList[0]?.originFileObj || null,
    };
    mutation.mutate(formData);
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
              Thêm bài viết mới
            </h1>
            <p className="text-gray-600">Tạo bài viết blog mới cho hệ thống</p>
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
                  {
                    max: 300,
                    message: "Tiêu đề không được vượt quá 300 ký tự!",
                  },
                ]}
              >
                <Input placeholder="Nhập tiêu đề bài viết" />
              </Form.Item>

              <Form.Item
                label="Slug (URL)"
                name="slug"
                help="Để trống để tự động tạo từ tiêu đề"
              >
                <Input placeholder="Nhập slug hoặc để trống để tự động tạo" />
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
            </Card>

            <Card title="Nội dung bài viết" className="shadow-sm">
              <Form.Item
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
                  rows={15}
                  placeholder="Nhập nội dung bài viết (hỗ trợ HTML)"
                />
              </Form.Item>
            </Card>

            <Card title="SEO" className="shadow-sm">
              <Form.Item
                label="Meta Title"
                name="meta_title"
                help="Tiêu đề SEO (tối đa 200 ký tự)"
              >
                <Input
                  placeholder="Nhập meta title cho SEO"
                  maxLength={200}
                  showCount
                />
              </Form.Item>

              <Form.Item
                label="Meta Description"
                name="meta_description"
                help="Mô tả SEO (tối đa 500 ký tự)"
              >
                <TextArea
                  rows={3}
                  placeholder="Nhập meta description cho SEO"
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="Xuất bản" className="shadow-sm">
              <Form.Item label="Trạng thái" name="status" initialValue="draft">
                <Select>
                  <Option value="draft">Bản nháp</Option>
                  <Option value="published">Đã xuất bản</Option>
                  <Option value="archived">Đã lưu trữ</Option>
                </Select>
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
              <p className="text-sm text-gray-500 mt-2">
                Chỉ hỗ trợ file ảnh, tối đa 2MB
              </p>
            </Card>

            <Card className="shadow-sm">
              <Button
                type="primary"
                htmlType="submit"
                loading={mutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="large"
              >
                {mutation.isPending ? "Đang tạo..." : "Tạo bài viết"}
              </Button>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddBlogPost;
