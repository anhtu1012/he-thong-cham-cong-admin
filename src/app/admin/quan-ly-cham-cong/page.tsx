"use client";

import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import FilterSection from "@/components/basicUI/FilterSection";
import { Tag, Form, Row, Col, DatePicker } from "antd";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import Cselect from "@/components/Cselect";

// Sample roles enum
enum UserRole {
  ADMIN = "ADMIN",
  HR = "HR",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
}

// Sample data interface for QuanLiChamCong
interface QuanLiChamCongItem {
  code: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  date: string;
  status: string;
  userCode: string;
  userName: string; // Added for display purposes
  userRole: UserRole; // Added user role
  branchCode: string;
  branchName: string; // Added for display purposes
  workingScheduleCode: string;
  workingScheduleName: string; // Added for display purposes
  company: string;
}

// Format date function
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  return dayjs(dateString).format("DD/MM/YYYY");
};

// Format time function
const formatTime = (dateString: string | null): string => {
  if (!dateString) return "";
  return dayjs(dateString).format("HH:mm");
};

// Get status label and details
const getStatusInfo = (status: string): { label: string; color: string } => {
  if (status.includes("đúng giờ")) {
    return { label: status, color: "success" };
  } else if (status.includes("đi trễ")) {
    return { label: status, color: "error" };
  } else if (status.includes("vắng mặt")) {
    return { label: status, color: "default" };
  } else {
    return { label: status, color: "warning" };
  }
};

// Sample branches
const branchesData = [
  { value: "CN001", label: "Chi nhánh Hà Nội" },
  { value: "CN002", label: "Chi nhánh Hồ Chí Minh" },
  { value: "CN003", label: "Chi nhánh Đà Nẵng" },
];

// Sample working schedules
const workingSchedulesData = [
  { value: "CA001", label: "Ca sáng (8:00 - 12:00)" },
  { value: "CA002", label: "Ca chiều (13:00 - 17:00)" },
  { value: "CA003", label: "Ca tối (18:00 - 22:00)" },
  { value: "CA004", label: "Ca đêm (22:00 - 6:00)" },
];

// Sample status options
const statusOptions = [
  { value: "đúng giờ", label: "Đúng giờ" },
  { value: "đi trễ", label: "Đi trễ" },
  { value: "vắng mặt", label: "Vắng mặt" },
];

// Sample companies
const companiesData = [
  { value: "COMP001", label: "FPT Software" },
  { value: "COMP002", label: "Viettel" },
  { value: "COMP003", label: "VNG Corporation" },
  { value: "COMP004", label: "MoMo" },
  { value: "COMP005", label: "Tiki" },
];

interface FilterValues {
  date?: dayjs.Dayjs;
  branchCode?: string;
  workingScheduleCode?: string;
  status?: string;
  userRole?: UserRole;
  company?: string;
}

// Sample role options
const roleOptions = [
  { value: UserRole.MANAGER, label: "Manager" },
  { value: UserRole.HR, label: "HR" },
  { value: UserRole.STAFF, label: "Staff" },
];

