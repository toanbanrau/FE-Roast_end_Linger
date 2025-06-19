import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import type { IBrand } from "../../../interfaces/brand";

const ListProduct = () => {
  const navigate = useNavigate();

  const data = [
    {
      key: "1",
      stt: 1,
      name: "Apple",
      description: "Apple",
    },
    {
      key: "2",
      stt: 2,
      name: "Samsung",
      description: "Samsung",
    },
  ];
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "description",
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "description",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (data: IBrand) => (
        <>
          <button
            onClick={() => navigate(`/admin/product/edit/${data.id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition font-medium mr-2"
          >
            Sửa
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition font-medium">
            Xóa
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      <button
        onClick={() => navigate("/admin/product/add")}
        className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition font-semibold shadow"
      >
        Thêm Sản Phẩm
      </button>
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default ListProduct;
