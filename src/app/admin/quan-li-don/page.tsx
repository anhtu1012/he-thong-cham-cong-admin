"use client";

import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import FilterSection from "@/components/basicUI/FilterSection";
import {
  Tag,
  Tooltip,
  Button,
  Space,
  Popconfirm,
  Form,
  Row,
  Col,
  DatePicker,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import "./index.scss";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Cselect from "@/components/Cselect";
import styles from "../../../components/styles/styles.module.scss";

// Sample data interface for QuanLiDon
interface QuanLiDonItem {
  id: string;
  code: string;
  reason: string;
  status: string;
  file: string | null;
  startTime: string;
  endTime: string;
  approvedTime: string | null;
  formCode: string;
  submittedBy: string;
  approvedBy: string;
}

// Format date function
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  return dayjs(dateString).format("HH:mm DD/MM/YYYY");
};

// Map status values to display labels
const getStatusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "Chờ xử lý";
    case "approved":
      return "Đã duyệt";
    case "rejected":
      return "Từ chối";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

// Get status tag color
const getStatusTagColor = (status: string): string => {
  switch (status) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    case "cancelled":
      return "default";
    default:
      return "blue";
  }
};

// Sample form codes data
const formCodesData = [
  { value: "DON001", label: "Đơn xin nghỉ phép" },
  { value: "DON002", label: "Đơn xin tăng ca" },
  { value: "DON003", label: "Đơn xin nghỉ không lương" },
];

// Sample status options
const statusOptions = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
  { value: "cancelled", label: "Đã hủy" },
];

interface FilterValues {
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  formCode?: string;
  status?: string;
}

