import { Table, Button, message, Modal, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCategories,
  deleteCategory,
} from "../../../services/categoryService";
import type { ICategory } from "../../../interfaces/category";

const ListCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      message.success("Xóa danh mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      message.error("Xóa danh mục thất bại!");
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const handleDeleteCategory = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa danh mục này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => mutation.mutate(id),
    });
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
    // {
    //   title: "Danh mục cha",
    //   dataIndex: "parent_category_id",
    //   key: "parent_category_id",
    //   render: (parentId: number | null) => parentId ? parentId : <span style={{color:'#aaa'}}>Không</span>,
    // },
    // {
    //   title: "Thứ tự",
    //   dataIndex: "sort_order",
    //   key: "sort_order",
    // },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    // },
    {
      title: "Hành Động",
      key: "action",
      render: (_: unknown, record: ICategory) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/category/edit/${record.id}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteCategory(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <button
        onClick={() => navigate("/admin/category/add")}
        className="px-4 py-2 mb-3 bg-amber-700 text-white rounded hover:bg-amber-800 transition font-semibold shadow"
      >
        Thêm Danh Mục
      </button>
      <Table
        columns={columns}
        loading={isLoading}
        dataSource={data}
        rowKey="id"
      />
    </>
  );
};

export default ListCategory;
