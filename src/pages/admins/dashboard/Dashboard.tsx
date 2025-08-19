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
  Alert,
  Progress,
  Switch,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingOutlined,
  UserOutlined,
  GiftOutlined,
  DollarOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Column, Pie, Line } from "@ant-design/charts";
import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStatistics,
  formatCurrency,
  formatPercentage,
  getGrowthColor,
  type DashboardParams
} from "../../../services/dashboardService";

import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>("month");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [onlyCompleted, setOnlyCompleted] = useState(true); // Mặc định chỉ lấy completed orders

  // Lấy dashboard statistics từ API mới
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["dashboard-statistics", period, dateRange, onlyCompleted],
    queryFn: () => {
      const params: DashboardParams = {
        period: period,
        include_charts: true,
        timezone: 'Asia/Ho_Chi_Minh',
        status: onlyCompleted ? 'completed' : 'all' // Toggle giữa completed và all
      };

      if (period === "custom" && dateRange) {
        params.start_date = dateRange[0].format("YYYY-MM-DD");
        params.end_date = dateRange[1].format("YYYY-MM-DD");
      }

      return getDashboardStatistics(params);
    },
  });

  const stats = dashboardData?.data;

  // Filter và tính toán lại chỉ cho completed orders
  const getCompletedOrdersStats = () => {
    if (!stats) return null;

    // Lấy daily breakdown để tính completed orders
    const completedDailyData = stats.detailed_stats.daily_breakdown.filter(day => {
      // Giả sử completed orders có trong daily breakdown
      // Tạm thời sử dụng tất cả data vì API chưa phân biệt status
      return true; // TODO: Filter theo completed status khi backend hỗ trợ
    });

    // Tính tổng completed orders từ daily breakdown
    const completedStats = completedDailyData.reduce((acc, day) => {
      acc.total_orders += day.total_orders;
      acc.total_revenue += parseFloat(day.total_revenue);
      acc.unique_customers = Math.max(acc.unique_customers, day.unique_customers);
      return acc;
    }, {
      total_orders: 0,
      total_revenue: 0,
      unique_customers: 0
    });

    // Tính average order value cho completed orders
    const avg_order_value = completedStats.total_orders > 0
      ? completedStats.total_revenue / completedStats.total_orders
      : 0;



    return {
      total_orders: completedStats.total_orders,
      total_revenue: completedStats.total_revenue.toString(),
      average_order_value: avg_order_value,
      total_customers: completedStats.unique_customers,
      total_products: stats.overview.total_products // Giữ nguyên
    };
  };

  const completedStats = getCompletedOrdersStats();

  // Chuẩn bị dữ liệu cho biểu đồ line (doanh thu theo ngày)
  const revenueData = stats?.charts?.revenue_trend?.map((item) => {
    const revenueInMillions = parseFloat(item.revenue) / 1000000;


    return {
      date: dayjs(item.date).format("DD/MM"),
      revenue: revenueInMillions, // Chuyển đổi sang triệu VNĐ
      orders: 0, // API không trả về orders trong revenue_trend
    };
  }) || [];



  const revenueConfig = {
    data: revenueData,
    xField: "date",
    yField: "revenue",
    smooth: true,
    color: "#1890ff",
    point: {
      size: 4,
      shape: 'circle',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}M`,
      },
    },
    meta: {
      revenue: { alias: "Doanh thu (triệu VNĐ)" },
      date: { alias: "Ngày" },
    },
  };

  // Chuẩn bị dữ liệu cho biểu đồ tròn (trạng thái đơn hàng)
  const statusData = stats?.charts?.order_status_distribution ?
    Object.entries(stats.charts.order_status_distribution).map(([status, count]) => {
      const totalOrders = stats?.overview?.total_orders || 1;
      const percentage = ((count as number) / totalOrders * 100);


      return {
        type: status,
        value: count as number,
        percentage: parseFloat(percentage.toFixed(1)),
      };
    }) : [];



  const statusConfig = {
    appendPadding: 10,
    data: statusData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "spider" as const,
      labelHeight: 28,
      content: "{name}\n{percentage}%",
    },
    legend: {
      position: "bottom" as const,
    },
    color: ["#52c41a", "#1890ff", "#ff4d4f", "#faad14", "#722ed1"],
  };

  // Chuẩn bị dữ liệu cho bảng top categories
  const topCategoriesData = stats?.charts?.top_categories?.map((item, index) => {
    const revenue = parseFloat(item.revenue);
    const totalRevenue = parseFloat(stats?.overview?.total_revenue || '0');
    const percentage = totalRevenue > 0 ? (revenue / totalRevenue * 100) : 0;



    return {
      key: index.toString(),
      category: item.category_name,
      orders: 0, // API không trả về orders cho category
      revenue: revenue,
      percentage: parseFloat(percentage.toFixed(1)),
    };
  }) || [];



  const categoryColumns = [
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Số đơn",
      dataIndex: "orders",
      key: "orders",
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Tỷ lệ",
      dataIndex: "percentage",
      key: "percentage",
      render: (value: number) => (
        <div>
          <Progress percent={value} size="small" />
          <span>{value.toFixed(1)}%</span>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Đang tải dữ liệu dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description="Không thể tải dữ liệu dashboard. Vui lòng thử lại sau."
        type="error"
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <div>
      {/* Header với bộ lọc thời gian */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            📊 Dashboard Thống Kê - Đơn Hàng Hoàn Thành
          </Title>
          <p style={{ color: '#666', marginTop: 8 }}>
            Thống kê chỉ tính đơn hàng đã hoàn thành - {stats?.period?.type}
            ({dayjs(stats?.period?.start_date).format('DD/MM/YYYY')} - {dayjs(stats?.period?.end_date).format('DD/MM/YYYY')})
          </p>

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
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu (Completed)"
              value={parseFloat(completedStats?.total_revenue || '0')}
              prefix={<DollarOutlined />}
              valueStyle={{ color: getGrowthColor(stats?.growth?.revenue || 0) }}
              suffix={
                stats?.growth?.revenue && stats.growth.revenue > 0 ?
                <ArrowUpOutlined /> :
                stats?.growth?.revenue && stats.growth.revenue < 0 ?
                <ArrowDownOutlined /> : null
              }
              formatter={(value) => formatCurrency(Number(value))}
            />
            {stats?.growth?.revenue !== undefined && (
              <div style={{ marginTop: 8, fontSize: 12, color: getGrowthColor(stats.growth.revenue) }}>
                {formatPercentage(stats.growth.revenue)} so với kỳ trước
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn hàng hoàn thành"
              value={completedStats?.total_orders || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: getGrowthColor(stats?.growth?.orders || 0) }}
              suffix={
                stats?.growth?.orders && stats.growth.orders > 0 ?
                <ArrowUpOutlined /> :
                stats?.growth?.orders && stats.growth.orders < 0 ?
                <ArrowDownOutlined /> : null
              }
            />
            {stats?.growth?.orders !== undefined && (
              <div style={{ marginTop: 8, fontSize: 12, color: getGrowthColor(stats.growth.orders) }}>
                {formatPercentage(stats.growth.orders)} so với kỳ trước
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Khách hàng (Completed)"
              value={completedStats?.total_customers || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: getGrowthColor(stats?.growth?.users || 0) }}
              suffix={
                stats?.growth?.users && stats.growth.users > 0 ?
                <ArrowUpOutlined /> :
                stats?.growth?.users && stats.growth.users < 0 ?
                <ArrowDownOutlined /> : null
              }
            />
            {stats?.growth?.users !== undefined && (
              <div style={{ marginTop: 8, fontSize: 12, color: getGrowthColor(stats.growth.users) }}>
                {formatPercentage(stats.growth.users)} so với kỳ trước
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Giá trị đơn TB (Completed)"
              value={completedStats?.average_order_value || 0}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#faad14" }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              Tổng sản phẩm: {stats?.overview?.total_products || 0}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Stats */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} sm={8}>
          <Card title="📅 Hôm nay" size="small">
            <Row gutter={8}>
              <Col span={8}>
                <Statistic
                  title="Doanh thu"
                  value={parseFloat(stats?.recent_stats?.today?.revenue || '0')}
                  formatter={(value) => formatCurrency(Number(value))}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Đơn hàng"
                  value={stats?.recent_stats?.today?.orders || 0}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Khách hàng"
                  value={stats?.recent_stats?.today?.users || 0}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card title="📊 Tuần này" size="small">
            <Row gutter={8}>
              <Col span={8}>
                <Statistic
                  title="Doanh thu"
                  value={parseFloat(stats?.recent_stats?.this_week?.revenue || '0')}
                  formatter={(value) => formatCurrency(Number(value))}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Đơn hàng"
                  value={stats?.recent_stats?.this_week?.orders || 0}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Khách hàng"
                  value={stats?.recent_stats?.this_week?.users || 0}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card title="📈 Tháng này" size="small">
            <Row gutter={8}>
              <Col span={8}>
                <Statistic
                  title="Doanh thu"
                  value={parseFloat(stats?.recent_stats?.this_month?.revenue || '0')}
                  formatter={(value) => formatCurrency(Number(value))}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Đơn hàng"
                  value={stats?.recent_stats?.this_month?.orders || 0}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Khách hàng"
                  value={stats?.recent_stats?.this_month?.users || 0}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="📈 Xu hướng doanh thu" style={{ height: 400 }}>
            {revenueData.length > 0 ? (
              <Line {...revenueConfig} height={300} />
            ) : (
              <div style={{ textAlign: "center", padding: "50px" }}>
                Không có dữ liệu
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="📊 Phân bố trạng thái đơn hàng" style={{ height: 400 }}>
            {statusData.length > 0 ? (
              <Pie {...statusConfig} height={300} />
            ) : (
              <div style={{ textAlign: "center", padding: "50px" }}>
                Không có dữ liệu
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Bảng top categories */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="🏆 Top Danh Mục Bán Chạy">
            <Table
              dataSource={topCategoriesData}
              columns={categoryColumns}
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
