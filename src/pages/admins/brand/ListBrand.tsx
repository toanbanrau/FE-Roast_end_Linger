import { Image, message, Table, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { IBrand } from "../../../interfaces/brand";
import { deleteBrand, getAllBrands } from "../../../services/brandService";
import ConfirmModal from "../../../components/ConfirmModal";

const ListBrand = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    brandId: 0,
    brandName: "",
  });

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
  const handleDeleteBrand = (id: number, brandName: string) => {
    setConfirmModal({
      isOpen: true,
      brandId: id,
      brandName: brandName,
    });
  };

  const handleConfirmDelete = () => {
    mutation.mutate(confirmModal.brandId);
    setConfirmModal({ isOpen: false, brandId: 0, brandName: "" });
  };

  const handleCloseModal = () => {
    setConfirmModal({ isOpen: false, brandId: 0, brandName: "" });
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
      render: (data: IBrand) => (
        <Image src={data.logo} width={60} height={60} />
      ),
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
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/brand/edit/${data.id}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteBrand(data.id, data.brand_name)}
            loading={mutation.isPending}
          />
        </Space>
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

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa thương hiệu"
        message={`Bạn có chắc chắn muốn xóa thương hiệu "${confirmModal.brandName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        isLoading={mutation.isPending}
      />
    </>
  );
};

export default ListBrand;
