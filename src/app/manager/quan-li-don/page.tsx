/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CdatePicker from "@/components/basicUI/CdatePicker";
import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import FilterSection from "@/components/basicUI/FilterSection";
import Cselect from "@/components/Cselect";
import { FormItem as FormDescriptionItem } from "@/dtos/danhMuc/don/don.dto";
import { FormItem } from "@/dtos/quan-li-don/quan-li-don";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import FormDescriptionServices from "@/services/admin/danh-muc/don/don.service";
import DanhMucDonServices from "@/services/admin/quan-li-don/quan-li-don.service";
import {
  CheckCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CommentOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Row,
  Space,
  Tag,
  Tooltip,
  Modal,
  Checkbox,
  Input,
  Card,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./index.scss";

const { Title, Text } = Typography;

// Use FormItem from our DTO
type QuanLiDonItem = FormItem;

// Format date function
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  return dayjs(dateString).format("HH:mm DD/MM/YYYY");
};

// Map status values to display labels
const getStatusLabel = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "Chờ xử lý";
    case "APPROVED":
      return "Đã duyệt";
    case "REJECTED":
      return "Từ chối";
    case "CANCELED":
      return "Đã hủy";
    default:
      return status;
  }
};

// Get status tag color
const getStatusTagColor = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "error";
    case "CANCELED":
      return "default";
    default:
      return "blue";
  }
};

interface FilterValues {
  fromDate: dayjs.Dayjs;
  toDate: dayjs.Dayjs;
  formId?: string;
}