const QuanLiDonPage = () => {
  const t = useTranslations("QuanLiDon");

  // Sample data
  const sampleData: QuanLiDonItem[] = [
    {
      id: "1",
      code: "DYC001",
      reason: "Nghỉ phép có lương",
      status: "approved",
      file: "don001.pdf",
      startTime: "2025-05-15T08:00:00.000Z",
      endTime: "2026-01-16T17:00:00.000Z",
      approvedTime: "2025-05-25T10:30:00.000Z",
      formCode: "DON001",
      submittedBy: "user1",
      approvedBy: "user3",
    },
    {
      id: "2",
      code: "DYC002",
      reason: "Xin làm thêm giờ",
      status: "rejected",
      file: "don002.pdf",
      startTime: "2025-05-20T18:00:00.000Z",
      endTime: "2026-06-20T21:00:00.000Z",
      approvedTime: "2025-05-25T14:15:00.000Z",
      formCode: "DON002",
      submittedBy: "user2",
      approvedBy: "user3",
    },
    {
      id: "3",
      code: "DYC003",
      reason: "Nghỉ không lương",
      status: "pending",
      file: "don003.pdf",
      startTime: "2025-05-25T08:00:00.000Z",
      endTime: "2026-07-27T17:00:00.000Z",
      approvedTime: null,
      formCode: "DON003",
      submittedBy: "user4",
      approvedBy: "user3",
    },
    {
      id: "4",
      code: "DYC004",
      reason: "Xin nghỉ ốm",
      status: "pending",
      file: "don004.pdf",
      startTime: "2025-03-10T08:00:00.000Z",
      endTime: "2026-08-12T17:00:00.000Z",
      approvedTime: null,
      formCode: "DON001",
      submittedBy: "user1",
      approvedBy: "user3",
    },
    {
      id: "5",
      code: "DYC005",
      reason: "Xin nghỉ việc riêng",
      status: "pending",
      file: "don005.pdf",
      startTime: "2025-05-18T08:00:00.000Z",
      endTime: "2026-09-18T17:00:00.000Z",
      approvedTime: null,
      formCode: "DON002",
      submittedBy: "user2",
      approvedBy: "user3",
    },
  ];

  const [quickSearch, setQuickSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<QuanLiDonItem[]>(sampleData);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [formFilter] = Form.useForm<FilterValues>();

  const getData = async (
    page = currentPage,
    limit = pageSize,
    quickkSearch?: string,
    filters?: FilterValues
  ) => {
    setLoading(true);
    try {
      // Simulate API call with setTimeout
      setTimeout(() => {
        let filteredData = [...sampleData];

        // Apply quick search filter if provided
        if (quickkSearch && quickkSearch.trim() !== "") {
          const searchTerm = quickkSearch.toLowerCase();
          filteredData = filteredData.filter(
            (item) =>
              item.code.toLowerCase().includes(searchTerm) ||
              item.reason.toLowerCase().includes(searchTerm) ||
              item.formCode.toLowerCase().includes(searchTerm)
          );
        }

        // Apply filters if provided
        if (filters) {
          // Filter by form code
          if (filters.formCode) {
            filteredData = filteredData.filter(
              (item) => item.formCode === filters.formCode
            );
          }

          // Filter by status
          if (filters.status) {
            filteredData = filteredData.filter(
              (item) => item.status === filters.status
            );
          }

          // Filter by start date range
          if (filters.startDate) {
            const filterStartDate = filters.startDate.startOf("day");
            filteredData = filteredData.filter((item) => {
              const itemStartDate = dayjs(item.startTime);
              return (
                itemStartDate.isAfter(filterStartDate) ||
                itemStartDate.isSame(filterStartDate, "day")
              );
            });
          }

          // Filter by end date range
          if (filters.endDate) {
            const filterEndDate = filters.endDate.endOf("day");
            filteredData = filteredData.filter((item) => {
              const itemEndDate = dayjs(item.endTime);
              return (
                itemEndDate.isBefore(filterEndDate) ||
                itemEndDate.isSame(filterEndDate, "day")
              );
            });
          }
        }

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setTableData(paginatedData);
        setTotalItems(filteredData.length);
        setLoading(false);
      }, 300); // Reduced delay for better UX
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(currentPage, pageSize, quickSearch);
  }, []); // Reload data when page or size changes

  const handleBeforeExport = async (): Promise<QuanLiDonItem[]> => {
    setLoading(true);
    try {
      toast.info("Đang chuẩn bị dữ liệu xuất Excel...");

      // Simulate API call for export
      return new Promise((resolve) => {
        setTimeout(() => {
          setLoading(false);
          resolve(sampleData);
        }, 500);
      });
    } catch (error) {
      console.error("Error fetching export data:", error);
      toast.error("Lỗi khi tải dữ liệu để xuất Excel!");
      setLoading(false);
      return [];
    }
  };

  const handleApprove = (record: QuanLiDonItem) => {
    // Create current time for the approval timestamp
    const currentTime = new Date().toISOString();

    // Update the table data with the new status and approval time
    const updatedData = tableData.map((item) => {
      if (item.id === record.id) {
        return {
          ...item,
          status: "approved",
          approvedTime: currentTime,
        };
      }
      return item;
    });

    setTableData(updatedData);
    toast.success(`Đã duyệt đơn: ${record.code}`);
  };

  const handleReject = (record: QuanLiDonItem) => {
    // Create current time for the approval timestamp
    const currentTime = new Date().toISOString();

    // Update the table data with the new status and approval time
    const updatedData = tableData.map((item) => {
      if (item.id === record.id) {
        return {
          ...item,
          status: "rejected",
          approvedTime: currentTime,
        };
      }
      return item;
    });

    setTableData(updatedData);
    toast.success(`Đã từ chối đơn: ${record.code}`);
  };

  const columns = useMemo(
    () => [
      {
        title: t("maDon"),
        dataIndex: "code",
        key: "code",
        width: 120,
      },
      {
        title: t("lyDo"),
        dataIndex: "reason",
        key: "reason",
        width: 200,
      },
      {
        title: t("trangThai"),
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status: string) => (
          <Tag
            color={getStatusTagColor(status)}
            style={{
              borderRadius: "20px",
              padding: "4px 12px",
              fontWeight: 600,
              fontSize: "12px",
            }}
          >
            {getStatusLabel(status)}
          </Tag>
        ),
      },
      {
        title: t("tapTin"),
        dataIndex: "file",
        key: "file",
        width: 120,
        render: (file: string) => (file ? <a href="#">{file}</a> : "-"),
      },
      {
        title: t("thoiGianBatDau"),
        dataIndex: "startTime",
        key: "startTime",
        width: 150,
        render: (startTime: string) => formatDate(startTime),
      },
      {
        title: t("thoiGianKetThuc"),
        dataIndex: "endTime",
        key: "endTime",
        width: 150,
        render: (endTime: string) => formatDate(endTime),
      },
      {
        title: t("thoiGianDuyet"),
        dataIndex: "approvedTime",
        key: "approvedTime",
        width: 150,
        render: (approvedTime: string) => formatDate(approvedTime),
      },
      {
        title: t("maBieuMau"),
        dataIndex: "formCode",
        key: "formCode",
        width: 120,
      },
      {
        title: t("nguoiNop"),
        dataIndex: "submittedBy",
        key: "submittedBy",
        width: 150,
        render: (submittedBy: string) => {
          const users = {
            user1: "Nguyễn Văn A",
            user2: "Trần Thị B",
            user3: "Lê Văn C",
            user4: "Phạm Thị D",
          };
          return users[submittedBy as keyof typeof users] || submittedBy;
        },
      },
      {
        title: t("nguoiDuyet"),
        dataIndex: "approvedBy",
        key: "approvedBy",
        width: 150,
        render: (approvedBy: string) => {
          const users = {
            user1: "Nguyễn Văn A",
            user2: "Trần Thị B",
            user3: "Lê Văn C",
            user4: "Phạm Thị D",
          };
          return users[approvedBy as keyof typeof users] || approvedBy;
        },
      },
    ],
    [t]
  );

  // Define action column for our table
  const actionColumn = useMemo(
    () => ({
      render: (record: QuanLiDonItem) => {
        // Different confirmation messages based on current status
        const approveConfirmTitle =
          record.status === "rejected" ? "Xác nhận duyệt đơn" : null;
        const approveConfirmDescription =
          record.status === "rejected"
            ? `Đơn ${record.code} hiện đang ở trạng thái Từ chối. Bạn có chắc chắn muốn chuyển sang trạng thái Đã duyệt không?`
            : null;

        const rejectConfirmTitle =
          record.status === "approved" ? "Xác nhận từ chối đơn" : null;
        const rejectConfirmDescription =
          record.status === "approved"
            ? `Đơn ${record.code} hiện đang ở trạng thái Đã duyệt. Bạn có chắc chắn muốn chuyển sang trạng thái Từ chối không?`
            : null;

        return (
          <Space size="small">
            {/* Approve button */}
            {record.status !== "approved" ? (
              <Popconfirm
                title={approveConfirmTitle}
                description={approveConfirmDescription}
                okText="Xác nhận"
                cancelText="Hủy"
                onConfirm={() => handleApprove(record)}
                disabled={record.status !== "rejected"}
              >
                <Tooltip title="Duyệt đơn">
                  <Button
                    type="text"
                    size="small"
                    icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                    onClick={
                      record.status !== "rejected"
                        ? () => handleApprove(record)
                        : undefined
                    }
                  />
                </Tooltip>
              </Popconfirm>
            ) : (
              <Tooltip title="Duyệt đơn">
                <Button
                  type="text"
                  size="small"
                  icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                  disabled={true}
                />
              </Tooltip>
            )}

            {/* Reject button */}
            {record.status !== "rejected" ? (
              <Popconfirm
                title={rejectConfirmTitle}
                description={rejectConfirmDescription}
                okText="Xác nhận"
                cancelText="Hủy"
                onConfirm={() => handleReject(record)}
                disabled={record.status !== "approved"}
              >
                <Tooltip title="Từ chối đơn">
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={
                      record.status !== "approved"
                        ? () => handleReject(record)
                        : undefined
                    }
                  />
                </Tooltip>
              </Popconfirm>
            ) : (
              <Tooltip title="Từ chối đơn">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<CloseCircleOutlined />}
                  disabled={true}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    }),
    [tableData, t]
  );

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    getData(page, size, quickSearch, formFilter.getFieldsValue());
  };

  const onFinish = (values: FilterValues) => {
    getData(currentPage, pageSize, quickSearch, values);
  };

  const resetFilters = () => {
    formFilter.resetFields();
    getData(currentPage, pageSize, quickSearch);
  };

  return (
    <>
      {/* Filter Section */}
      <Form form={formFilter} onFinish={onFinish} className="from-quey">
        <FilterSection onReset={resetFilters}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="startDate" label="Thời gian bắt đầu">
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn thời gian bắt đầu"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="endDate" label="Thời gian kết thúc">
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn thời gian kết thúc"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="formCode" label="Mã biểu mẫu">
                <Cselect
                  allowClear
                  showSearch
                  placeholder="Chọn mã biểu mẫu"
                  options={formCodesData}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="status" label="Trạng thái">
                <Cselect
                  allowClear
                  showSearch
                  placeholder="Chọn trạng thái"
                  options={statusOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end" className={styles.actionButtonsRow}>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<CalendarOutlined />}
                  htmlType="submit"
                >
                  Tìm kiếm
                </Button>
              </Space>
            </Col>
          </Row>
        </FilterSection>
      </Form>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <div style={{ width: "20%" }}>
            <CInputLabel
              label={t("timKiem")}
              value={quickSearch}
              onChange={(e) => {
                setQuickSearch(e.target.value);
                getData(
                  currentPage,
                  pageSize,
                  e.target.value,
                  formFilter.getFieldsValue()
                );
              }}
            />
          </div>
        </div>

        <Ctable
          loading={loading}
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          usePagination
          totalItems={totalItems}
          onPageChange={handlePageChange}
          enableDrag={true}
          pageSize={10}
          rowHeight={15}
          showActions
          actionColumn={actionColumn}
          stickyHeader
          tableId="admin_quan_li_don_v2"
          onBeforeExport={handleBeforeExport}
        />
      </div>
    </>
  );
};

export default QuanLiDonPage;
