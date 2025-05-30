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
  EyeOutlined,
  FileTextOutlined,
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
  department?: string;
  comments?: string;
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

// Sample department options
const departmentOptions = [
  { value: "IT", label: "Phòng IT" },
  { value: "HR", label: "Phòng Nhân sự" },
  { value: "FINANCE", label: "Phòng Tài chính" },
  { value: "SALES", label: "Phòng Kinh doanh" },
  { value: "MARKETING", label: "Phòng Marketing" },
];

interface FilterValues {
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  formCode?: string;
  status?: string;
  department?: string;
}

const QuanLiDonHRPage = () => {
  const t = useTranslations("QuanLiDon");

  // Sample data with department field added
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
      department: "IT",
      comments: "Đã kiểm tra, nhân viên đủ điều kiện nghỉ phép",
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
      department: "SALES",
      comments: "Không có ngân sách cho tăng ca tháng này",
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
      department: "MARKETING",
      comments: "",
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
      department: "HR",
      comments: "",
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
      department: "FINANCE",
      comments: "",
    },
  ];

  const [quickSearch, setQuickSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<QuanLiDonItem[]>(sampleData);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [formFilter] = Form.useForm<FilterValues>();
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

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
              item.formCode.toLowerCase().includes(searchTerm) ||
              (item.department &&
                item.department.toLowerCase().includes(searchTerm))
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

          // Filter by department
          if (filters.department) {
            filteredData = filteredData.filter(
              (item) => item.department === filters.department
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

    // Update the table data with the new status, approval time, and comment
    const updatedData = tableData.map((item) => {
      if (item.id === record.id) {
        return {
          ...item,
          status: "approved",
          approvedTime: currentTime,
          comments: commentText[record.id] || item.comments || "Đã duyệt",
        };
      }
      return item;
    });

    setTableData(updatedData);
    toast.success(`Đã duyệt đơn: ${record.code}`);

    // Clear comment for this record
    setCommentText((prev) => {
      const newComments = { ...prev };
      delete newComments[record.id];
      return newComments;
    });
  };

  const handleReject = (record: QuanLiDonItem) => {
    // Validate if there's a rejection reason
    if (!commentText[record.id]) {
      toast.error("Vui lòng nhập lý do từ chối đơn");
      return;
    }

    // Create current time for the approval timestamp
    const currentTime = new Date().toISOString();

    // Update the table data with the new status, approval time, and comment
    const updatedData = tableData.map((item) => {
      if (item.id === record.id) {
        return {
          ...item,
          status: "rejected",
          approvedTime: currentTime,
          comments: commentText[record.id],
        };
      }
      return item;
    });

    setTableData(updatedData);
    toast.success(`Đã từ chối đơn: ${record.code}`);

    // Clear comment for this record
    setCommentText((prev) => {
      const newComments = { ...prev };
      delete newComments[record.id];
      return newComments;
    });
  };

  const handleViewDetails = (record: QuanLiDonItem) => {
    // In a real application, this would open a modal or navigate to a details page
    toast.info(`Xem chi tiết đơn: ${record.code}`);
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
        title: "Phòng ban",
        dataIndex: "department",
        key: "department",
        width: 120,
        render: (department: string) => {
          const deptLabel =
            departmentOptions.find((d) => d.value === department)?.label ||
            department;
          return deptLabel;
        },
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
      {
        title: "Ghi chú",
        dataIndex: "comments",
        key: "comments",
        width: 200,
      },
    ],
    [t]
  );

  // Define action column for our table
  const actionColumn = useMemo(
    () => ({
      render: (record: QuanLiDonItem) => {
        // Different confirmation messages based on current status
        const approveConfirmTitle = "Xác nhận duyệt đơn";
        const approveConfirmDescription = `Bạn có chắc chắn muốn duyệt đơn ${record.code}?`;

        const rejectConfirmTitle = "Xác nhận từ chối đơn";
        const rejectConfirmDescription = `Bạn có chắc chắn muốn từ chối đơn ${record.code}?`;

        return (
          <Space size="small">
            {/* View details button */}
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined style={{ color: "#1890ff" }} />}
                onClick={() => handleViewDetails(record)}
              />
            </Tooltip>

            {/* Approve button - only available for pending requests */}
            {record.status === "pending" && (
              <Popconfirm
                title={approveConfirmTitle}
                description={
                  <>
                    {approveConfirmDescription}
                    <div style={{ marginTop: 8 }}>
                      <textarea
                        placeholder="Ghi chú (không bắt buộc)"
                        style={{ width: "100%", marginTop: 8 }}
                        value={commentText[record.id] || ""}
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [record.id]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </>
                }
                okText="Xác nhận"
                cancelText="Hủy"
                onConfirm={() => handleApprove(record)}
              >
                <Tooltip title="Duyệt đơn">
                  <Button
                    type="text"
                    size="small"
                    icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                  />
                </Tooltip>
              </Popconfirm>
            )}

            {/* Reject button - only available for pending requests */}
            {record.status === "pending" && (
              <Popconfirm
                title={rejectConfirmTitle}
                description={
                  <>
                    {rejectConfirmDescription}
                    <div style={{ marginTop: 8 }}>
                      <textarea
                        placeholder="Lý do từ chối (bắt buộc)"
                        style={{ width: "100%", marginTop: 8 }}
                        value={commentText[record.id] || ""}
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [record.id]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </>
                }
                okText="Xác nhận"
                cancelText="Hủy"
                onConfirm={() => handleReject(record)}
              >
                <Tooltip title="Từ chối đơn">
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<CloseCircleOutlined />}
                  />
                </Tooltip>
              </Popconfirm>
            )}

            {/* Download file button - for all forms with attachments */}
            {record.file && (
              <Tooltip title="Tải xuống tệp đính kèm">
                <Button
                  type="text"
                  size="small"
                  icon={<FileTextOutlined style={{ color: "#722ed1" }} />}
                  onClick={() => toast.info(`Đang tải xuống: ${record.file}`)}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    }),
    [tableData, t, commentText]
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

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="department" label="Phòng ban">
                <Cselect
                  allowClear
                  showSearch
                  placeholder="Chọn phòng ban"
                  options={departmentOptions}
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
          tableId="hr_quan_li_don_v2"
          onBeforeExport={handleBeforeExport}
        />
      </div>
    </>
  );
};

export default QuanLiDonHRPage;
