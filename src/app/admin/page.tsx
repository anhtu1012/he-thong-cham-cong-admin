"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Avatar,
  List,
  Select,
  Divider,
  Progress,
  Table,
  Spin,
  Skeleton,
} from "antd";
import {
  UserOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
  BranchesOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Bar, Pie, Line } from "react-chartjs-2";
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
import RepositoryPortServices from "@/services/admin/report/report.service";

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
const { Option } = Select;

function Page() {
  const [selectedMonth, setSelectedMonth] = useState("7/25");
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const userData = {
    name: "Admin",
    role: "Quản Trị Viên",
  };

  // Your reports data
  interface ReportData {
    totalEmployees: number;
    totalSalaryExpense: number;
    attendanceRate: number;
    growthRate: number;
    lateTimeRate: number;
    activeEmployees: number;
    averageAttendanceRate: number;
  }

  interface Report {
    month: string;
    data: ReportData;
  }

  const [reports, setReports] = useState<Report[]>([]);
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await RepositoryPortServices.getReport();
      setReports(res.reports);
      // Set the first month from the data as selected if available
      if (res.reports && res.reports.length > 0) {
        setSelectedMonth(res.reports[0].month);
      }
    } catch (error) {
      console.log("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const currentReport =
    reports.find((r) => r.month === selectedMonth) || reports[0];

  // Show loading spinner for initial page load or when no data
  if (loading || !currentReport) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Đang tải dữ liệu báo cáo...</Text>
        </div>
      </div>
    );
  }

  // Handle month change with loading
  const handleMonthChange = async (month: string) => {
    setChartLoading(true);
    setTableLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSelectedMonth(month);
    setChartLoading(false);
    setTableLoading(false);
  };

  const stats = {
    totalUsers: currentReport?.data?.totalEmployees,
    pendingRequests: 8,
    activeShifts: 35,
    branchCount: 4,
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Chart data for monthly trends
  const monthlyTrendData = {
    labels: reports.map((r) => `Tháng ${r.month}`),
    datasets: [
      {
        label: "Tỷ lệ chấm công (%)",
        data: reports.map((r) => r.data?.attendanceRate || 0),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
      {
        label: "Tỷ lệ đi trễ (%)",
        data: reports.map((r) => r.data?.lateTimeRate || 0),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Salary expense chart
  const salaryExpenseData = {
    labels: reports.map((r) => `Tháng ${r.month}`),
    datasets: [
      {
        label: "Chi phí lương (VND)",
        data: reports.map((r) => r.data?.totalSalaryExpense || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Sample data for other charts (keeping existing functionality)
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

  // Table columns for detailed report
  const columns = [
    {
      title: "Tháng",
      dataIndex: "month",
      key: "month",
      render: (month: string) => `Tháng ${month}`,
    },
    {
      title: "Tổng NV",
      dataIndex: ["data", "totalEmployees"],
      key: "totalEmployees",
    },
    {
      title: "Chi phí lương",
      dataIndex: ["data", "totalSalaryExpense"],
      key: "totalSalaryExpense",
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: "Tỷ lệ chấm công",
      dataIndex: ["data", "attendanceRate"],
      key: "attendanceRate",
      render: (rate: number) => `${rate}%`,
    },
    {
      title: "Tỷ lệ tăng trưởng",
      dataIndex: ["data", "growthRate"],
      key: "growthRate",
      render: (rate: number) => (
        <span style={{ color: rate >= 0 ? "#52c41a" : "#ff4d4f" }}>
          {rate >= 0 ? <RiseOutlined /> : <FallOutlined />} {rate}%
        </span>
      ),
    },
    {
      title: "Tỷ lệ đi trễ",
      dataIndex: ["data", "lateTimeRate"],
      key: "lateTimeRate",
      render: (rate: number) => `${rate}%`,
    },
    {
      title: "NV hoạt động",
      dataIndex: ["data", "activeEmployees"],
      key: "activeEmployees",
    },
  ];



  return (
    <>
      {/* Greeting */}
      <div className="dashboard-greeting">
        <AntTitle level={2}>
          Xin chào, {userData.name} !{" "}
          <Text type="secondary">Vai trò: {userData.role}</Text>
        </AntTitle>
      </div>

      {/* Month Selection */}
      <Row className="month-selector" style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card bordered={false}>
            <Row align="middle">
              <Col>
                <CalendarOutlined style={{ marginRight: 8, fontSize: 18 }} />
                <Text strong>Chọn tháng báo cáo: </Text>
              </Col>
              <Col style={{ marginLeft: 16 }}>
                <Select
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  style={{ width: 200 }}
                  size="large"
                  loading={chartLoading || tableLoading}
                >
                  {reports.map((report) => (
                    <Option key={report.month} value={report.month}>
                      Tháng {report.month}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Monthly Report Cards */}
      <AntTitle level={3}>Báo cáo tháng {selectedMonth}</AntTitle>
      <Row
        gutter={[16, 16]}
        className="stat-cards"
        style={{ marginBottom: 24 }}
      >
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card">
            {chartLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
                             <Statistic
                 title="Tổng số nhân viên"
                 value={currentReport.data?.totalEmployees || 0}
                 prefix={<TeamOutlined />}
                 valueStyle={{ color: "#3f8600" }}
               />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card">
            {chartLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
                             <Statistic
                 title="Chi phí lương"
                 value={currentReport.data?.totalSalaryExpense || 0}
                 prefix={<DollarOutlined />}
                 valueStyle={{ color: "#1890ff" }}
                 formatter={(value) => formatCurrency(Number(value))}
               />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card">
            {chartLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
                             <Statistic
                 title="Nhân viên hoạt động"
                 value={currentReport.data?.activeEmployees || 0}
                 prefix={<UserOutlined />}
                 valueStyle={{ color: "#722ed1" }}
               />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card">
            {chartLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
                             <Statistic
                 title="Tỷ lệ tăng trưởng"
                 value={currentReport.data?.growthRate || 0}
                 suffix="%"
                 prefix={
                   (currentReport.data?.growthRate || 0) >= 0 ? (
                     <RiseOutlined />
                   ) : (
                     <FallOutlined />
                   )
                 }
                 valueStyle={{
                   color:
                     (currentReport.data?.growthRate || 0) >= 0 ? "#3f8600" : "#cf1322",
                 }}
               />
            )}
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Tỷ lệ chấm công" bordered={false}>
            {chartLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                                 <Progress
                   type="circle"
                   percent={currentReport.data?.attendanceRate || 0}
                   format={(percent) => `${percent}%`}
                   strokeColor={{
                     "0%": "#108ee9",
                     "100%": "#87d068",
                   }}
                 />
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <Text type="secondary">Tỷ lệ chấm công trong tháng</Text>
                </div>
              </>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Tỷ lệ đi trễ" bordered={false}>
            {chartLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                                 <Progress
                   type="circle"
                   percent={Math.round(currentReport.data?.lateTimeRate || 0)}
                   format={() => `${currentReport.data?.lateTimeRate || 0}%`}
                   strokeColor={{
                     "0%": "#87d068",
                     "100%": "#ff4d4f",
                   }}
                 />
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <Text type="secondary">Tỷ lệ nhân viên đi trễ</Text>
                </div>
              </>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Chấm công trung bình" bordered={false}>
            {chartLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                                 <Progress
                   type="circle"
                   percent={currentReport.data?.averageAttendanceRate || 0}
                   format={(percent) => `${percent}%`}
                   strokeColor={{
                     "0%": "#ffa940",
                     "100%": "#36cfc9",
                   }}
                 />
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <Text type="secondary">Tỷ lệ chấm công trung bình</Text>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">
        <AntTitle level={3}>Biểu đồ báo cáo</AntTitle>
      </Divider>

      {/* Report Charts */}
      <Row gutter={[16, 24]} className="chart-section">
        <Col xs={24} lg={12}>
          <Card
            title="Xu hướng chấm công theo tháng"
            bordered={false}
            className="chart-card"
          >
            <div style={{ height: "300px" }}>
              {chartLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Line data={monthlyTrendData} options={chartOptions} />
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Chi phí lương theo tháng"
            bordered={false}
            className="chart-card"
          >
            <div style={{ height: "300px" }}>
              {chartLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Bar data={salaryExpenseData} options={chartOptions} />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Detailed Report Table */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Bảng báo cáo chi tiết" bordered={false}>
            <Table
              columns={columns}
              dataSource={reports}
              rowKey="month"
              pagination={false}
              scroll={{ x: true }}
              loading={tableLoading}
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left" style={{ marginTop: 32 }}>
        <AntTitle level={3}>Tổng quan hệ thống</AntTitle>
      </Divider>

      {/* Original Summary Cards */}
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
