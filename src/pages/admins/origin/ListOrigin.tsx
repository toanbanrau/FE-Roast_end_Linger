import { Table, message, Modal, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrigins, deleteOrigin } from "../../../services/originService";
import type { IOrigin } from "../../../interfaces/origin";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ListOrigin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: origins, isLoading } = useQuery({
    queryKey: ["origins"],
    queryFn: getAllOrigins,
  });

  const mutation = useMutation({
    mutationFn: deleteOrigin,
    onSuccess: () => {
      message.success("Xóa xuất xứ thành công!");
      queryClient.invalidateQueries({ queryKey: ["origins"] });
    },
    onError: () => {
      message.error("Xóa xuất xứ thất bại!");
    },
  });

  const handleDeleteOrigin = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa xuất xứ này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => mutation.mutate(id),
    });
  };

  const columns: ColumnsType<IOrigin> = [
    {
      title: "STT",
      key: "stt",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Tên xuất xứ",
      dataIndex: "origin_name",
      key: "origin_name",
    },
    {
      title: "Quốc gia",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: IOrigin) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/origin/edit/${record.id}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteOrigin(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <button
        onClick={() => navigate("/admin/origin/add")}
        className="px-4 py-2 mb-3 bg-amber-700 text-white rounded hover:bg-amber-800 transition font-semibold shadow"
      >
        Thêm Xuất Xứ
      </button>
      <Table
        columns={columns}
        loading={isLoading}
        dataSource={origins}
        rowKey="id"
      />
    </>
  );
};

export default ListOrigin;
