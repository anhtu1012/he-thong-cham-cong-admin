/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CdatePicker from "@/components/basicUI/CdatePicker";
import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import FilterSection from "@/components/basicUI/FilterSection";
import { QuanLyLuongResponseItem } from "@/dtos/quan-ly-luong/quanLyLuong.response.dto";
import QuanLyLuongServices from "@/services/quan-ly-luong/quan-ly-luong.service";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "./index.scss";
import { QuanLyLuongStatus } from "@/dtos/quan-ly-luong/quanLyLuong.dto";

const { Text } = Typography;

// Map status values to display labels
const getStatusLabel = (status: string): string => {
  switch (status) {
    case "NOTPAID":
      return "Chờ thanh toán";
    case "CONFIRM":
      return "Đang xác nhận";
    case "ACCEPT":
      return "Đã thanh toán";
    case "STOP":
      return "Đã tất toán";
    default:
      return status;
  }
};

const getStatusTagColor = (status: string): string => {
  switch (status) {
    case "NOTPAID":
      return "default";
    case "CONFIRM":
      return "warning";
    case "ACCEPT":
      return "success";
    case "STOP":
      return "error";
    default:
      return "blue";
  }
};
interface FilterValues {
  formId?: string;
  status?: string;
  month?: string;
}

const QuanLyLuongPage = () => {
  const t = useTranslations("QuanLyLuong");
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<QuanLyLuongResponseItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [formFilter] = Form.useForm<FilterValues>();

  // State for approval modal
  const [isApprovalModalVisible, setIsApprovalModalVisible] =
    useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] =
    useState<QuanLyLuongResponseItem | null>(null);

  const getData = async (
    page = currentPage,
    limit = pageSize,
    quickkSearch?: string,
    filters?: FilterValues
  ) => {
    setLoading(true);
    try {
      const searchFilter: any = [
        { key: "limit", type: "=", value: limit },
        { key: "offset", type: "=", value: (page - 1) * limit },
      ];

      if (filters?.status) {
        searchFilter.push({
          key: "status",
          type: FilterOperationType.Eq,
          value: filters?.status,
        });
      }
      if (filters?.month) {
        searchFilter.push({
          key: "month",
          type: FilterOperationType.Eq,
          value: filters?.month,
        });
      }

      const params: any = {
        ...(quickkSearch ? { quickSearch: quickkSearch } : {}),
        ...(filters && filters.formId ? { formId: filters.formId } : {}),
        ...(filters && filters.month ? { month: filters.month } : {}),
      };
      const response = await QuanLyLuongServices.getQuanLyLuong(
        searchFilter,
        params
      );
      setTableData(response.data);
      setTotalItems(response.count);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Lỗi khi tải dữ liệu đơn!");
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(currentPage, pageSize, quickSearch, formFilter.getFieldsValue());
  }, [currentPage, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBeforeExport = async (): Promise<QuanLyLuongResponseItem[]> => {
    setLoading(true);
    try {
      toast.info("Đang chuẩn bị dữ liệu xuất Excel...");

      const searchFilterExport: any = [
        {
          key: "limit",
          type: "=",
          value: process.env.NEXT_PUBLIC_LIMIT_QUERY_EXPORT,
        },
        { key: "offset", type: "=", value: 0 },
      ];
      if (formFilter.getFieldValue("status")) {
        searchFilterExport.push({
          key: "status",
          type: FilterOperationType.Eq,
          value: formFilter.getFieldValue("status"),
        });
      }
      if (formFilter.getFieldValue("month")) {
        searchFilterExport.push({
          key: "month",
          type: FilterOperationType.Eq,
          value: formFilter.getFieldValue("month"),
        });
      }

      const params: any = {
        ...(quickSearch ? { quickSearch: quickSearch } : {}),
        ...(formFilter.getFieldValue("formId")
          ? { formId: formFilter.getFieldValue("formId") }
          : {}),
        ...(formFilter.getFieldValue("month")
          ? { month: formFilter.getFieldValue("month") }
          : {}),
      };
      const response = await QuanLyLuongServices.getQuanLyLuong(
        searchFilterExport,
        params
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error fetching export data:", error);
      toast.error("Lỗi khi tải dữ liệu để xuất Excel!");
      setLoading(false);
      return [];
    }
  };

  // Show approval modal instead of directly approving
  const showApprovalModal = (record: QuanLyLuongResponseItem) => {
    setSelectedRecord(record);
    setIsApprovalModalVisible(true);
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsApprovalModalVisible(false);
    setSelectedRecord(null);
  };

  const handleFormAction = async (record: QuanLyLuongResponseItem) => {
    showApprovalModal(record);
  };

  const columns = useMemo(
    () => [
      {
        title: "Mã nhân viên",
        dataIndex: "userCode",
        key: "userCode",
        width: 120,
      },
      {
        title: "Tên nhân viên",
        dataIndex: "fullName",
        key: "fullName",
        width: 120,
      },
      {
        title: "Tháng/Năm",
        dataIndex: "month",
        key: "month",
        width: 100,
      },
      {
        title: "Số ngày làm",
        dataIndex: "workDay",
        key: "workDay",
        width: 160,
      },
      {
        title: "Lương cơ bản",
        dataIndex: "actualSalary",
        key: "actualSalary",
        width: 150,
        render: (value: number) =>
          value ? value.toLocaleString("vi-VN") + " VND" : "0 VND",
      },
      {
        title: "Lương OT",
        dataIndex: "overtimeSalary",
        key: "overtimeSalary",
        width: 100,
        render: (value: number, record: QuanLyLuongResponseItem) =>
          value
            ? (value * record.overTimeSalaryPosition).toLocaleString("vi-VN") +
              " VND"
            : "0 VND",
      },
      {
        title: "Khấu trừ",
        dataIndex: "deductionFee",
        key: "deductionFee",
        width: 100,
        render: (value: number | null) =>
          value != null ? value.toLocaleString() : "-",
      },
      {
        title: "Phụ cấp",
        dataIndex: "allowance",
        key: "allowance",
        width: 120,
        render: (value: number) =>
          value?.toLocaleString("vi-VN") + " VND" || "0 VND",
      },
      {
        title: "Số lần đi trễ",
        dataIndex: "lateTimeCount",
        key: "lateTimeCount",
        width: 110,
      },
      {
        title: "Phạt đi trễ",
        dataIndex: "lateFine",
        key: "lateFine",
        width: 100,
        render: (value: number) =>
          value?.toLocaleString("vi-VN") + " VND" || "0 VND",
      },
      {
        title: "Phí khác",
        dataIndex: "otherFee",
        key: "otherFee",
        width: 100,
        render: (value: number | null) =>
          value != null ? value.toLocaleString() : "-",
      },
      {
        title: "Tổng giờ công",
        dataIndex: "totalWorkHour",
        key: "totalWorkHour",
        width: 110,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 110,
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
        title: "Ngày trả",
        dataIndex: "paidDate",
        key: "paidDate",
        width: 130,
        render: (date: string | null) =>
          date ? dayjs(date).format("DD/MM/YYYY") : "-",
      },

      {
        title: "Tổng lương",
        dataIndex: "totalSalary",
        key: "totalSalary",
        width: 130,
        fixed: "right" as const,
        render: (value: number) =>
          value ? value?.toLocaleString("vi-VN") + " VND" : "0 VND",
      },
    ],
    []
  );

  // Define action column for our table
  const actionColumn = useMemo(
    () => ({
      render: (record: QuanLyLuongResponseItem) => {
        // Lương đã được thanh toán - chỉ có thể xem
        if (record.status === "ACCEPT") {
          return (
            <Tooltip title="Xem chi tiết bảng lương">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined style={{ color: "#1890ff" }} />}
                onClick={() => handleFormAction(record)}
              />
            </Tooltip>
          );
        }

        // Lương chưa thanh toán - có thể xác nhận thanh toán
        return (
          <Tooltip title="Xác nhận thanh toán lương">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => handleFormAction(record)}
            />
          </Tooltip>
        );
      },
    }),
    []
  );
  const handleThanhToan = async (
    id: string | undefined,
    status: QuanLyLuongStatus
  ) => {
    if (!id) {
      toast.error("Không tìm thấy bảng lương để thanh toán!");
      return;
    }
    try {
      await QuanLyLuongServices.updateQuanLyLuong(id, {
        status: status,
      });
      toast.success("Thanh toán lương thành công!");
      setIsApprovalModalVisible(false);
      getData(currentPage, pageSize, quickSearch, formFilter.getFieldsValue());
    } catch (error) {
      console.error("Error updating salary:", error);
      toast.error("Lỗi khi thanh toán lương!");
    }
  };
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
      <Form
        form={formFilter}
        onFinish={onFinish}
        className="from-quey"
        initialValues={
          {
            // fromDate: dayjs().startOf("day"),
            // toDate: dayjs().endOf("day"),
          }
        }
      >
        <FilterSection
          onReset={resetFilters}
          onSearch={() => formFilter.submit()}
        >
          <Row gutter={[16, 16]}>
            {/* Bỏ fromDate/toDate, thêm chọn tháng */}
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="month">
                <CdatePicker
                  picker="month"
                  label="Chọn tháng"
                  placeholder="Chọn tháng"
                  style={{ width: "100%", height: "33px" }}
                  format="MM/YYYY"
                  onChange={(value) => {
                    // Lưu giá trị dạng 7/25 (tháng/năm 2 số cuối) vào form
                    formFilter.setFieldValue(
                      "month",
                      value
                        ? `${value.month() + 1}/${value
                            .year()
                            .toString()
                            .slice(-2)}`
                        : undefined
                    );
                  }}
                />
              </Form.Item>
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
          tableId="quan-ly-luong-table"
          onBeforeExport={handleBeforeExport}
        />
      </div>

      {/* Approval Confirmation Modal */}
      <Modal
        className="salary-modal"
        title={
          <div
            style={{ display: "flex", alignItems: "center", color: "#1890ff" }}
          >
            <CheckCircleOutlined style={{ marginRight: 8, fontSize: 20 }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {selectedRecord && selectedRecord.status === "ACCEPT"
                ? "Chi tiết bảng lương"
                : "Xác nhận thanh toán lương"}
            </span>
          </div>
        }
        open={isApprovalModalVisible}
        onCancel={handleModalCancel}
        width={600}
        bodyStyle={{ padding: "0px" }}
        style={{ top: 20 }}
        footer={
          (selectedRecord && selectedRecord.status === "ACCEPT") ||
          selectedRecord?.status === "STOP"
            ? [
                <Button key="close" onClick={handleModalCancel}>
                  Đóng
                </Button>,
              ]
            : [
                <Button
                  key="cancel"
                  onClick={() => handleThanhToan(selectedRecord?.id, "STOP")}
                  style={{
                    backgroundColor: "#de4f0dff",
                    borderColor: "#de4f0dff",
                    color: "#fff",
                  }}
                >
                  Tất toán
                </Button>,
                <Button
                  key="confirm"
                  type="primary"
                  onClick={() => handleThanhToan(selectedRecord?.id, "ACCEPT")}
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                >
                  Xác nhận thanh toán
                </Button>,
              ]
        }
      >
        {selectedRecord && (
          <>
            <Card bordered={false} className="salary-details-card">
              <div className="salary-header">
                <h4>Chi tiết bảng lương</h4>
                <Tag
                  className={`status-${selectedRecord.status.toLowerCase()}`}
                  color={getStatusTagColor(selectedRecord.status)}
                >
                  {getStatusLabel(selectedRecord.status)}
                </Tag>
              </div>

              <div className="status-section">
                <Space>
                  <Text className="employee-code">
                    Tên nhân viên: {selectedRecord.fullName}
                  </Text>

                  <Text className="employee-code">
                    {selectedRecord.paidDate
                      ? dayjs(selectedRecord.paidDate).format("DD/MM/YYYY")
                      : "Chưa trả"}
                  </Text>
                </Space>
              </div>

              <Row gutter={[8, 8]} className="salary-info-grid">
                <Col span={12}>
                  <div className="salary-item with-icon">
                    <CalendarOutlined className="salary-icon" />
                    <div className="salary-content">
                      <div className="salary-label">Tháng/Năm</div>
                      <div className="salary-value highlight">
                        {selectedRecord.month}
                      </div>
                    </div>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="salary-item with-icon">
                    <ClockCircleOutlined className="salary-icon" />
                    <div className="salary-content">
                      <div className="salary-label">Số ngày làm</div>
                      <div className="salary-value">
                        {selectedRecord.workDay} ngày
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="salary-item">
                    <div className="salary-label">Tổng công làm</div>
                    <div className="salary-value">
                      {selectedRecord.totalWorkHour} công
                    </div>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="salary-item">
                    <div className="salary-label">Lương thực tế</div>
                    <div className="salary-value currency">
                      {selectedRecord.actualSalary?.toLocaleString("vi-VN")} VND
                    </div>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="salary-item">
                    <div className="salary-label">Lương OT</div>
                    <div className="salary-value currency">
                      {(
                        selectedRecord.overtimeSalary *
                        selectedRecord.overTimeSalaryPosition
                      )?.toLocaleString("vi-VN")}{" "}
                      VND
                    </div>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="salary-item">
                    <div className="salary-label">Phụ cấp</div>
                    <div className="salary-value currency">
                      {selectedRecord.allowance?.toLocaleString("vi-VN")} VND
                    </div>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="salary-item">
                    <div className="salary-label">Số lần đi trễ</div>
                    <div className="salary-value">
                      {selectedRecord.lateTimeCount} lần
                    </div>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="salary-item">
                    <div className="salary-label">Phạt đi trễ</div>
                    <div className="salary-value currency">
                      -{" "}
                      {(
                        selectedRecord.lateFine * selectedRecord.lateTimeCount
                      )?.toLocaleString("vi-VN")}{" "}
                      VND
                    </div>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="salary-item">
                    <div className="salary-label">Khấu trừ</div>
                    <div className="salary-value currency">
                      {selectedRecord.deductionFee?.toLocaleString("vi-VN") ||
                        "0"}{" "}
                      VND
                    </div>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="salary-item">
                    <div className="salary-label">Phí khác</div>
                    <div className="salary-value currency">
                      {selectedRecord.otherFee?.toLocaleString("vi-VN") || "0"}{" "}
                      VND
                    </div>
                  </div>
                </Col>

                <Col span={24}>
                  <div className="total-salary-highlight">
                    <div className="total-amount">
                      Tổng lương:{" "}
                      {selectedRecord.totalSalary?.toLocaleString("vi-VN")}
                      <span className="currency-symbol">VND</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </>
        )}
      </Modal>
    </>
  );
};

export default QuanLyLuongPage;
