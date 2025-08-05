import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Typography,
  Select,
  DatePicker,
  Space,
  Spin,
} from "antd";
import {
  ArrowUpOutlined,
  ShoppingOutlined,
  UserOutlined,
  GiftOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Column, Pie } from "@ant-design/charts";
import { useQuery } from "@tanstack/react-query";
import { getOrderStats } from "../../../services/adminOrderService";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<string>("month");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );

  // Lấy thống kê đơn hàng từ API
  const { data: orderStats, isLoading } = useQuery({
    queryKey: ["order-stats", period, dateRange],
    queryFn: () => {
      const params: {
        period?: string;
        date_from?: string;
        date_to?: string;
      } = {};

      if (period !== "custom") {
        params.period = period;
      } else if (dateRange) {
        params.date_from = dateRange[0].format("YYYY-MM-DD");
        params.date_to = dateRange[1].format("YYYY-MM-DD");
      }

      return getOrderStats(params);
    },
  });

  // Chuẩn bị dữ liệu cho biểu đồ cột (doanh thu theo ngày)
  const columnData =
    orderStats?.revenue_chart?.map((item) => ({
      date: dayjs(item.date).format("DD/MM"),
      revenue: item.revenue / 1000000, // Chuyển đổi sang triệu VNĐ
      orders: item.orders,
    })) || [];

  const columnConfig = {
    data: columnData,
    xField: "date",
    yField: "revenue",
    color: "#1890ff",
    columnWidthRatio: 0.6,
    label: {
      position: "middle" as const,
      style: {
        fill: "#fff",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      revenue: { alias: "Doanh thu (triệu VNĐ)" },
      date: { alias: "Ngày" },
    },
  };

  // Chuẩn bị dữ liệu cho biểu đồ tròn (trạng thái đơn hàng)
  const pieData =
    orderStats?.by_status?.map((item) => ({
      type: item.status_name,
      value: item.count,
    })) || [];

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "spider" as const,
      labelHeight: 28,
      content: "{name}\n{percentage}",
    },
    legend: {
      position: "bottom" as const,
    },
    color: ["#52c41a", "#1890ff", "#ff4d4f", "#faad14", "#722ed1"],
  };

  // Chuẩn bị dữ liệu cho bảng phương thức thanh toán
  const paymentMethodData =
    orderStats?.by_payment_method?.map((item, index) => ({
      key: index.toString(),
      method:
        item.payment_method === "cod"
          ? "Thanh toán khi nhận hàng"
          : item.payment_method === "bank_transfer"
          ? "Chuyển khoản ngân hàng"
          : item.payment_method === "momo"
          ? "Ví MoMo"
          : item.payment_method,
      count: item.count,
      revenue: item.revenue,
    })) || [];

  const paymentColumns = [
    {
      title: "Phương thức thanh toán",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Số đơn",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div>
      {/* Header với bộ lọc thời gian */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Thống kê đơn hàng
          </Title>
        </Col>
        <Col>
          <Space>
            <Select value={period} onChange={setPeriod} style={{ width: 120 }}>
              <Option value="today">Hôm nay</Option>
              <Option value="week">Tuần này</Option>
              <Option value="month">Tháng này</Option>
              <Option value="year">Năm này</Option>
              <Option value="custom">Tùy chọn</Option>
            </Select>
            {period === "custom" && (
              <RangePicker
                value={dateRange}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([dates[0], dates[1]]);
                  } else {
                    setDateRange(null);
                  }
                }}
                format="DD/MM/YYYY"
              />
            )}
          </Space>
        </Col>
      </Row>

      {/* Thống kê tổng quan */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={orderStats?.summary?.total_orders || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#3f8600" }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={orderStats?.summary?.total_revenue || 0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#1890ff" }}
              suffix={<ArrowUpOutlined />}
              formatter={(value) =>
                Number(value).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Giá trị đơn hàng TB"
              value={orderStats?.summary?.average_order_value || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#faad14" }}
              formatter={(value) =>
                Number(value).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm bán"
              value={orderStats?.summary?.total_items_sold || 0}
              prefix={<GiftOutlined />}
              valueStyle={{ color: "#722ed1" }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="Doanh thu theo ngày" style={{ height: 400 }}>
            {columnData.length > 0 ? (
              <Column {...columnConfig} height={300} />
            ) : (
              <div style={{ textAlign: "center", padding: "50px" }}>
                Không có dữ liệu
              </div>
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tỉ lệ trạng thái đơn hàng" style={{ height: 400 }}>
            {pieData.length > 0 ? (
              <Pie {...pieConfig} height={300} />
            ) : (
              <div style={{ textAlign: "center", padding: "50px" }}>
                Không có dữ liệu
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Bảng phương thức thanh toán */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Thống kê theo phương thức thanh toán">
            <Table
              dataSource={paymentMethodData}
              columns={paymentColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
