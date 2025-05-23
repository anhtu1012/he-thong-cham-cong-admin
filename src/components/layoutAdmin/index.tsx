"use client";

import { initializeTheme } from "@/utils/theme-utils";
import { Breadcrumb, Layout } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ClientOnly from "../ClientOnly";
import HeaderComponent from "./header";
import "./index.scss";
import SiderAdminComponent from "./sider/siderAdmin";
import SiderHrComponent from "./sider/siderHR";
import SiderManagerComponent from "./sider/siderManager";

const { Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  breadcrumbItems?: { title: string; href?: string }[];
  title?: string;
  subtitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  breadcrumbItems,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<"admin" | "hr" | "manager">("admin");

  // Determine user role based on the URL path
  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      setUserRole("admin");
    } else if (pathname?.startsWith("/hr")) {
      setUserRole("hr");
    } else if (pathname?.startsWith("/manager")) {
      setUserRole("manager");
    }
  }, [pathname]);

  // Generate default breadcrumb items based on the current path if not provided
  const generateDefaultBreadcrumbs = () => {
    if (breadcrumbItems) return breadcrumbItems;

    const paths = pathname?.split("/").filter(Boolean) || [];
    return [
      ...paths.map((path, index) => {
        const href = "/" + paths.slice(0, index + 1).join("/");
        const pathTitle =
          path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
        return {
          title: pathTitle.replace(/(quan-li|quản-lý)/i, "Quản lý"),
          href,
        };
      }),
    ];
  };

  const items = generateDefaultBreadcrumbs();

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    initializeTheme();

    // Check if window width is small enough to collapse sidebar by default
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    // Run once and then listen for changes
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Render the appropriate sidebar based on user role
  const renderSidebar = () => {
    switch (userRole) {
      case "admin":
        return <SiderAdminComponent collapsed={collapsed} />;
      case "hr":
        return <SiderHrComponent collapsed={collapsed} />;
      case "manager":
        return <SiderManagerComponent collapsed={collapsed} />;
      default:
        return <SiderAdminComponent collapsed={collapsed} />;
    }
  };

  // Render the layout with a stable structure for both server and client
  return (
    <Layout style={{ minHeight: "95vh" }}>
      <ClientOnly>
        <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed} />
      </ClientOnly>

      <Layout>
        <ClientOnly>{renderSidebar()}</ClientOnly>

        <Layout
          style={{
            marginLeft: collapsed ? 80 : 240,
            marginTop: 54,
            transition: "margin 0.2s",
          }}
        >
          <Content className="admin-content-wrapper">
            {/* Breadcrumb navigation */}
            <div className="">
              <Breadcrumb
                className=""
                items={items.map((item) => ({
                  title: item.href ? (
                    <Link href={item.href}>{item.title}</Link>
                  ) : (
                    item.title
                  ),
                }))}
              />

              {/* {(title || subtitle) && (
                <div className="page-title-section">
                  {title && <h1 className="page-title">{title}</h1>}
                  {subtitle && <p className="page-subtitle">{subtitle}</p>}
                </div>
              )} */}
            </div>

            <div className="content-container">{children}</div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
