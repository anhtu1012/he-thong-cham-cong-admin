"use client";

import React from "react";
import { Typography, Row, Col, Card, Statistic, Avatar, List } from "antd";
import {
  UserOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
  BranchesOutlined,
} from "@ant-design/icons";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./index.scss";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle, Text } = Typography;

function Page() {
  const userData = {
    name: "Minh Le",
    role: "Quản Trị Viên",
  };

  const stats = {
    totalUsers: 124,
    pendingRequests: 8,
    activeShifts: 35,
    branchCount: 4,
  };

  // Sample data for charts
  const attendanceData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        label: "Đúng giờ",
        data: [65, 72, 68, 75, 82, 78],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Đi trễ",
        data: [25, 18, 22, 15, 12, 16],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const branchDistributionData = {
    labels: [
      "Trụ sở chính",
      "Chi nhánh Bắc",
      "Chi nhánh Nam",
      "Chi nhánh Đông",
    ],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const recentActivities = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      action: "đã gửi yêu cầu nghỉ phép",
      timestamp: "Hôm nay lúc 10:23",
    },
    {
      id: 2,
      user: "Trần Thị B",
      action: "đã duyệt đổi ca làm",
      timestamp: "Hôm nay lúc 9:15",
    },
    {
      id: 3,
      user: "Lê Văn C",
      action: "đã tạo ca làm mới",
      timestamp: "Hôm qua lúc 16:30",
    },
    {
      id: 4,
      user: "Phạm Thị D",
      action: "đã chỉnh sửa cài đặt chi nhánh",
      timestamp: "Hôm qua lúc 14:45",
    },
    {
      id: 5,
      user: "Hoàng Văn E",
      action: "đã đăng ký nhân viên mới",
      timestamp: "10/07/2023 lúc 11:20",
    },
  ];

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <>
      {/* Greeting */}
      <div className="dashboard-greeting">
        <AntTitle level={2}>
          Xin chào, {userData.name} !{" "}
          <Text type="secondary">Vai trò: {userData.role}</Text>
        </AntTitle>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="stat-cards">
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title="Tổng số người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title="Yêu cầu đang chờ"
              value={stats.pendingRequests}
              prefix={<FileDoneOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title="Ca làm đang hoạt động"
              value={stats.activeShifts}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title="Số chi nhánh"
              value={stats.branchCount}
              prefix={<BranchesOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 24]} className="chart-section">
        <Col xs={24} lg={12}>
          <Card
            title="Chấm công đúng giờ vs Đi trễ (theo tháng)"
            bordered={false}
            className="chart-card"
          >
            <div style={{ height: "300px" }}>
              <Bar data={attendanceData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <Card
            title="Phân bố nhân viên theo chi nhánh"
            bordered={false}
            className="chart-card"
          >
            <div style={{ height: "300px" }}>
              <Pie data={branchDistributionData} options={chartOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row className="recent-activities">
        <Col span={24}>
          <Card title="Hoạt động gần đây" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<a href="#">{item.user}</a>}
                    description={`${item.action} - ${item.timestamp}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Page;
