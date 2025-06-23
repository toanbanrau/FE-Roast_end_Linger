import { Table, Button, Tag } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getAllBlogCategories,
  deleteBlogCategory,
} from "../../../services/blogCategoryService";
import type { IAdminBlogCategory } from "../../../interfaces/category";
import {  FileAddOutlined } from "@ant-design/icons";
import EyeIcon from "../../../components/icons/EyeIcon";
import EditIcon from "../../../components/icons/EditIcon";
import TrashIcon from "../../../components/icons/TrashIcon";

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
      dataIndex: "stt",
      key: "stt",
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
      render: (parent: IAdminBlogCategory | null) => parent?.category_name || "-",
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
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <EyeIcon style={{color:'yellow',cursor: 'pointer', transition: 'color 0.2s'}} onClick={() => navigate(`/admin/blog-category/${record.id}`)} />
          <EditIcon
            style={{ color: '#1677ff', cursor: 'pointer', transition: 'color 0.2s' }}
            onClick={() => navigate(`/admin/blog-category/edit/${record.id}`)}
          />
          <TrashIcon
            style={{ color: '#ff4d4f', cursor: 'pointer', transition: 'color 0.2s' }}
            onClick={() => handleDelete(record.id)}
          />
        </div>
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
