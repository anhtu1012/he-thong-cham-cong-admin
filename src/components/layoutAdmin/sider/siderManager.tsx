"use client";

import {
  BellOutlined,

  ClockCircleOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../../layoutAdmin/index.scss";

const { Sider } = Layout;

interface SiderProps {
  collapsed: boolean;
}

const SiderManagerComponent: React.FC<SiderProps> = ({ collapsed }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Get current selected menu item based on path
  useEffect(() => {
    if (pathname) {
      // For the home page
      if (pathname === "/manager") {
        setSelectedKeys(["/manager"]);
      }
      // For specific manager pages, match with the second path segment
      else if (pathname.startsWith("/manager/")) {
        const pathSegments = pathname.split("/");
        if (pathSegments.length >= 3) {
          setSelectedKeys([`/manager/${pathSegments[2]}`]);
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

  const menuItems = [
    {
      key: "/manager",
      icon: <DashboardOutlined />,
      label: "Trang chủ",
      "data-index": 0,
    },
    {
      key: "/manager/quan-li-nhan-vien",
      icon: <UserOutlined />,
      label: "Quản lý nhân viên",
      "data-index": 1,
    },
    {
      key: "/manager/quan-li-cham-cong",
      icon: <ClockCircleOutlined />,
      label: "Chấm công nhân viên",
      "data-index": 2,
    },
    {
      key: "/manager/quan-li-don",
      icon: <FileTextOutlined />,
      label: "Quản lí đơn",
      "data-index": 3,
    },
    {
      key: "/manager/lich-lam-viec",
      icon: <ScheduleOutlined />,
      label: "Lịch làm việc",
      "data-index": 4,
    },
    {
      key: "/manager/thong-bao",
      icon: <BellOutlined />,
      label: "Thông báo",
      "data-index": 5,
    },
    {
      key: "/manager/bao-cao",
      icon: <FileTextOutlined />,
      label: "Báo cáo",
      "data-index": 6,
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
        top: 64,
        bottom: 0,
      }}
    >
      <div className="sidebar-menu-container">
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={({ key }) => router.push(key)}
          className="sidebar-menu"
          items={menuItems.map((item) => ({
            ...item,
            style: {
              "--item-index": item["data-index"],
            } as React.CSSProperties,
          }))}
        />

        {/* Footer chỉ hiển thị khi không thu gọn */}
        {!collapsed && (
          <>
            <div className="menu-divider" />
            <div className="sidebar-footer">
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

export default SiderManagerComponent;
