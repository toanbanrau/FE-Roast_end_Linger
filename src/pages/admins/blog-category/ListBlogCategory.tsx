import { Table, Button, Tag, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getAllBlogCategories,
  deleteBlogCategory,
} from "../../../services/blogCategoryService";
import type { IAdminBlogCategory } from "../../../interfaces/category";

const ListBlogCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: getAllBlogCategories,
  });

  const mutation = useMutation({
    mutationFn: deleteBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  const columns = [
    {
      title: "STT",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Tên Danh Mục",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Danh Mục Cha",
      dataIndex: "parent",
      key: "parent",
      render: (parent: IAdminBlogCategory | null) =>
        parent?.category_name || "-",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) =>
        status ? <Tag color="green">Hiển thị</Tag> : <Tag color="red">Ẩn</Tag>,
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_: unknown, record: IAdminBlogCategory) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/blog-category/edit/${record.id}`)}
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
    <>
      <button
        onClick={() => navigate("/admin/blog-category/add")}
        className="px-4 py-2 mb-3 bg-amber-700 text-white rounded hover:bg-amber-800 transition font-semibold shadow"
      >
        Thêm Danh Mục Sản Phẩm
      </button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />
    </>
  );
};

export default ListBlogCategory;