const QuanLiChamCongPage = () => {
  const t = useTranslations("QuanLiChamCong");

  // Sample data
  const sampleData: QuanLiChamCongItem[] = [
    {
      code: "CK001",
      checkInTime: "2025-05-15T08:05:00.000Z",
      checkOutTime: "2025-05-15T12:00:00.000Z",
      date: "2025-05-15T00:00:00.000Z",
      status: "đi trễ 5 phút",
      userCode: "NV001",
      userName: "Nguyễn Văn A",
      userRole: UserRole.MANAGER,
      branchCode: "CN001",
      branchName: "Chi nhánh Hà Nội",
      workingScheduleCode: "CA001",
      workingScheduleName: "Ca sáng (8:00 - 12:00)",
      company: "FPT Software",
    },
    {
      code: "CK002",
      checkInTime: "2025-05-15T13:00:00.000Z",
      checkOutTime: "2025-05-15T17:00:00.000Z",
      date: "2025-05-15T00:00:00.000Z",
      status: "đúng giờ",
      userCode: "NV002",
      userName: "Trần Thị B",
      userRole: UserRole.HR,
      branchCode: "CN002",
      branchName: "Chi nhánh Hồ Chí Minh",
      workingScheduleCode: "CA002",
      workingScheduleName: "Ca chiều (13:00 - 17:00)",
      company: "Viettel",
    },
    {
      code: "CK003",
      checkInTime: "2025-05-16T18:15:00.000Z",
      checkOutTime: "2025-05-16T22:00:00.000Z",
      date: "2025-05-16T00:00:00.000Z",
      status: "đi trễ 15 phút",
      userCode: "NV003",
      userName: "Lê Văn C",
      userRole: UserRole.STAFF,
      branchCode: "CN003",
      branchName: "Chi nhánh Đà Nẵng",
      workingScheduleCode: "CA003",
      workingScheduleName: "Ca tối (18:00 - 22:00)",
      company: "VNG Corporation",
    },
    {
      code: "CK004",
      checkInTime: "2025-05-16T08:00:00.000Z",
      checkOutTime: "2025-05-16T12:00:00.000Z",
      date: "2025-05-16T00:00:00.000Z",
      status: "đúng giờ",
      userCode: "NV004",
      userName: "Phạm Thị D",
      userRole: UserRole.STAFF,
      branchCode: "CN001",
      branchName: "Chi nhánh Hà Nội",
      workingScheduleCode: "CA001",
      workingScheduleName: "Ca sáng (8:00 - 12:00)",
      company: "MoMo",
    },
    {
      code: "CK005",
      checkInTime: "2025-05-17T22:10:00.000Z",
      checkOutTime: "2025-05-18T06:00:00.000Z",
      date: "2025-05-17T00:00:00.000Z",
      status: "đi trễ 10 phút",
      userCode: "NV005",
      userName: "Hoàng Văn E",
      userRole: UserRole.MANAGER,
      branchCode: "CN002",
      branchName: "Chi nhánh Hồ Chí Minh",
      workingScheduleCode: "CA004",
      workingScheduleName: "Ca đêm (22:00 - 6:00)",
      company: "Tiki",
    },
    {
      code: "CK006",
      checkInTime: null,
      checkOutTime: null,
      date: "2025-05-17T00:00:00.000Z",
      status: "vắng mặt",
      userCode: "NV001",
      userName: "Nguyễn Văn A",
      userRole: UserRole.MANAGER,
      branchCode: "CN001",
      branchName: "Chi nhánh Hà Nội",
      workingScheduleCode: "CA001",
      workingScheduleName: "Ca sáng (8:00 - 12:00)",
      company: "FPT Software",
    },
    {
      code: "CK007",
      checkInTime: "2025-05-18T09:30:00.000Z",
      checkOutTime: "2025-05-18T12:30:00.000Z",
      date: "2025-05-18T00:00:00.000Z",
      status: "đi trễ 1 giờ 30 phút",
      userCode: "NV003",
      userName: "Lê Văn C",
      userRole: UserRole.STAFF,
      branchCode: "CN003",
      branchName: "Chi nhánh Đà Nẵng",
      workingScheduleCode: "CA001",
      workingScheduleName: "Ca sáng (8:00 - 12:00)",
      company: "VNG Corporation",
    },
    {
      code: "CK008",
      checkInTime: "2025-05-19T13:00:00.000Z",
      checkOutTime: "2025-05-19T17:00:00.000Z",
      date: "2025-05-19T00:00:00.000Z",
      status: "đúng giờ",
      userCode: "NV005",
      userName: "Hoàng Văn E",
      userRole: UserRole.MANAGER,
      branchCode: "CN002",
      branchName: "Chi nhánh Hồ Chí Minh",
      workingScheduleCode: "CA002",
      workingScheduleName: "Ca chiều (13:00 - 17:00)",
      company: "Tiki",
    },
    {
      code: "CK009",
      checkInTime: null,
      checkOutTime: null,
      date: "2025-05-19T00:00:00.000Z",
      status: "vắng mặt",
      userCode: "NV002",
      userName: "Trần Thị B",
      userRole: UserRole.HR,
      branchCode: "CN002",
      branchName: "Chi nhánh Hồ Chí Minh",
      workingScheduleCode: "CA003",
      workingScheduleName: "Ca tối (18:00 - 22:00)",
      company: "Viettel",
    },
    {
      code: "CK010",
      checkInTime: "2025-05-20T08:45:00.000Z",
      checkOutTime: "2025-05-20T12:30:00.000Z",
      date: "2025-05-20T00:00:00.000Z",
      status: "đi trễ 45 phút",
      userCode: "NV004",
      userName: "Phạm Thị D",
      userRole: UserRole.STAFF,
      branchCode: "CN001",
      branchName: "Chi nhánh Hà Nội",
      workingScheduleCode: "CA001",
      workingScheduleName: "Ca sáng (8:00 - 12:00)",
      company: "MoMo",
    },
  ];

  const [quickSearch, setQuickSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<QuanLiChamCongItem[]>(sampleData);
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
              item.userName.toLowerCase().includes(searchTerm) ||
              item.workingScheduleName.toLowerCase().includes(searchTerm) ||
              item.branchName.toLowerCase().includes(searchTerm) ||
              item.company.toLowerCase().includes(searchTerm) ||
              item.userRole.toLowerCase().includes(searchTerm)
          );
        }

        // Apply filters if provided
        if (filters) {
          // Filter by branch code
          if (filters.branchCode) {
            filteredData = filteredData.filter(
              (item) => item.branchCode === filters.branchCode
            );
          }

          // Filter by working schedule code
          if (filters.workingScheduleCode) {
            filteredData = filteredData.filter(
              (item) => item.workingScheduleCode === filters.workingScheduleCode
            );
          }

          // Filter by status
          if (filters.status) {
            filteredData = filteredData.filter((item) =>
              item.status.includes(filters.status as string)
            );
          }

          // Filter by user role
          if (filters.userRole) {
            filteredData = filteredData.filter(
              (item) => item.userRole === filters.userRole
            );
          }

          // Filter by date
          if (filters.date) {
            const filterDate = filters.date.format("YYYY-MM-DD");
            filteredData = filteredData.filter((item) => {
              const itemDate = dayjs(item.date).format("YYYY-MM-DD");
              return itemDate === filterDate;
            });
          }

          // Filter by company
          if (filters.company) {
            filteredData = filteredData.filter(
              (item) => item.company === filters.company
            );
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

  const handleBeforeExport = async (): Promise<QuanLiChamCongItem[]> => {
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

  const columns = useMemo(
    () => [
      {
        title: t("maChamCong"),
        dataIndex: "code",
        key: "code",
        width: 120,
      },
      {
        title: t("hoVaTen"),
        dataIndex: "userName",
        key: "userName",
        width: 150,
      },
      {
        title: t("chucVu"),
        dataIndex: "userRole",
        key: "userRole",
        width: 100,
      },
      {
        title: t("congTy"),
        dataIndex: "company",
        key: "company",
        width: 150,
      },
      {
        title: t("chiNhanh"),
        dataIndex: "branchName",
        key: "branchName",
        width: 150,
      },
      {
        title: t("ngay"),
        dataIndex: "date",
        key: "date",
        width: 120,
        render: (date: string) => formatDate(date),
      },
      {
        title: t("caLamViec"),
        dataIndex: "workingScheduleName",
        key: "workingScheduleName",
        width: 180,
      },
      {
        title: t("gioVao"),
        dataIndex: "checkInTime",
        key: "checkInTime",
        width: 100,
        render: (checkInTime: string) => formatTime(checkInTime),
      },
      {
        title: t("gioRa"),
        dataIndex: "checkOutTime",
        key: "checkOutTime",
        width: 100,
        render: (checkOutTime: string) => formatTime(checkOutTime),
      },
      {
        title: t("trangThai"),
        dataIndex: "status",
        key: "status",
        width: 150,
        render: (status: string) => {
          const statusInfo = getStatusInfo(status);
          return (
            <Tag
              color={statusInfo.color}
              style={{
                borderRadius: "20px",
                padding: "4px 12px",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              {statusInfo.label}
            </Tag>
          );
        },
      },
    ],
    [t]
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
        <FilterSection
          onReset={resetFilters}
          onSearch={() => formFilter.submit()}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="date" label={t("ngay")}>
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder={t("chonNgay")}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="branchCode" label={t("chiNhanh")}>
                <Cselect
                  allowClear
                  showSearch
                  placeholder={t("chonChiNhanh")}
                  options={branchesData}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="workingScheduleCode" label={t("caLamViec")}>
                <Cselect
                  allowClear
                  showSearch
                  placeholder={t("chonCaLamViec")}
                  options={workingSchedulesData}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="status" label={t("trangThai")}>
                <Cselect
                  allowClear
                  showSearch
                  placeholder={t("chonTrangThai")}
                  options={statusOptions}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="userRole" label={t("chucVu")}>
                <Cselect
                  allowClear
                  showSearch
                  placeholder={t("chonChucVu")}
                  options={roleOptions}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="company" label={t("congTy")}>
                <Cselect
                  allowClear
                  showSearch
                  placeholder={t("chonCongTy")}
                  options={companiesData}
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
          rowKey="code"
          usePagination
          totalItems={totalItems}
          onPageChange={handlePageChange}
          enableDrag={true}
          pageSize={10}
          rowHeight={15}
          stickyHeader
          tableId="admin_quan_li_cham_cong_v3"
          onBeforeExport={handleBeforeExport}
        />
      </div>
    </>
  );
};

export default QuanLiChamCongPage;
