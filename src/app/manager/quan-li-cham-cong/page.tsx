/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ActionButton from "@/components/basicUI/ActionButton";
import Ctable from "@/components/basicUI/Ctable";
import { formatDayDDMMYYYY } from "@/utils/client/dayFormatter";
import {
  CalendarOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useState } from "react";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const mockData = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    userName: "nguyenvana",
    date: "2024-06-01",
    checkIn: "08:00",
    checkOut: "17:00",
    email: "nguyenvana@gmail.com",
    branchCode: "HN",
    positionCode: "NV",
    status: "Đúng giờ",
    note: "",
  },
  {
    key: "2",
    name: "Trần Thị B",
    userName: "tranthib",
    date: "2024-06-01",
    checkIn: "08:15",
    checkOut: "17:05",
    email: "tranthib@gmail.com",
    branchCode: "HN",
    positionCode: "NV",
    status: "Đi muộn",
    note: "Kẹt xe",
  },
];

const statusColors: { [key: string]: string } = {
  "Đúng giờ": "success",
  "Đi muộn": "warning",
  Vắng: "error",
};

const columns = [
  {
    title: "Họ và tên",
    dataIndex: "name",
    key: "name",
    width: 180,
  },
  {
    title: "Tên đăng nhập",
    dataIndex: "userName",
    key: "userName",
    width: 120,
  },
  {
    title: "Chi nhánh",
    dataIndex: "branchCode",
    key: "branchCode",
    width: 120,
  },
  {
    title: "Chức vụ",
    dataIndex: "positionCode",
    key: "positionCode",
    width: 120,
  },
  {
    title: "Ca làm",
    dataIndex: "shift",
    key: "shift",
    width: 120,
  },
  {
    title: "Ngày",
    dataIndex: "date",
    key: "date",
    width: 120,
    render: (text: string) => formatDayDDMMYYYY(text),
  },
  {
    title: "Giờ vào",
    dataIndex: "checkIn",
    key: "checkIn",
    width: 100,
  },
  {
    title: "Giờ ra",
    dataIndex: "checkOut",
    key: "checkOut",
    width: 100,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
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

function QuanLiChamCong() {
  const [loading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [dateRange, setDateRange] = useState<any>(null);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [_, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems] = useState(mockData.length);

  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Lọc dữ liệu mẫu theo tìm kiếm và bộ lọc
  const filteredData = mockData.filter((item) => {
    const matchName = item.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status ? item.status === status : true;
    const matchDate = dateRange
      ? dayjs(item.date).isBetween(dateRange[0], dateRange[1], null, "[]")
      : true;
    return matchName && matchStatus && matchDate;
  });

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleBeforeExport = async () => {
    return filteredData;
  };
  const actionColumn = (): any => ({
    render: (record: any) => (
      <ActionButton
        record={record}
        onView={() => {
          setSelectedRecord(record);
          setViewModalOpen(true);
        }}
        tooltips={{
          view: "Xem thông tin chi tiết",
          update: "Chỉnh sửa thông tin người dùng",
          delete: "Xóa người dùng",
        }}
      />
    ),
  });

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>
        Quản lý chấm công
      </h2>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Tìm kiếm tên nhân viên"
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
          placeholder="Trạng thái"
          style={{ width: 150 }}
          value={status}
          onChange={setStatus}
          options={[
            { value: "Đúng giờ", label: "Đúng giờ" },
            { value: "Đi muộn", label: "Đi muộn" },
            { value: "Vắng", label: "Vắng" },
          ]}
        />
      </Space>
      <Ctable
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        usePagination
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        enableDrag={true}
        rowHeight={15}
        showActions
        actionColumn={actionColumn()}
        stickyHeader
        tableId="quan-li-cham-cong"
        onBeforeExport={handleBeforeExport}
        bordered
        scroll={{ x: 900 }}
      />

      <Modal
        title={<Title level={4}>Thông tin chi tiết chấm công</Title>}
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={600}
        centered
        style={{ padding: 16 }}
      >
        {selectedRecord && (
          <Card>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              {/* Employee Information */}
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  Thông tin nhân viên
                </Title>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong>Họ và tên: </Text>
                    <Text>{selectedRecord.name}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Tên đăng nhập: </Text>
                    <Text>{selectedRecord.userName}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Email: </Text>
                    <Text>{selectedRecord.email}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Chi nhánh: </Text>
                    <Text>{selectedRecord.branchCode}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Chức vụ: </Text>
                    <Text>{selectedRecord.positionCode}</Text>
                  </Col>
                </Row>
              </div>

              {/* Attendance Information */}
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  Thông tin chấm công
                </Title>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong>Ca làm: </Text>
                    <Text>
                      {selectedRecord.shift || "Ca sáng (08:00 - 17:00)"}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Ngày: </Text>
                    <Text>{formatDayDDMMYYYY(selectedRecord.date)}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Giờ vào: </Text>
                    <Text>{selectedRecord.checkIn}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Giờ ra: </Text>
                    <Text>{selectedRecord.checkOut}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Trạng thái: </Text>
                    <Tag
                      color={statusColors[selectedRecord.status] || "default"}
                      style={{
                        borderRadius: 20,
                        padding: "4px 12px",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {selectedRecord.status}
                    </Tag>
                  </Col>
                </Row>
              </div>

              {/* Notes */}
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  Ghi chú
                </Title>
                <Text>{selectedRecord.note || "Không có ghi chú"}</Text>
              </div>
            </Space>
          </Card>
        )}
      </Modal>
    </div>
  );
}

export default QuanLiChamCong;
