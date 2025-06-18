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
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Use FormItem from our DTO
type DuyetNghiPhepItem = FormItem;

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

const DuyetNghiPhepPage = () => {
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
  const [tableData, setTableData] = useState<DuyetNghiPhepItem[]>([]);
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
      // Use the same approach as in danh-muc/don/page.tsx
      const params = {
        page: 1,
        limit: 100, // Get a reasonable number of form types
      };

      // Ensure we're using the correct API endpoint
      const response = await FormDescriptionServices.getDanhMucDon([], params);
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

  const handleBeforeExport = async (): Promise<DuyetNghiPhepItem[]> => {
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

  const handleApprove = async (record: DuyetNghiPhepItem) => {
    try {
      setLoading(true);
      // Create current time for the approval timestamp
      const currentTime = new Date().toISOString();

      // Prepare update data
      const updateData = {
        status: "APPROVED",
        approvedTime: currentTime,
        approvedBy: userProfile.code, // Get user code from Redux store
      };

      // Call API to update status
      await DanhMucDonServices.updateFormStatus(record.id, updateData);

      // Refresh data
      getData(currentPage, pageSize, quickSearch, formFilter.getFieldsValue());

      toast.success(`Đã duyệt đơn: ${record.code}`);
    } catch (error) {
      console.error("Error approving form:", error);
      toast.error("Lỗi khi duyệt đơn!");
      setLoading(false);
    }
  };

  const handleReject = async (record: DuyetNghiPhepItem) => {
    try {
      setLoading(true);
      // Create current time for the approval timestamp
      const currentTime = new Date().toISOString();

      // Prepare update data
      const updateData = {
        status: "REJECTED",
        approvedTime: currentTime,
        approvedBy: userProfile.code, // Get user code from Redux store
      };

      // Call API to update status
      await DanhMucDonServices.updateFormStatus(record.id, updateData);

      // Refresh data
      getData(currentPage, pageSize, quickSearch, formFilter.getFieldsValue());

      toast.success(`Đã từ chối đơn: ${record.code}`);
    } catch (error) {
      console.error("Error rejecting form:", error);
      toast.error("Lỗi khi từ chối đơn!");
      setLoading(false);
    }
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
      render: (record: DuyetNghiPhepItem) => {
        // Đơn đã được duyệt không thể chỉnh sửa
        if (record.status === "APPROVED") {
          return (
            <Space size="small">
              <Tooltip title="Đơn đã được duyệt">
                <Button
                  type="text"
                  size="small"
                  icon={<CheckCircleOutlined style={{ color: "#bfbfbf" }} />}
                  disabled={true}
                />
              </Tooltip>
              <Tooltip title="Đơn đã được duyệt không thể từ chối">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<CloseCircleOutlined />}
                  disabled={true}
                />
              </Tooltip>
            </Space>
          );
        }

        // Đơn đang chờ xử lý hoặc đã bị từ chối
        return (
          <Space size="small">
            {/* Approve button - luôn có thể duyệt đơn nếu chưa được duyệt */}
            <Tooltip title="Duyệt đơn">
              <Button
                type="text"
                size="small"
                icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                onClick={() => handleApprove(record)}
              />
            </Tooltip>

            {/* Reject button - chỉ có thể từ chối đơn đang chờ xử lý */}
            {record.status !== "REJECTED" ? (
              <Tooltip title="Từ chối đơn">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleReject(record)}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Đơn đã bị từ chối">
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
        // initialValues={{
        //   fromDate: dayjs().startOf("day"),
        //   toDate: dayjs().endOf("day"),
        // }}
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
          tableId="hr_duyet_nghi_phep"
          onBeforeExport={handleBeforeExport}
        />
      </div>
    </>
  );
};

export default DuyetNghiPhepPage;
