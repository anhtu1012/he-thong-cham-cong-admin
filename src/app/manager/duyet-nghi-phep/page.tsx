/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Ctable from "@/components/basicUI/Ctable";
import { formatDayDDMMYYYY } from "@/utils/client/dayFormatter";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// Mock data for demonstration
const mockData = [
  {
    key: "1",
    maDon: "DON001",
    nguoiNop: "Nguyễn Văn A",
    userName: "nguyenvana",
    maBieuMau: "NP001",
    lyDo: "Nghỉ phép năm",
    thoiGianBatDau: "2024-06-01",
    thoiGianKetThuc: "2024-06-03",
    trangThai: "Chờ duyệt",
    tapTin: "don-nghi-phep.pdf",
    thoiGianDuyet: null,
    nguoiDuyet: null,
  },
  {
    key: "2",
    maDon: "DON002",
    nguoiNop: "Trần Thị B",
    userName: "tranthib",
    maBieuMau: "NP001",
    lyDo: "Nghỉ ốm",
    thoiGianBatDau: "2024-06-05",
    thoiGianKetThuc: "2024-06-06",
    trangThai: "Đã duyệt",
    tapTin: "giay-kham-benh.pdf",
    thoiGianDuyet: "2024-06-04",
    nguoiDuyet: "Manager A",
  },
];

const statusColors: { [key: string]: string } = {
  "Chờ duyệt": "warning",
  "Đã duyệt": "success",
  "Từ chối": "error",
};

