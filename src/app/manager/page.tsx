"use client";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography
} from "antd";
import { useTranslations } from "next-intl";

const { Title, Text } = Typography;

// Mock data for demonstration
const attendanceStats = {
  totalEmployees: 50,
  presentToday: 45,
  lateToday: 3,
  absentToday: 2,
  onLeaveToday: 2,
};

const leaveRequests = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    type: "Nghỉ phép năm",
    startDate: "2024-06-01",
    endDate: "2024-06-03",
    status: "Chờ duyệt",
  },
  {
    key: "2",
    name: "Trần Thị B",
    type: "Nghỉ ốm",
    startDate: "2024-06-05",
    endDate: "2024-06-06",
    status: "Đã duyệt",
  },
  {
    key: "3",
    name: "Lê Văn C",
    type: "Nghỉ phép năm",
    startDate: "2024-06-10",
    endDate: "2024-06-12",
    status: "Từ chối",
  },
];

const recentActivities = [
  {
    key: "1",
    user: "Nguyễn Văn A",
    action: "Đi muộn",
    time: "08:15",
    date: "2024-06-01",
  },
  {
    key: "2",
    user: "Trần Thị B",
    action: "Nộp đơn nghỉ phép",
    time: "09:30",
    date: "2024-06-01",
  },
  {
    key: "3",
    user: "Lê Văn C",
    action: "Quên chấm công",
    time: "17:45",
    date: "2024-06-01",
  },
];

const departmentStats = [
  {
    name: "Phòng Kỹ thuật",
    total: 20,
    present: 18,
    late: 1,
    absent: 1,
  },
  {
    name: "Phòng Kinh doanh",
    total: 15,
    present: 14,
    late: 1,
    absent: 0,
  },
  {
    name: "Phòng Nhân sự",
    total: 10,
    present: 9,
    late: 1,
    absent: 0,
  },
];

function Dashboard() {
  const t = useTranslations("Dashboard");

  const leaveColumns = [
    {
      title: t('nhanVien'),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t('loaiNghi'),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t('ngayBatDau'),
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: t('ngayKetThuc'),
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: t('trangThai'),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = {
          [t('trangThaiChoDuyet')]: "warning",
          [t('trangThaiDaDuyet')]: "success",
          [t('trangThaiTuChoi')]: "error",
        };
        return (
          <Tag color={colors[status]} style={{ borderRadius: 20 }}>
            {status}
          </Tag>
        );
      },
    },
  ];

  const activityColumns = [
    {
      title: t('nhanVien'),
      dataIndex: "user",
      key: "user",
    },
    {
      title: t('hoatDong'),
      dataIndex: "action",
      key: "action",
    },
    {
      title: t('thoiGian'),
      dataIndex: "time",
      key: "time",
    },
    {
      title: t('ngay'),
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        {t('title')}
      </Title>

      {/* Overview Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('tongNhanVien')}
              value={attendanceStats.totalEmployees}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('diLamHomNay')}
              value={attendanceStats.presentToday}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('diMuonHomNay')}
              value={attendanceStats.lateToday}
              prefix={<WarningOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('vangMatHomNay')}
              value={attendanceStats.absentToday}
              prefix={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Leave Requests */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>{t('donNghiPhepGanDay')}</span>
              </Space>
            }
            extra={<a href="/manager/duyet-nghi-phep">{t('xemTatCa')}</a>}
          >
            <Table
              dataSource={leaveRequests}
              columns={leaveColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>{t('hoatDongGanDay')}</span>
              </Space>
            }
          >
            <Table
              dataSource={recentActivities}
              columns={activityColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Department Statistics */}
        <Col xs={24}>
          <Card
            title={
              <Space>
                <EnvironmentOutlined />
                <span>{t('thongKeTheoPhongBan')}</span>
              </Space>
            }
          >
            <List
              dataSource={departmentStats}
              renderItem={(item) => (
                <List.Item>
                  <Row style={{ width: "100%" }} align="middle">
                    <Col span={6}>
                      <Space>
                        <Avatar icon={<UserOutlined />} />
                        <Text strong>{item.name}</Text>
                      </Space>
                    </Col>
                    <Col span={18}>
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Space>
                          <Text>{t('tongSo')}: {item.total}</Text>
                          <Text type="success">{t('coMat')}: {item.present}</Text>
                          <Text type="warning">{t('diMuon')}: {item.late}</Text>
                          <Text type="danger">{t('vangMat')}: {item.absent}</Text>
                        </Space>
                        <Progress
                          percent={Math.round((item.present / item.total) * 100)}
                          size="small"
                          status={
                            item.present / item.total < 0.8 ? "exception" : "normal"
                          }
                        />
                      </Space>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Quick Actions */}
        <Col xs={24}>
          <Card title={t('truyCapNhanh')}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Card
                  hoverable
                  onClick={() => window.location.href = "/manager/quan-li-cham-cong"}
                >
                  <Space>
                    <ClockCircleOutlined style={{ fontSize: 24 }} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{t('quanLyChamCong')}</Title>
                      <Text type="secondary">{t('quanLyChamCongDesc')}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  hoverable
                  onClick={() => window.location.href = "/manager/quan-li-nhan-vien"}
                >
                  <Space>
                    <TeamOutlined style={{ fontSize: 24 }} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{t('quanLyNhanVien')}</Title>
                      <Text type="secondary">{t('quanLyNhanVienDesc')}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  hoverable
                  onClick={() => window.location.href = "/manager/duyet-nghi-phep"}
                >
                  <Space>
                    <CalendarOutlined style={{ fontSize: 24 }} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{t('duyetNghiPhep')}</Title>
                      <Text type="secondary">{t('duyetNghiPhepDesc')}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
