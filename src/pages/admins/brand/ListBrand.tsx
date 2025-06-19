import { Image, message, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IBrand } from "../../../interfaces/brand";
import { deleteBrand, getAllBrands } from "../../../services/brandService";

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
      dataIndex: "stt",
      key: "stt",
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
      render: (data: IBrand) => <Image src={data.logo} width={50} />,
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
        <>
          <button
            onClick={() => navigate(`/admin/brand/edit/${data.id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition font-medium mr-2"
          >
            Sửa
          </button>
          <button
            onClick={() => handleDeleteBrand(data.id)}
            className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition font-medium"
          >
            Xóa
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      <button
        onClick={() => navigate("/admin/brand/add")}
        className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition font-semibold shadow"
      >
        Thêm Thương Hiệu
      </button>
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default ListBrand;