const QuanLiDonPage = () => {
  const t = useTranslations("QuanLiDon");
  const { userProfile } = useSelector(selectAuthLogin);

  // We'll get data from API instead of using sample data
  const [formTypes, setFormTypes] = useState<
    { value: string; label: string }[]
  >([]);
  const [formTypesLoading, setFormTypesLoading] = useState<boolean>(false);
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<QuanLiDonItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [formFilter] = Form.useForm<FilterValues>();

  // State for approval modal
  const [isApprovalModalVisible, setIsApprovalModalVisible] =
    useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<QuanLiDonItem | null>(
    null
  );
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

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

      // searchFilter.push({
      //   key: "reason",
      //   type: FilterOperationType.IContains,
      //   value: "Đưa con đi học",
      // });

      const params: any = {
        ...(quickkSearch ? { quickSearch: quickkSearch } : {}),
        ...(filters && filters.formId ? { formId: filters.formId } : {}),
        ...(filters && filters.fromDate !== undefined
          ? { fromDate: filters.fromDate.startOf("day").toISOString() }
          : {}),
        ...(filters && filters.toDate !== undefined
          ? { toDate: filters.toDate.endOf("day").toISOString() }
          : {}),
      };
      const response = await DanhMucDonServices.filterDanhMucDon(
        searchFilter,
        params
      );
      setTableData(response.data);
      //Reverse the data array before setting it to state
      // const reversedData = [...response.data].reverse();
      // setTableData(reversedData);
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
    fetchFormTypes();
  }, [currentPage, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch form types for the dropdown
  const fetchFormTypes = async () => {
    try {
      setFormTypesLoading(true);
      const searchFilter: any = [
        { key: "limit", type: "=", value: 100 },
        { key: "offset", type: "=", value: 0 },
      ];
      const params: any = {};
      const response = await FormDescriptionServices.getDanhMucDon(
        searchFilter,
        params
      );
      const formOptions = response.data.map((form: FormDescriptionItem) => ({
        value: form.id,
        label: form.title,
      }));
      setFormTypes(formOptions);
      setFormTypesLoading(false);
    } catch (error) {
      console.error("Error fetching form types:", error);
      toast.error("Lỗi khi tải danh sách biểu mẫu!");
      setFormTypesLoading(false);
    }
  };

  const handleBeforeExport = async (): Promise<QuanLiDonItem[]> => {
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
      const params: any = {
        ...(quickSearch ? { quickSearch: quickSearch } : {}),
        ...(formFilter.getFieldValue("formId")
          ? { formId: formFilter.getFieldValue("formId") }
          : {}),
        ...(formFilter.getFieldValue("fromDate") !== undefined
          ? {
              fromDate: formFilter
                .getFieldValue("fromDate")
                .startOf("day")
                .toISOString(),
            }
          : {}),
        ...(formFilter.getFieldValue("toDate") !== undefined
          ? { toDate: formFilter.getFieldValue("toDate").toISOString() }
          : {}),
      };
      const response = await DanhMucDonServices.filterDanhMucDon(
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
  const showApprovalModal = (record: QuanLiDonItem) => {
    setSelectedRecord(record);
    setIsConfirmed(false);
    setResponse("");
    setIsApprovalModalVisible(true);
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsApprovalModalVisible(false);
    setSelectedRecord(null);
    setIsConfirmed(false);
    setResponse("");
  };

  // Handle reject action from modal
  const handleRejectFromModal = async () => {
    if (!selectedRecord) return;

    try {
      setLoading(true);
      // Create current time for the rejection timestamp
      const currentTime = new Date().toISOString();

      // Prepare update data
      const updateData = {
        status: "REJECTED",
        approvedTime: currentTime,
        approvedBy: userProfile.code, // Get user code from Redux store
        response: response, // Add rejection response
      };

      // Call API to update status
      await DanhMucDonServices.updateFormStatus(selectedRecord.id, updateData);

      // Close modal
      setIsApprovalModalVisible(false);
      setSelectedRecord(null);
      setIsConfirmed(false);
      setResponse("");

      // Refresh data
      getData(currentPage, pageSize, quickSearch, formFilter.getFieldsValue());

      toast.success(
        `Đã từ chối: ${selectedRecord.formTitle} của ${selectedRecord.submittedBy}`
      );
    } catch (error) {
      console.error("Error rejecting form:", error);
      toast.error("Lỗi khi từ chối đơn!");
      setLoading(false);
    }
  };

  // Handle modal submit
  const handleModalSubmit = async () => {
    if (!isConfirmed || !selectedRecord) {
      toast.warning("Vui lòng xác nhận trước khi duyệt đơn!");
      return;
    }

    try {
      setLoading(true);
      // Create current time for the approval timestamp
      const currentTime = new Date().toISOString();

      // Prepare update data
      const updateData = {
        status: "APPROVED",
        approvedTime: currentTime,
        approvedBy: userProfile.code, // Get user code from Redux store
        response: response, // Add approval response
      };

      // Call API to update status
      await DanhMucDonServices.updateFormStatus(selectedRecord.id, updateData);

      // Close modal
      setIsApprovalModalVisible(false);
      setSelectedRecord(null);
      setIsConfirmed(false);
      setResponse("");

      // Refresh data
      getData(currentPage, pageSize, quickSearch, formFilter.getFieldsValue());

      toast.success(
        `Đã duyệt: ${selectedRecord.formTitle} của ${selectedRecord.submittedBy}`
      );
    } catch (error) {
      console.error("Error approving form:", error);
      toast.error("Lỗi khi duyệt đơn!");
      setLoading(false);
    }
  };

  const handleFormAction = async (record: QuanLiDonItem) => {
    showApprovalModal(record);
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
        title: t("nguoiNop"),
        dataIndex: "submittedBy",
        key: "submittedBy",
        width: 150,
      },
      {
        title: t("tieuDeDon"),
        dataIndex: "formTitle",
        key: "formTitle",
        width: 180,
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
        title: t("nguoiDuyet"),
        dataIndex: "approvedBy",
        key: "approvedBy",
        width: 150,
      },
    ],
    [t]
  );

  // Define action column for our table
  const actionColumn = useMemo(
    () => ({
      render: (record: QuanLiDonItem) => {
        // Đơn đã được duyệt hoặc từ chối - chỉ có thể xem
        if (record.status === "APPROVED" || record.status === "REJECTED") {
          return (
            <Tooltip title="Xem chi tiết đơn">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined style={{ color: "#1890ff" }} />}
                onClick={() => handleFormAction(record)}
              />
            </Tooltip>
          );
        }

        // Đơn đang chờ xử lý - có thể xử lý
        return (
          <Tooltip title="Xử lý đơn">
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
        initialValues={{
          fromDate: dayjs().startOf("day"),
          toDate: dayjs().endOf("day"),
        }}
      >
        <FilterSection
          onReset={resetFilters}
          onSearch={() => formFilter.submit()}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item
                name="fromDate"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const endDate = getFieldValue("datePlugOut");
                      if (!value || !endDate || value.isBefore(endDate)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Ngày vào không thể lớn hơn ngày ra")
                      );
                    },
                  }),
                ]}
              >
                <CdatePicker
                  label="Từ ngày"
                  placeholder="date"
                  showTime
                  style={{ width: "100%", height: "33px" }}
                  format="YYYY-MM-DD  HH:mm:ss"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item
                name="toDate"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const startDate = getFieldValue("datePlugIn");
                      if (!value || !startDate || value.isAfter(startDate)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Ngày ra không thể bé hơn ngày vào")
                      );
                    },
                  }),
                ]}
              >
                <CdatePicker
                  placeholder="date"
                  label="Đến ngày"
                  showTime
                  style={{ width: "100%", height: "33px" }}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="formId">
                <Cselect
                  allowClear
                  showSearch
                  label="Tiêu đề đơn"
                  options={formTypes}
                  disabled={formTypesLoading}
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
          tableId="admin_quan_li_don_v2"
          onBeforeExport={handleBeforeExport}
        />
      </div>

      {/* Approval Confirmation Modal */}
      <Modal
        title={
          <div
            style={{ display: "flex", alignItems: "center", color: "#1890ff" }}
          >
            <CheckCircleOutlined style={{ marginRight: 8, fontSize: 20 }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {selectedRecord &&
              (selectedRecord.status === "APPROVED" ||
                selectedRecord.status === "REJECTED")
                ? "Chi tiết đơn"
                : "Xử lý đơn"}
            </span>
          </div>
        }
        open={isApprovalModalVisible}
        onCancel={handleModalCancel}
        width={600}
        bodyStyle={{ padding: "0px" }}
        style={{ top: 20 }}
        footer={
          selectedRecord &&
          (selectedRecord.status === "APPROVED" ||
            selectedRecord.status === "REJECTED")
            ? [
                <Button
                  key="reject"
                  danger
                  disabled={true}
                  style={{ marginRight: 8 }}
                >
                  Từ chối đơn
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  disabled={true}
                  style={{ backgroundColor: "#d9d9d9", borderColor: "#d9d9d9" }}
                >
                  Xác nhận duyệt
                </Button>,
              ]
            : [
                <Button key="reject" danger onClick={handleRejectFromModal}>
                  Từ chối đơn
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={handleModalSubmit}
                  disabled={!isConfirmed}
                  style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
                >
                  Xác nhận duyệt
                </Button>,
              ]
        }
      >
        {selectedRecord && (
          <>
            <Card
              bordered={false}
              style={{
                marginBottom: 20,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
              }}
            >
              <Title
                level={4}
                style={{
                  color: "#1890ff",
                  marginBottom: 16,
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: 10,
                }}
              >
                {selectedRecord.formTitle}
              </Title>

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Space>
                    <Tag
                      color={getStatusTagColor(selectedRecord.status)}
                      style={{
                        fontWeight: 600,
                        padding: "2px 10px",
                        borderRadius: 12,
                      }}
                    >
                      {getStatusLabel(selectedRecord.status)}
                    </Tag>
                    <Text type="secondary">Mã đơn: {selectedRecord.code}</Text>
                  </Space>
                </Col>

                <Col span={12}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CalendarOutlined
                      style={{ marginRight: 8, color: "#1890ff" }}
                    />
                    <div>
                      <Text strong>Thời gian bắt đầu:</Text>
                      <div>{formatDate(selectedRecord.startTime)}</div>
                    </div>
                  </div>
                </Col>

                <Col span={12}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ClockCircleOutlined
                      style={{ marginRight: 8, color: "#1890ff" }}
                    />
                    <div>
                      <Text strong>Thời gian kết thúc:</Text>
                      <div>{formatDate(selectedRecord.endTime)}</div>
                    </div>
                  </div>
                </Col>

                <Col span={24}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginTop: 8,
                    }}
                  >
                    <FileTextOutlined
                      style={{ marginRight: 8, color: "#1890ff", marginTop: 4 }}
                    />
                    <div>
                      <Text strong>Lý do:</Text>
                      <div
                        style={{
                          backgroundColor: "#f9f9f9",
                          padding: "8px 12px",
                          borderRadius: 4,
                          border: "1px solid #f0f0f0",
                          marginTop: 4,
                        }}
                      >
                        {selectedRecord.reason}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <CommentOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                <Text strong>
                  {selectedRecord.status === "APPROVED" ||
                  selectedRecord.status === "REJECTED"
                    ? "Phản hồi:"
                    : "Nhập phản hồi:"}
                </Text>
              </div>
              <Input.TextArea
                value={
                  selectedRecord.status === "APPROVED" ||
                  selectedRecord.status === "REJECTED"
                    ? selectedRecord.response || "Không có phản hồi"
                    : response
                }
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Nhập phản hồi của bạn"
                rows={3}
                style={{
                  borderRadius: 4,
                  resize: "none",
                  border: "1px solid #d9d9d9",
                }}
                disabled={
                  selectedRecord.status === "APPROVED" ||
                  selectedRecord.status === "REJECTED"
                }
              />
            </div>

            <div
              style={{
                backgroundColor: "#e6f7ff",
                border: "1px solid #91d5ff",
                borderRadius: 4,
                padding: 12,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Checkbox
                checked={selectedRecord.status === "APPROVED" || isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                style={{ marginRight: 8 }}
                disabled={
                  selectedRecord &&
                  (selectedRecord.status === "APPROVED" ||
                    selectedRecord.status === "REJECTED")
                }
              />
              <Text>Đơn cộng giờ</Text>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default QuanLiDonPage;
