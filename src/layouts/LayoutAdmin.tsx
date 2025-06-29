import React, { useState } from "react";
import {
  DashboardOutlined,
  InboxOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
  CommentOutlined,
  TrademarkOutlined,
  ContactsOutlined,
  GiftOutlined,
  TagsOutlined,
  ShoppingOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const LayoutAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // ✅ Hook điều hướng

  const handlelogout = () => {
    console.log("logout");
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Thống Kê",
      onClick: () => navigate("/admin"),
    },
    {
      key: "2",
      icon: <InboxOutlined />,
      label: "Sản Phẩm",
      onClick: () => navigate("/admin/product"),
    },
    {
      key: "3",
      icon: <ShoppingOutlined/>,
      label: "Đơn Hàng",
      onClick: () => navigate("/admin/order"),
    },
    {
      key: "4",
      icon: <TrademarkOutlined />,
      label: "Thương Hiệu",
      onClick: () => navigate("/admin/brand"),
    },
    {
      key: "5",
      icon: <TagsOutlined />,
      label: "Danh Mục Sản Phẩm",
      onClick: () => navigate("/admin/category"),
    },
    {
      key: "sub1",
      icon: <UsergroupAddOutlined />,
      label: "Tài Khoản",
      children: [
        {
          key: "6",
          label: "Admin",
          onClick: () => navigate("/admin/user/listAdmin"),
        },
        {
          key: "7",
          label: "User",
          onClick: () => navigate("/admin/user/listUser"),
        },
      ],
    },
    {
      key: "8",
      icon: <CommentOutlined />,
      label: "Bình Luận",
      onClick: () => navigate("/admin/comment"),
    },
    {
      key: "9",
      icon: <ContactsOutlined  />,
      label: "Liên Hệ",
      onClick: () => navigate("/admin/contact"),
    },
    {
      key: "10",
      icon: <GiftOutlined />,
      label: "Khuyến Mãi",
      onClick: () => navigate("/admin/promotion"),
    },  
    {
      key: "11",
      icon: <GiftOutlined />,
      label: "Danh Mục Bài Viết",
      onClick: () => navigate("/admin/blog-category"),
    },  
    {
      key: "12",
      icon: <RocketOutlined />,
      label: "Nguồn Gốc",
      onClick: () => navigate("/admin/origin"),
    },  
    
    
    {
      key: "13",
      icon: <LogoutOutlined />, // Thay bằng icon phù hợp cho Logout
      label: "Đăng Xuất",
      onClick: () => handlelogout(),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        color="inherit"
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 64,
            textAlign: "center",
            lineHeight: "64px",
            color: "black",
            fontSize: 20,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          Admin Panel
        </div>
        <Menu
          theme="light"
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
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[{ title: "Admin" }, { title: "" }]}
          />
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
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
