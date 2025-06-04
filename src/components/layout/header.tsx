"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Dropdown, Space } from "antd";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import "./index.scss";

const { Header } = Layout;

interface HeaderProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const HeaderComponent: React.FC<HeaderProps> = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const productItems = [
    { key: "attendance", label: <Link href="/attendance">Chấm Công</Link> },
    {
      key: "time-tracking",
      label: <Link href="/time-tracking">Theo Dõi Thời Gian</Link>,
    },
    {
      key: "face-recognition",
      label: <Link href="/face-recognition">Nhận Diện Khuôn Mặt</Link>,
    },
    { key: "timesheet", label: <Link href="/timesheet">Bảng Chấm Công</Link> },
  ];

  const solutionsItems = [
    { key: "education", label: <Link href="/education">Giáo Dục</Link> },
    { key: "construction", label: <Link href="/construction">Xây Dựng</Link> },
    { key: "healthcare", label: <Link href="/healthcare">Y Tế</Link> },
    { key: "enterprise", label: <Link href="/enterprise">Doanh Nghiệp</Link> },
  ];

  const languageItems = [
    { key: "vi", label: "Tiếng Việt" },
    { key: "en", label: "English" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <Header className={`site-header ${isScrolled ? "sticky" : ""}`}>
      <div className="header-container">
        <div className="logo-container">
          <Link href="/" className="logo">
            <span className="logo-text">HỆ THỐNG CHẤM CÔNG</span>
          </Link>
        </div>

        <div className="desktop-menu">
          <Dropdown menu={{ items: productItems }} placement="bottomLeft">
            <span className="nav-dropdown-link">
              <Space>
                Sản Phẩm
                <DownOutlined />
              </Space>
            </span>
          </Dropdown>

          <Dropdown menu={{ items: solutionsItems }} placement="bottomLeft">
            <span className="nav-dropdown-link">
              <Space>
                Giải Pháp
                <DownOutlined />
              </Space>
            </span>
          </Dropdown>

          <Link href="/integrations" className="nav-link">
            Tích Hợp
          </Link>

          <Link href="/resources" className="nav-link">
            Tài Nguyên
          </Link>
        </div>

        <div className="header-actions">
          <Dropdown menu={{ items: languageItems }} placement="bottomRight">
            <Button type="text" className="language-button">
              <span>VI | EN</span>
            </Button>
          </Dropdown>

          <Link href="/login">
            <Button type="text" className="login-button">
              Đăng Nhập
            </Button>
          </Link>

          <Button
            type="text"
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
          >
            <MenuOutlined />
          </Button>
        </div>
      </div>

      {mobileMenuVisible && (
        <div className="mobile-menu">
          <Menu mode="vertical">
            <Menu.SubMenu key="product" title="Sản Phẩm">
              {productItems.map((item) => (
                <Menu.Item key={item.key}>{item.label}</Menu.Item>
              ))}
            </Menu.SubMenu>
            <Menu.SubMenu key="solutions" title="Giải Pháp">
              {solutionsItems.map((item) => (
                <Menu.Item key={item.key}>{item.label}</Menu.Item>
              ))}
            </Menu.SubMenu>
            <Menu.Item key="integrations">
              <Link href="/integrations">Tích Hợp</Link>
            </Menu.Item>
            <Menu.Item key="resources">
              <Link href="/resources">Tài Nguyên</Link>
            </Menu.Item>
            <Menu.Item key="login">
              <Link href="/login">Đăng Nhập</Link>
            </Menu.Item>
          </Menu>
        </div>
      )}
    </Header>
  );
};

export default HeaderComponent;
