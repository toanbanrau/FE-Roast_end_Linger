import React, { useState } from "react";
import {
  DashboardOutlined, // Dùng cho Dashboard
  InboxOutlined, // Dùng cho Product
  AppstoreAddOutlined, // Dùng cho Order
  BranchesOutlined, // Dùng cho Category
  UsergroupAddOutlined,
  LogoutOutlined,
  CommentOutlined,
  AppleOutlined, // Dùng cho User
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const LayoutAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // ✅ Hook điều hướng

  const handlelogout = () => {
    console.log("logout");
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      icon: <DashboardOutlined />, // Thay bằng icon Dashboard
      label: "Dashboard",
      onClick: () => navigate("/admin"),
    },
    {
      key: "2",
      icon: <InboxOutlined />,
      label: "Product",
      onClick: () => navigate("/admin/product/list"),
    },
    {
      key: "3",
      icon: <AppstoreAddOutlined />,
      label: "Order",
      onClick: () => navigate("/admin/order"),
    },
    {
      key: "4",
      icon: <BranchesOutlined />,
      label: "Category",
      onClick: () => navigate("/admin/category"),
    },
    {
      key: "sub1",
      icon: <UsergroupAddOutlined />,
      label: "User",
      children: [
        {
          key: "5",
          label: "Admin",
          onClick: () => navigate("/admin/user/listAdmin"),
        },
        {
          key: "6",
          label: "User",
          onClick: () => navigate("/admin/user/listUser"),
        },
      ],
    },
    {
      key: "7",
      icon: <CommentOutlined />,
      label: "Comment",
      onClick: () => navigate("/admin/comment"),
    },
    {
      key: "8",
      icon: <CommentOutlined />,
      label: "Contact",
      onClick: () => navigate("/admin/contact"),
    },
    {
      key: "9",
      icon: <AppleOutlined />,
      label: "Voucher",
      onClick: () => navigate("/admin/voucher"),
    },
    {
      key: "10",
      icon: <LogoutOutlined />, // Thay bằng icon phù hợp cho Logout
      label: "Logout",
      onClick: () => handlelogout(),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 64,
            textAlign: "center",
            lineHeight: "64px",
            color: "white",
            fontSize: 20,
          }}
        >
          Admin Panel
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>

      {/* Layout chính */}
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fff",
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Admin
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: 8,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
