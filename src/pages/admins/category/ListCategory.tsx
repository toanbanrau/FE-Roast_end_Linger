import { Table, Button, Popconfirm } from "antd";
import { FormOutlined, DeleteOutlined, FileAddOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCategories, deleteCategory } from "../../../services/categoryService";
import type { ICategory } from "../../../interfaces/category";
import { EditIcon, EyeIcon, TrashIcon } from "lucide-react";

const ListCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const mutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  const handleDeleteCategory = (id) =>{
      
  }

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
      title: "Hành Động",
      key: "action",
      render: (_: unknown, record: ICategory) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <EyeIcon style={{color:'yellow',cursor: 'pointer', transition: 'color 0.2s'}} />
       <EditIcon
         style={{ color: '#1677ff', cursor: 'pointer', transition: 'color 0.2s' }}
         onClick={() => navigate(`/admin/brand/edit/${record.id}`)}
        
       />
       <TrashIcon
         style={{ color: '#ff4d4f', cursor: 'pointer', transition: 'color 0.2s' }}
         onClick={() => handleDeleteCategory(record.id)}

       />
      
       
     </div>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        className="mb-4 flex items-center gap-2 rounded-full shadow-lg px-6 py-2 text-base font-semibold uppercase transition-all duration-200 hover:bg-blue-700"
        icon={<FileAddOutlined style={{ fontSize: 20 }} />}
        style={{ background: '#1677ff', border: 'none' }}
        onClick={() => navigate("/admin/category/add")}
      >
        Thêm Danh Mục
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </>
  );
};

export default ListCategory;
