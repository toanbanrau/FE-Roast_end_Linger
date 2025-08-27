import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Card,
  message,
  Modal,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import type { IContact, IContactFilters } from "../../../interfaces/contact";
import {
  getAllContacts,
  deleteContact,
  updateContactStatus,
  getContactStatusOptions,
} from "../../../services/adminContactService";

const { Search } = Input;
const { Option } = Select;

// Define the valid status order
const STATUS_ORDER: ("new" | "processing" | "resolved")[] = [
  "new",
  "processing",
  "resolved",
];

// Helper function to get the next valid status
const getNextStatus = (currentStatus: "new" | "processing" | "resolved") => {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === STATUS_ORDER.length - 1) {
    return null; // No next status if at the end or invalid
  }
  return STATUS_ORDER[currentIndex + 1];
};

export default function ListContact() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<IContactFilters>({
    page: 1,
    per_page: 15,
  });

  // Lấy danh sách contacts
  const { data: contactsData, isLoading } = useQuery({
    queryKey: ["admin-contacts", filters],
    queryFn: () => getAllContacts(filters),
  });

  // Mutation xóa contact
  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      message.success("Xóa liên hệ thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
    },
    onError: () => {
      message.error("Xóa liên hệ thất bại");
    },
  });

  // Mutation cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: "new" | "processing" | "resolved";
    }) => updateContactStatus(id, { status }),
    onSuccess: () => {
      message.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
    },
    onError: () => {
      message.error("Cập nhật trạng thái thất bại");
    },
  });

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa liên hệ này?",
      onOk: () => {
        deleteMutation.mutate(id);
      },
    });
  };

  const handleStatusChange = (
    id: number,
    status: "new" | "processing" | "resolved",
    currentStatus: "new" | "processing" | "resolved"
  ) => {
    const nextStatus = getNextStatus(currentStatus);
    if (status === currentStatus) {
      // Allow keeping the current status (no change)
      return;
    }
    if (nextStatus === null || status !== nextStatus) {
      message.error("Không thể chuyển trạng thái lùi hoặc nhảy cóc!");
      return;
    }
    updateStatusMutation.mutate({ id, status });
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    setCurrentPage(1);
  };

  const handleStatusFilter = (
    status: "new" | "processing" | "resolved" | undefined
  ) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
    setCurrentPage(1);
  };

  const columns: ColumnsType<IContact> = [
    {
      title: "STT",
      key: "stt",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Thông tin khách hàng",
      key: "customer_info",
      width: 250,
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">{record.full_name}</div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <MailOutlined />
            <span>{record.email}</span>
          </div>
          {record.phone_number && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <PhoneOutlined />
              <span>{record.phone_number}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Chủ đề",
      dataIndex: "subject",
      key: "subject",
      width: 200,
      render: (subject: string) => (
        <span className="text-gray-700">{subject || "Không có chủ đề"}</span>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      key: "message",
      width: 300,
      render: (message: string) => (
        <Tooltip title={message}>
          <div className="text-gray-600 line-clamp-2">
            {message.length > 100 ? `${message.substring(0, 100)}...` : message}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 150,
      render: (_, record) => {
        const nextStatus = getNextStatus(record.status);
        const allowedStatuses = [record.status, nextStatus].filter(
          (status): status is "new" | "processing" | "resolved" => !!status
        );

        return (
          <Select
            value={record.status}
            style={{ width: "100%" }}
            onChange={(status) =>
              handleStatusChange(record.id, status, record.status)
            }
            loading={updateStatusMutation.isPending}
          >
            {getContactStatusOptions()
              .filter((option) => allowedStatuses.includes(option.value))
              .map((option) => (
                <Option key={option.value} value={option.value}>
                  <Tag color={option.color}>{option.label}</Tag>
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date: string) => (
        <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
           
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/contact/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
         
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              loading={deleteMutation.isPending}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý liên hệ</h1>
          <p className="text-gray-600">Quản lý các liên hệ từ khách hàng</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Space size="middle" wrap>
          <Search
            placeholder="Tìm kiếm theo tên, email, chủ đề..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />

          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 200 }}
            onChange={handleStatusFilter}
          >
            {getContactStatusOptions().map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={contactsData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            total: contactsData?.total || 0,
            pageSize: contactsData?.per_page || 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} liên hệ`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setFilters((prev) => ({ ...prev, page, per_page: pageSize }));
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}