function DuyetNghiPhep() {
  const t = useTranslations("DuyetNghiPhep");
  const [loading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [dateRange, setDateRange] = useState<any>(null);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  console.log(currentPage, pageSize);
  
  const [totalItems] = useState(mockData.length);


  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [approveModalOpen, setApproveModalOpen] = useState<boolean>(false);
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);

  // Filter data based on search and filters
  const filteredData = mockData.filter((item) => {
    const matchName = item.nguoiNop.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status ? item.trangThai === status : true;
    const matchDate = dateRange
      ? dayjs(item.thoiGianBatDau).isBetween(dateRange[0], dateRange[1], null, "[]")
      : true;
    return matchName && matchStatus && matchDate;
  });

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleApprove = () => {
    toast.success(t("daDuyetThanhCong"));
    setApproveModalOpen(false);
  };

  const handleReject = () => {
    toast.success(t("daTuChoiThanhCong"));
    setRejectModalOpen(false);
  };
  const handleBeforeExport = async () => {
    return []
  }
  const columns = [
    {
      title: t("maDon"),
      dataIndex: "maDon",
      key: "maDon",
      width: 120,
    },
    {
      title: t("nguoiNop"),
      dataIndex: "nguoiNop",
      key: "nguoiNop",
      width: 150,
    },
    {
      title: t("userName"),
      dataIndex: "userName",
      key: "userName",
      width: 120,
    },
    {
      title: t("ngayNop"),
      dataIndex: "thoiGianBatDau",
      key: "thoiGianBatDau",
      width: 120,
      render: (text: string) => formatDayDDMMYYYY(text),
    },
    {
      title: t("ngayDuyet"),
      dataIndex: "thoiGianDuyet",
      key: "thoiGianDuyet",
      width: 120,
      render: (text: string) => (text ? formatDayDDMMYYYY(text) : "-"),
    },
    {
      title: t("nguoiDuyet"),
      dataIndex: "nguoiDuyet",
      key: "nguoiDuyet",
      width: 120,
      render: (text: string) => text || "-",
    },
    {
      title: t("trangThai"),
      dataIndex: "trangThai",
      key: "trangThai",
      width: 120,
      render: (status: string) => (
        <Tag
          color={statusColors[status] || "default"}
          style={{
            borderRadius: 20,
            padding: "4px 12px",
            fontWeight: 600,
            fontSize: 12,
          }}
        >
          {status}
        </Tag>
      ),
    },
  ];

  const actionColumn = (): any => ({
    render: (record: any) => (
      <Space>
        <Tooltip title={t("xemChiTiet")}>
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              setViewModalOpen(true);
            }}
          />
        </Tooltip>
      </Space>
    ),
  });

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>
        Duyệt nghỉ phép
      </h2>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder={t("timKiem")}
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 220 }}
        />
        <RangePicker
          format="DD/MM/YYYY"
          value={dateRange}
          onChange={setDateRange}
          style={{ width: 260 }}
        />
        <Select
          allowClear
          placeholder={t("chonTrangThai")}
          style={{ width: 150 }}
          value={status}
          onChange={setStatus}
          options={[
            { value: "Chờ duyệt", label: t("trangThaiChoDuyet") },
            { value: "Đã duyệt", label: t("trangThaiDaDuyet") },
            { value: "Từ chối", label: t("trangThaiTuChoi") },
          ]}
        />
      </Space>

      <Ctable
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        usePagination
        totalItems={totalItems}
        onPageChange={handlePageChange}
        enableDrag={true}
        pageSize={10}
        rowHeight={15}
        showActions
        actionColumn={actionColumn()}
        stickyHeader
        tableId="duyet_nghi_phep"
        onBeforeExport={handleBeforeExport}
      />

      {/* View Modal */}
      <Modal
        title={<Title level={4}>{t("thongTinChiTiet")}</Title>}
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={
          selectedRecord?.trangThai === "Chờ duyệt" ? (
            <Space>
              <Button onClick={() => setViewModalOpen(false)}>
                {t("huy")}
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  setViewModalOpen(false);
                  setRejectModalOpen(true);
                }}
              >
                {t("tuChoi")}
              </Button>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  setViewModalOpen(false);
                  setApproveModalOpen(true);
                }}
              >
                {t("duyet")}
              </Button>
            </Space>
          ) : null
        }
        width={600}
        centered
      >
        {selectedRecord && (
          <Card>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              {/* Employee Information */}
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  {t("thongTinNguoiNop")}
                </Title>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong>{t("hoVaTen")}: </Text>
                    <Text>{selectedRecord.nguoiNop}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>{t("tenDangNhap")}: </Text>
                    <Text>{selectedRecord.userName}</Text>
                  </Col>
                </Row>
              </div>

              {/* Leave Request Information */}
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  {t("thongTinDon")}
                </Title>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong>{t("maDon")}: </Text>
                    <Text>{selectedRecord.maDon}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>{t("maBieuMau")}: </Text>
                    <Text>{selectedRecord.maBieuMau}</Text>
                  </Col>
                  <Col span={24}>
                    <Text strong>{t("lyDo")}: </Text>
                    <Text>{selectedRecord.lyDo}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>{t("thoiGianBatDau")}: </Text>
                    <Text>{formatDayDDMMYYYY(selectedRecord.thoiGianBatDau)}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>{t("thoiGianKetThuc")}: </Text>
                    <Text>{formatDayDDMMYYYY(selectedRecord.thoiGianKetThuc)}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>{t("trangThai")}: </Text>
                    <Tag
                      color={statusColors[selectedRecord.trangThai] || "default"}
                      style={{
                        borderRadius: 20,
                        padding: "4px 12px",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {selectedRecord.trangThai}
                    </Tag>
                  </Col>
                  {selectedRecord.thoiGianDuyet && (
                    <Col span={12}>
                      <Text strong>{t("thoiGianDuyet")}: </Text>
                      <Text>{formatDayDDMMYYYY(selectedRecord.thoiGianDuyet)}</Text>
                    </Col>
                  )}
                  {selectedRecord.nguoiDuyet && (
                    <Col span={12}>
                      <Text strong>{t("nguoiDuyet")}: </Text>
                      <Text>{selectedRecord.nguoiDuyet}</Text>
                    </Col>
                  )}
                </Row>
              </div>

              {/* File Attachment */}
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  {t("tapTinDinhKem")}
                </Title>
                <Text>
                  {selectedRecord.tapTin ? (
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      {selectedRecord.tapTin}
                    </a>
                  ) : (
                    t("khongCoTapTin")
                  )}
                </Text>
              </div>
            </Space>
          </Card>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        title={t("xacNhanDuyet")}
        open={approveModalOpen}
        onOk={handleApprove}
        onCancel={() => setApproveModalOpen(false)}
        okText={t("xacNhan")}
        cancelText={t("huy")}
      >
        <p>{t("xacNhanDuyetDon")}</p>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title={t("xacNhanTuChoi")}
        open={rejectModalOpen}
        onOk={handleReject}
        onCancel={() => setRejectModalOpen(false)}
        okText={t("xacNhan")}
        cancelText={t("huy")}
        okButtonProps={{ danger: true }}
      >
        <p>{t("xacNhanTuChoiDon")}</p>
      </Modal>
    </div>
  );
}

export default DuyetNghiPhep;