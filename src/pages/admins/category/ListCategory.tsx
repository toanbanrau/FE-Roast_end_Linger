import { Table } from "antd";
import { useNavigate } from "react-router-dom";

const ListCategory = () => {
  const navigate = useNavigate();
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Tên Danh Mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành Động",
      dataIndex: "action",
      key: "action",
    },
  ];

  return (
    <>
      <button
        onClick={() => navigate("/admin/category/add")}
        className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition font-semibold shadow"
      >
        Thêm Danh Mục
      </button>
      <Table columns={columns} dataSource={[]} />
    </>
  );
};

export default ListCategory;
