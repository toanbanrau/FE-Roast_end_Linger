import React from 'react';
import { Card, Col, Row, Statistic, Table, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ShoppingOutlined, UserOutlined, GiftOutlined } from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';

const { Title } = Typography;

const dataSource = [
  {
    key: '1',
    name: 'Nguyễn Văn A',
    order: 3,
    total: 1200000,
  },
  {
    key: '2',
    name: 'Trần Thị B',
    order: 2,
    total: 800000,
  },
  {
    key: '3',
    name: 'Lê Văn C',
    order: 1,
    total: 400000,
  },
];

const columns = [
  {
    title: 'Khách hàng',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Số đơn',
    dataIndex: 'order',
    key: 'order',
  },
  {
    title: 'Tổng chi tiêu',
    dataIndex: 'total',
    key: 'total',
    render: (value: number) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
  },
];

// Data for Column chart (doanh thu theo tháng)
const columnData = [
  { month: 'Th1', value: 120 },
  { month: 'Th2', value: 200 },
  { month: 'Th3', value: 150 },
  { month: 'Th4', value: 278 },
  { month: 'Th5', value: 189 },
  { month: 'Th6', value: 239 },
  { month: 'Th7', value: 350 },
  { month: 'Th8', value: 420 },
  { month: 'Th9', value: 380 },
  { month: 'Th10', value: 320 },
  { month: 'Th11', value: 410 },
  { month: 'Th12', value: 500 },
];

const columnConfig = {
  data: columnData,
  xField: 'month',
  yField: 'value',
  color: '#1890ff',
  columnWidthRatio: 0.6,
  label: {
    position: 'middle',
    style: {
      fill: '#fff',
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
    value: { alias: 'Doanh thu (triệu)' },
    month: { alias: 'Tháng' },
  },
};

// Data for Pie chart (trạng thái đơn hàng)
const pieData = [
  { type: 'Đã giao', value: 60 },
  { type: 'Đang xử lý', value: 25 },
  { type: 'Đã huỷ', value: 15 },
];

const pieConfig = {
  appendPadding: 10,
  data: pieData,
  angleField: 'value',
  colorField: 'type',
  radius: 1,
  innerRadius: 0.6,
  label: {
    type: 'spider',
    labelHeight: 28,
    content: '{name}\n{percentage}',
  },
  legend: {
    position: 'bottom',
  },
  color: ['#52c41a', '#1890ff', '#ff4d4f'],
};

const Dashboard: React.FC = () => {
  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Tổng quan hệ thống</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={1128}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng khách hàng"
              value={321}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Khuyến mãi đang chạy"
              value={5}
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="Doanh thu theo tháng" style={{ height: 350 }}>
            <Column {...columnConfig} height={250} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tỉ lệ trạng thái đơn hàng" style={{ height: 350 }}>
            <Pie {...pieConfig} height={250} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Khách hàng nổi bật">
            <Table
              dataSource={dataSource}
              columns={columns}
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
