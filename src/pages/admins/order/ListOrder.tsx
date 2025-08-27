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
  Statistic,
  Row,
  Col,
  message,
  Tooltip,
  Alert,
} from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import type { IOrder } from "../../../interfaces/order";
import {
  getAllOrders,
  getOrderStats,
  getOrderStatuses,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../../services/adminOrderService";
import { getStatusText, getStatusColor } from "../../../utils/orderStatusUtils";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/ConfirmModal";

const { Search } = Input;
const { Option } = Select;

export default function ListOrder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<
    string | undefined
  >();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    boolean | undefined
  >();

  // State cho confirm modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingPaymentUpdate, setPendingPaymentUpdate] = useState<{
    orderId: number;
    paymentStatus: boolean;
  } | null>(null);

  // State cho confirm modal status order
  const [isStatusConfirmModalOpen, setIsStatusConfirmModalOpen] =
    useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    orderId: number;
    statusId: number;
    statusName: string;
  } | null>(null);

  // Lấy danh sách đơn hàng
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: [
      "admin-orders",
      currentPage,
      searchQuery,
      statusFilter,
      paymentMethodFilter,
      paymentStatusFilter,
    ],
    queryFn: () => {
      return getAllOrders({
        page: currentPage,
        per_page: 10,
        search: searchQuery || undefined,
        status_id: statusFilter || undefined,
        payment_method: paymentMethodFilter || undefined,
        payment_status: paymentStatusFilter,
      });
    },
  });

  // Lấy thống kê đơn hàng
  const { data: stats } = useQuery({
    queryKey: ["order-stats"],
    queryFn: () => getOrderStats(),
  });

  // Lấy danh sách trạng thái
  const { data: orderStatuses } = useQuery({
    queryKey: ["order-statuses"],
    queryFn: getOrderStatuses,
  });

  // Mutation cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      statusId,
    }: {
      orderId: number;
      statusId: number;
    }) => {
      console.log("🚀 Mutation function called:", { orderId, statusId });
      return updateOrderStatus(orderId, statusId);
    },
    onSuccess: (data) => {
      console.log("✅ Mutation success:", data);
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
      // Đóng modal và reset state
      setIsStatusConfirmModalOpen(false);
      setPendingStatusUpdate(null);
    },
    onError: (error) => {
      console.error("❌ Mutation error:", error);
      message.error("Cập nhật trạng thái thất bại");
      // Đóng modal và reset state
      setIsStatusConfirmModalOpen(false);
      setPendingStatusUpdate(null);
    },
  });

  // Mutation cập nhật trạng thái thanh toán
  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      paymentStatus,
    }: {
      orderId: number;
      paymentStatus: boolean;
    }) => {
      console.log("🚀 Payment status mutation called:", {
        orderId,
        paymentStatus,
      });
      return updatePaymentStatus(orderId, paymentStatus);
    },
    onSuccess: (data) => {
      console.log("✅ Payment status mutation success:", data);
      toast.success(
        `Cập nhật trạng thái thanh toán thành công: ${data.payment_status_text}`
      );
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
      // Đóng modal và reset state
      setIsConfirmModalOpen(false);
      setPendingPaymentUpdate(null);
    },
    onError: (error) => {
      console.error("❌ Payment status mutation error:", error);
      message.error("Cập nhật trạng thái thanh toán thất bại");
      // Đóng modal và reset state
      setIsConfirmModalOpen(false);
      setPendingPaymentUpdate(null);
    },
  });

  // Định nghĩa thứ tự trạng thái (từ thấp đến cao) - theo database
  const statusOrder = [
    "pending", // 1. Chờ xử lý
    "confirmed", // 2. Đã xác nhận
    "processing", // 3. Đang xử lý
    "shipping", // 4. Đang vận chuyển
    "delivered", // 5. Đã giao hàng
    "completed", // 6. Hoàn thành
  ];

  // Trạng thái cuối (không thể chỉnh sửa)
  const finalStatuses = ["completed", "cancelled", "refunded"];

  // Kiểm tra xem có thể chuyển trạng thái không
  const canChangeStatus = (
    currentStatus: string | undefined | null,
    newStatusId: number
  ) => {
    // Tìm trạng thái mới
    const newStatus = orderStatuses?.find((s) => s.id === newStatusId);
    if (!newStatus || !newStatus.status_name) return false;

    const newStatusName = newStatus.status_name.toLowerCase();
    const currentStatusName = (currentStatus || "").toLowerCase();

    // Nếu trạng thái hiện tại là cuối thì không được chỉnh
    if (finalStatuses.includes(currentStatusName)) {
      return false;
    }

    if (newStatusName === "cancelled") {
      // Chỉ cho phép hủy khi đơn hàng đang ở trạng thái "Chờ xử lý" (pending)
      return currentStatusName === "pending";
    }

    // Không cho phép chuyển từ cancelled sang trạng thái khác
    if (currentStatusName === "cancelled") {
      return false;
    }

    // Kiểm tra thứ tự tiến triển (chỉ được tiến lên)
    const currentIndex = statusOrder.indexOf(currentStatusName);
    const newIndex = statusOrder.indexOf(newStatusName);

    // Nếu không tìm thấy trong statusOrder, cho phép (có thể là trạng thái đặc biệt)
    if (currentIndex === -1 || newIndex === -1) {
      return true;
    }

    // Chỉ cho phép tiến lên một bước
    return newIndex === currentIndex + 1;
  };

  const handleStatusChange = (
    orderId: number,
    statusId: number,
    currentOrder: IOrder
  ) => {
    console.log("🔄 handleStatusChange called:", { orderId, statusId });

    const currentStatusName = currentOrder.status.name;

    // Kiểm tra validation
    if (!canChangeStatus(currentStatusName, statusId)) {
      const newStatus = orderStatuses?.find((s) => s.id === statusId);
      const newStatusText = newStatus
        ? getStatusText(newStatus.status_name)
        : "Unknown";
      const currentStatusText = getStatusText(currentStatusName);

      if (finalStatuses.includes(currentStatusName.toLowerCase())) {
        toast.error(
          `Không thể thay đổi trạng thái từ "${currentStatusText}" vì đơn hàng đã hoàn tất!`
        );
      } else {
        toast.error(
          `Không thể chuyển từ "${currentStatusText}" về "${newStatusText}". Chỉ có thể tiến lên trạng thái tiếp theo!`
        );
      }
      
      return;
    }

    console.log("✅ Status change validation passed");
    console.log("🚀 Calling mutation");
    handleOrderStatusChange(orderId, statusId);
  };

  // Xử lý confirm thay đổi trạng thái thanh toán
  const handlePaymentStatusChange = (
    orderId: number,
    paymentStatus: boolean,
    currentPaymentStatus: boolean,
    shiping_method:string,
    status_id:number
  ) => {
    // Nếu đã thanh toán rồi thì không cho chuyển về chưa thanh toán
    if (currentPaymentStatus === true && paymentStatus === false) {
      toast.error("Không thể chuyển từ 'Đã thanh toán' về 'Chưa thanh toán'!");
      return;
    }
    if(shiping_method == 'cod' && status_id !== 8 ){
       toast.error('Đơn Hàng Chưa Giao Không Thể Đổi Đã Thanh Toán')
       return
    }


    // Nếu chuyển từ chưa thanh toán -> đã thanh toán thì cần confirm
    if (paymentStatus === true) {
      setPendingPaymentUpdate({ orderId, paymentStatus });
      setIsConfirmModalOpen(true);
    }
  };

  // Xử lý confirm modal
  const handleConfirmPaymentUpdate = () => {
    if (pendingPaymentUpdate) {
      updatePaymentStatusMutation.mutate(pendingPaymentUpdate);
    }
  };

  const handleCancelPaymentUpdate = () => {
    setIsConfirmModalOpen(false);
    setPendingPaymentUpdate(null);
  };

  // Xử lý confirm thay đổi trạng thái đơn hàng
  const handleOrderStatusChange = (orderId: number, statusId: number) => {
    // Tìm tên trạng thái từ danh sách
    const statusName =
      orderStatuses?.find((status) => status.id === statusId)?.status_name ||
      "Không xác định";

    setPendingStatusUpdate({ orderId, statusId, statusName });
    setIsStatusConfirmModalOpen(true);
  };

  // Xử lý confirm modal status
  const handleConfirmStatusUpdate = () => {
    if (pendingStatusUpdate) {
      updateStatusMutation.mutate({
        orderId: pendingStatusUpdate.orderId,
        statusId: pendingStatusUpdate.statusId,
      });
    }
  };

  const handleCancelStatusUpdate = () => {
    setIsStatusConfirmModalOpen(false);
    setPendingStatusUpdate(null);
  };

  const columns: ColumnsType<IOrder> = [
    {
      title: "STT",
      key: "stt",
      width: 50,
      render: (_: unknown, __: unknown, index: number) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "order_number",
      key: "order_number",
      width: 150,
      render: (orderNumber: string) => (
        <span className="font-mono text-blue-600">{orderNumber}</span>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (_, record: IOrder) => (
        <div>
          <div className="font-medium">{record.customer_info.name}</div>
          <div className="text-gray-500 text-sm">
            {record.customer_info.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      key: "total",
      width: 120,
      render: (_, record: IOrder) => (
        <span className="font-semibold text-green-600">
          {Number(record.order_totals.total_amount).toLocaleString()}₫
        </span>
      ),
    },
    // {
    //   title: "Phương thức thanh toán",
    //   dataIndex: "payment_method",
    //   key: "payment_method",
    //   width: 180,
    //   render: (method: string) => (
    //     <Tag color={getPaymentMethodColor(method)}>
    //       {getPaymentMethodText(method)}
    //     </Tag>
    //   ),
    // },
    {
      title: "Trạng thái thanh toán",
      key: "payment_status",
      width: 180,
      render: (_, record: IOrder) => {
        const isPaid = record.payment_status || record.is_paid;
        return (
          <Select
            value={isPaid}
            style={{ width: 150 }}
            loading={updatePaymentStatusMutation.isPending}
            disabled={updatePaymentStatusMutation.isPending}
            onChange={(value: boolean) => {
              handlePaymentStatusChange(record.id, value, isPaid , record.payment_method,record.status.id);
            }}
          >
            <Option value={false}>
              <Tag color="orange">Chưa thanh toán</Tag>
            </Option>
            <Option value={true}>
              <Tag color="green">Đã thanh toán</Tag>
            </Option>
          </Select>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 150,
      render: (_, record: IOrder) => {
        const currentStatusName = record.status?.name?.toLowerCase() || "";
        const isFinalStatus = finalStatuses.includes(currentStatusName);

        // Lọc các trạng thái có thể chuyển đến
        const availableStatuses =
          orderStatuses?.filter(
            (status) =>
              !["completed", "refunded", "cancelled"].includes(
                status.status_name.toLowerCase()
              ) && canChangeStatus(currentStatusName, status.id)
          ) || [];

        return (
          <div>
            <Tooltip
              title={
                isFinalStatus
                  ? "Đơn hàng đã hoàn tất, không thể thay đổi trạng thái"
                  : "Chỉ có thể chuyển lên trạng thái tiếp theo"
              }
            >
              <Select
                value={record.status.id}
                style={{ width: "100%" }}
                onChange={(statusId) =>
                  handleStatusChange(record.id, statusId, record)
                }
                loading={updateStatusMutation.isPending}
                disabled={isFinalStatus}
                placeholder="Chọn trạng thái"
              >
                {/* Hiển thị trạng thái hiện tại */}
                <Option key={record.status.id} value={record.status.id}>
                  <Tag color={record.status.color}>
                    {getStatusText(record.status.name)}
                  </Tag>
                </Option>

                {/* Hiển thị các trạng thái có thể chuyển đến */}
                {availableStatuses
                  .filter((status) => status.id !== record.status.id) // Loại bỏ trạng thái hiện tại
                  .map((status) => (
                    <Option key={status.id} value={status.id}>
                      <Tag color={status.color}>
                        {getStatusText(status.status_name)}
                      </Tag>
                    </Option>
                  ))}
              </Select>
            </Tooltip>

            {isFinalStatus && (
              <div className="text-xs text-gray-500 mt-1">
                🔒 Không thể thay đổi
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      key: "created_at",
      width: 100,
      render: (_, record: IOrder) => (
        <span>
          {new Date(record.dates.created_at).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 100,
      render: (_, record: IOrder) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/order/${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Thống kê */}
      {stats && (
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng đơn hàng"
                value={stats.summary.total_orders}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng sản phẩm đã bán"
                value={stats.summary.total_items_sold}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Doanh thu tổng"
                value={Number(stats.summary.total_revenue).toLocaleString()}
                suffix="₫"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Giá trị đơn hàng trung bình"
                value={Number(
                  stats.summary.average_order_value
                ).toLocaleString()}
                suffix="₫"
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Bộ lọc */}
      <Card className="mb-6">
        <Space size="middle" wrap>
          <Search
            placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={setSearchQuery}
            style={{ width: 300 }}
          />

          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 200 }}
            onChange={setStatusFilter}
          >
            {orderStatuses?.map((status) => (
              <Option key={status.id} value={status.id}>
                {getStatusText(status.status_name)}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Lọc theo phương thức thanh toán"
            allowClear
            style={{ width: 200 }}
            onChange={setPaymentMethodFilter}
          >
            <Option value="cash_on_delivery">Thanh toán khi nhận hàng</Option>
            <Option value="bank_transfer">Chuyển khoản ngân hàng</Option>
            <Option value="credit_card">Thẻ tín dụng</Option>
            <Option value="e_wallet">Ví điện tử</Option>
          </Select>

          <Select
            placeholder="Lọc theo trạng thái thanh toán"
            allowClear
            style={{ width: 200 }}
            onChange={setPaymentStatusFilter}
          >
            <Option value={true}>Đã thanh toán</Option>
            <Option value={false}>Chưa thanh toán</Option>
          </Select>
        </Space>
      </Card>

      {/* Bảng đơn hàng */}
      <Card>
        <Table
          columns={columns}
          dataSource={ordersData?.orders || []}
          rowKey="id"
          loading={ordersLoading}
          pagination={{
            current: currentPage,
            total: ordersData?.pagination.total || 0,
            pageSize: ordersData?.pagination.per_page || 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
            onChange: (page) => setCurrentPage(page),
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Confirm Modal Payment */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelPaymentUpdate}
        onConfirm={handleConfirmPaymentUpdate}
        title="Xác nhận thay đổi trạng thái thanh toán"
        message="Bạn có chắc chắn muốn đánh dấu đơn hàng này là đã thanh toán?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        type="warning"
        isLoading={updatePaymentStatusMutation.isPending}
      />

      {/* Confirm Modal Status */}
      <ConfirmModal
        isOpen={isStatusConfirmModalOpen}
        onClose={handleCancelStatusUpdate}
        onConfirm={handleConfirmStatusUpdate}
        title="Xác nhận thay đổi trạng thái đơn hàng"
        message={`Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng thành "${pendingStatusUpdate?.statusName}"?`}
        confirmText="Xác nhận"
        cancelText="Hủy"
        type="warning"
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
