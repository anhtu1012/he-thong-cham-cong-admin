/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import QlNguoiDungServices from "@/services/admin/quan-li-nguoi-dung/quan-li-nguoi-dung.service";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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



function Dashboard() {
  const t = useTranslations("Dashboard");

  const leaveColumns = [
    {
      title: t("nhanVien"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("loaiNghi"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("ngayBatDau"),
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: t("ngayKetThuc"),
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: t("trangThai"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = {
          [t("trangThaiChoDuyet")]: "warning",
          [t("trangThaiDaDuyet")]: "success",
          [t("trangThaiTuChoi")]: "error",
        };
        return (
          <Tag color={colors[status]} style={{ borderRadius: 20 }}>
            {status}
          </Tag>
        );
      },
    },
  ];
  const [totalManagingEmployees, setTotalManagingEmployees] = useState(0);
  const auth = useSelector(selectAuthLogin);
  useEffect(() => {
    const fetchManagingEmployee = async () => {
      const searchOwnweFilter: any = [
        { key: "limit", type: "=", value: 10 },
        { key: "offset", type: "=", value: (10 - 1) * 10 },
      ];

      try {
        const res = await QlNguoiDungServices.getUserByManagement(
          searchOwnweFilter,
          {
            userCode: auth.userProfile.code,
          }
        );
        setTotalManagingEmployees(res?.count);
        console.log({
          res,
        });
      } catch (error) {
        console.log({
          error
        });
        
      }
    };
    fetchManagingEmployee();
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        {t("title")}
      </Title>

      {/* Overview Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("tongNhanVien")}
              value={totalManagingEmployees}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("diLamHomNay")}
              value={attendanceStats.presentToday}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("diMuonHomNay")}
              value={attendanceStats.lateToday}
              prefix={<WarningOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("vangMatHomNay")}
              value={attendanceStats.absentToday}
              prefix={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Leave Requests */}
        <Col xs={24} lg={24}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>{t("donNghiPhepGanDay")}</span>
              </Space>
            }
            extra={<a href="/manager/quan-li-don">{t("xemTatCa")}</a>}
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
        {/* <Col xs={24} lg={12}>
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
        </Col> */}
      </Row>

   

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Quick Actions */}
        <Col xs={24}>
          <Card title={t("truyCapNhanh")}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Card
                  hoverable
                  onClick={() =>
                    (window.location.href = "/manager/quan-li-cham-cong")
                  }
                >
                  <Space>
                    <ClockCircleOutlined style={{ fontSize: 24 }} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {t("quanLyChamCong")}
                      </Title>
                      <Text type="secondary">{t("quanLyChamCongDesc")}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  hoverable
                  onClick={() =>
                    (window.location.href = "/manager/quan-li-nhan-vien")
                  }
                >
                  <Space>
                    <TeamOutlined style={{ fontSize: 24 }} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {t("quanLyNhanVien")}
                      </Title>
                      <Text type="secondary">{t("quanLyNhanVienDesc")}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  hoverable
                  onClick={() =>
                    (window.location.href = "/manager/duyet-nghi-phep")
                  }
                >
                  <Space>
                    <CalendarOutlined style={{ fontSize: 24 }} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {t("duyetNghiPhep")}
                      </Title>
                      <Text type="secondary">{t("duyetNghiPhepDesc")}</Text>
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
