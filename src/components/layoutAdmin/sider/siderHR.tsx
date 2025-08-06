"use client";

import {
  BellOutlined,
  FileTextOutlined,
  HomeOutlined,
  ScheduleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../../layoutAdmin/index.scss";

const { Sider } = Layout;

interface SiderProps {
  collapsed: boolean; 
}

const SiderHrComponent: React.FC<SiderProps> = ({ collapsed }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Get current selected menu item based on path
  useEffect(() => {
    if (pathname) {
      // For the home page
      if (pathname === "/hr") {
        setSelectedKeys(["/hr"]);
      }
      // For specific HR pages, match with the second path segment
      else if (pathname.startsWith("/hr/")) {
        const pathSegments = pathname.split("/");
        if (pathSegments.length >= 3) {
          setSelectedKeys([`/hr/${pathSegments[2]}`]);
        }
      }
    }
    setMounted(true);
  }, [pathname]);

  // Prevent hydration mismatch by returning minimal sidebar
  if (!mounted) {
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={true}
        width={240}
        className="sidebar-layout"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 64,
          bottom: 0,
        }}
      />
    );
  }

  // Menu items for HR
  const mainMenuItems = [
    {
      key: "/hr",
      icon: <HomeOutlined />,
      label: "Trang chủ",
      "data-index": 0,
    },
    {
      key: "/hr/quan-ly-nhan-vien",
      icon: <TeamOutlined />,
      label: "Quản lý nhân viên",
      "data-index": 1,
    },
    {
      key: "/hr/quan-ly-don",
      icon: <FileTextOutlined />,
      label: "Quản lý đơn",
      "data-index": 2,
    },
    // {
    //   key: "/hr/duyet-nghi-phep",
    //   icon: <CheckCircleOutlined />,
    //   label: "Xử lý đơn",
    //   "data-index": 3,
    // },
    {
      key: "/hr/lich-lam-viec",
      icon: <ScheduleOutlined />,
      label: "Lịch làm việc",
      "data-index": 4,
    },
  ];

  // Tools menu items
  const toolsMenuItems = [
    {
      key: "/hr/thong-bao",
      icon: <BellOutlined />,
      label: "Thông báo",
      "data-index": 0,
    },
    {
      key: "/hr/bao-cao",
      icon: <FileTextOutlined />,
      label: "Báo cáo",
      "data-index": 1,
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      className="sidebar-layout"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 64, // Height of the header
        bottom: 0,
      }}
    >
      <div className="sidebar-menu-container">
        {/* New Post Button */}
        {/* {!collapsed && (
          <button
            className="sidebar-new-post-btn"
            onClick={() => router.push("/hr/tao-moi")}
          >
            + Tạo thông báo mới
          </button>
        )} */}

        {/* Main Menu */}
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={({ key }) => router.push(key)}
          className="sidebar-menu"
          items={mainMenuItems.map((item) => ({
            ...item,
            style: {
              "--item-index": item["data-index"],
            } as React.CSSProperties,
          }))}
        />

        {/* Tools Section */}
        {!collapsed && (
          <>
            <div className="menu-divider" />
            <div className="sidebar-section-title">Công cụ</div>
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={selectedKeys}
              className="sidebar-menu"
              items={toolsMenuItems.map((item) => ({
                ...item,
                style: {
                  "--item-index": item["data-index"],
                } as React.CSSProperties,
              }))}
              onClick={({ key }) => router.push(key)}
            />
          </>
        )}

        {/* Footer */}
        {!collapsed && (
          <>
            <div className="menu-divider" />
            <div className="sidebar-footer">
              <div className="footer-link">Trợ giúp</div>
              <div className="footer-link">Hỗ trợ</div>
              <div className="footer-link">Liên hệ</div>
              <div className="footer-link">Điều khoản</div>
              <div className="footer-copyright">© 2024 Hệ thống chấm công</div>
            </div>
          </>
        )}
      </div>
    </Sider>
  );
};

export default SiderHrComponent;
