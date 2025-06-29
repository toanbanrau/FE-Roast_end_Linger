import { Image, message, Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IBrand } from "../../../interfaces/brand";
import { deleteBrand, getAllBrands } from "../../../services/brandService";
import TrashIcon from "../../../components/icons/TrashIcon";
import EditIcon from "../../../components/icons/EditIcon";
import EyeIcon from "../../../components/icons/EyeIcon";

const ListBrand = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });

  const mutation = useMutation({
    mutationFn: (id: number) => deleteBrand(id),
    onSuccess: () => {
      message.success("Xóa thương hiệu thành công!");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi xóa thương hiệu!");
    },
  });
  const handleDeleteBrand = (id: number) => {
    mutation.mutate(id);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_: unknown, __: IBrand, index: number) => index + 1,
    },
    {
      title: "Tên",
      dataIndex: "brand_name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Logo",
      render: (data: IBrand) => <Image src={data.logo} width={60} height={60} />,
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "description",
    },
    {
      title: "Hành động",
      key: "action",
      render: (data: IBrand) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
           <EyeIcon style={{color:'yellow',cursor: 'pointer', transition: 'color 0.2s'}} />
          <EditIcon
            style={{ color: '#1677ff', cursor: 'pointer', transition: 'color 0.2s' }}
            onClick={() => navigate(`/admin/brand/edit/${data.id}`)}
           
          />
          <TrashIcon
            style={{ color: '#ff4d4f', cursor: 'pointer', transition: 'color 0.2s' }}
            onClick={() => handleDeleteBrand(data.id)}

          />
         
          
        </div>
      ),
    },
  ];

  return (
    <>
      <button
        onClick={() => navigate("/admin/brand/add")}
        className="px-4 py-2 mb-3 bg-amber-700 text-white rounded hover:bg-amber-800 transition font-semibold shadow"
      >
        Thêm Thương Hiệu
      </button>
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default ListBrand;
