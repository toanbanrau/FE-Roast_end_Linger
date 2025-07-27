import { Table, Button, Tag, Space } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getAllBlogPosts,
  deleteBlogPost,
} from "../../../services/blogPostService";
import type { IAdminBlogPost } from "../../../interfaces/blog";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ListBlogPost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: getAllBlogPosts,
  });

  // Đảm bảo data luôn là array
  const blogPosts = Array.isArray(data) ? data : [];

  const mutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "published" ? "green" : "orange"}>
          {status === "published" ? "Đã xuất bản" : "Bản nháp"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_: unknown, record: IAdminBlogPost) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/blog-post/edit/${record.id}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý bài viết blog</h1>
        <Button type="primary" onClick={() => navigate("/admin/blog-post/add")}>
          Thêm bài viết mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={blogPosts}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ListBlogPost;
