import { Button, Card, Tag, Spin, Descriptions } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { getBlogPostById } from "../../../services/blogPostService";

const ViewBlogPost = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Lấy chi tiết bài viết
  const { data: blogPost, isLoading } = useQuery({
    queryKey: ["blog-post", id],
    queryFn: () => getBlogPostById(Number(id)),
    enabled: !!id,
  });

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'draft': 'orange',
      'published': 'green',
      'archived': 'red',
    };
    return colorMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const textMap: { [key: string]: string } = {
      'draft': 'Bản nháp',
      'published': 'Đã xuất bản',
      'archived': 'Lưu trữ',
    };
    return textMap[status] || status;
  };

  if (isLoading) {
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
            <h1 className="text-2xl font-bold text-gray-800">Chi tiết bài viết</h1>
            <p className="text-gray-600">Xem thông tin chi tiết bài viết blog</p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/admin/blog-post/edit/${blogPost.id}`)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Chỉnh sửa
        </Button>
      </div>

      {/* Thông tin cơ bản */}
      <Card className="mb-6">
        <Descriptions title="Thông tin bài viết" bordered column={2}>
          <Descriptions.Item label="ID" span={1}>
            {blogPost.id}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái" span={1}>
            <Tag color={getStatusColor(blogPost.status)}>
              {getStatusText(blogPost.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tiêu đề" span={2}>
            <h2 className="text-lg font-semibold">{blogPost.title}</h2>
          </Descriptions.Item>
          <Descriptions.Item label="Slug" span={2}>
            <code className="bg-gray-100 px-2 py-1 rounded">{blogPost.slug}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục" span={1}>
            {blogPost.category?.category_name || 'Chưa phân loại'}
          </Descriptions.Item>
          <Descriptions.Item label="Lượt xem" span={1}>
            {blogPost.view_count?.toLocaleString() || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả" span={1}>
            {blogPost.author?.name || 'Không xác định'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo" span={1}>
            {new Date(blogPost.created_at).toLocaleString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Ảnh đại diện */}
      {blogPost.featured_image && (
        <Card title="Ảnh đại diện" className="mb-6">
          <img
            src={blogPost.featured_image}
            alt={blogPost.title}
            className="max-w-full h-auto rounded-lg shadow-md"
            style={{ maxHeight: '400px' }}
          />
        </Card>
      )}

      {/* Tóm tắt */}
      <Card title="Tóm tắt" className="mb-6">
        <p className="text-gray-700 leading-relaxed">
          {blogPost.excerpt || 'Không có tóm tắt'}
        </p>
      </Card>

      {/* Nội dung */}
      <Card title="Nội dung">
        <div className="prose max-w-none">
          <div 
            className="text-gray-700 leading-relaxed whitespace-pre-wrap"
            style={{ lineHeight: '1.8' }}
          >
            {blogPost.content}
          </div>
        </div>
      </Card>

      {/* Footer actions */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t">
        <Button onClick={() => navigate("/admin/blog-post")}>
          Quay lại danh sách
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/admin/blog-post/edit/${blogPost.id}`)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Chỉnh sửa bài viết
        </Button>
      </div>
    </div>
  );
};

export default ViewBlogPost;
