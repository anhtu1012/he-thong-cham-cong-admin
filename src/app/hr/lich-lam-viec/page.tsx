"use client";

import CInputLabel from "@/components/basicUI/CInputLabel";
import Ctable from "@/components/basicUI/Ctable";
import FilterSection from "@/components/basicUI/FilterSection";
import { Tooltip, Button, Space, Form, Row, Col, DatePicker } from "antd";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "./index.scss";
import {
  CalendarOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Cselect from "@/components/Cselect";
import styles from "../../../components/styles/styles.module.scss";

// Sample data interface for WorkingSchedule based on the ERD
interface WorkingScheduleItem {
  id: string;
  code: string;
  userCode: string;
  userContractCode: string;
  date: string;
  shiftCode: string;
  userName?: string;
  shiftName?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
  department?: string;
}

// Format date function
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  return dayjs(dateString).format("DD/MM/YYYY");
};

// Sample department options
const departmentOptions = [
  { value: "IT", label: "Phòng IT" },
  { value: "HR", label: "Phòng Nhân sự" },
  { value: "FINANCE", label: "Phòng Tài chính" },
  { value: "SALES", label: "Phòng Kinh doanh" },
  { value: "MARKETING", label: "Phòng Marketing" },
];

// Sample shift options
const shiftOptions = [
  { value: "SHIFT001", label: "Ca sáng (08:00 - 12:00)" },
  { value: "SHIFT002", label: "Ca chiều (13:30 - 17:30)" },
  { value: "SHIFT003", label: "Ca tối (18:00 - 22:00)" },
  { value: "SHIFT004", label: "Ca đêm (22:00 - 06:00)" },
  { value: "SHIFT005", label: "Ca hành chính (08:00 - 17:30)" },
];

interface FilterValues {
  date?: dayjs.Dayjs;
  month?: dayjs.Dayjs;
  year?: dayjs.Dayjs;
  shiftCode?: string;
  department?: string;
  userCode?: string;
}

const LichLamViecPage = () => {
  // Sample data
  const sampleData: WorkingScheduleItem[] = [
    {
      id: "1",
      code: "WS001",
      userCode: "NV001",
      userContractCode: "HD001",
      date: "2025-05-15",
      shiftCode: "SHIFT001",
      userName: "Nguyễn Văn A",
      shiftName: "Ca sáng",
      shiftStartTime: "08:00",
      shiftEndTime: "12:00",
      department: "IT",
    },
    {
      id: "2",
      code: "WS002",
      userCode: "NV002",
      userContractCode: "HD002",
      date: "2025-05-15",
      shiftCode: "SHIFT002",
      userName: "Trần Thị B",
      shiftName: "Ca chiều",
      shiftStartTime: "13:30",
      shiftEndTime: "17:30",
      department: "HR",
    },
    {
      id: "3",
      code: "WS003",
      userCode: "NV003",
      userContractCode: "HD003",
      date: "2025-05-16",
      shiftCode: "SHIFT003",
      userName: "Lê Văn C",
      shiftName: "Ca tối",
      shiftStartTime: "18:00",
      shiftEndTime: "22:00",
      department: "SALES",
    },
    {
      id: "4",
      code: "WS004",
      userCode: "NV004",
      userContractCode: "HD004",
      date: "2025-05-16",
      shiftCode: "SHIFT004",
      userName: "Phạm Thị D",
      shiftName: "Ca đêm",
      shiftStartTime: "22:00",
      shiftEndTime: "06:00",
      department: "MARKETING",
    },
    {
      id: "5",
      code: "WS005",
      userCode: "NV005",
      userContractCode: "HD005",
      date: "2025-05-17",
      shiftCode: "SHIFT005",
      userName: "Hoàng Văn E",
      shiftName: "Ca hành chính",
      shiftStartTime: "08:00",
      shiftEndTime: "17:30",
      department: "FINANCE",
    },
  ];

  // Employee options based on the data
  const employeeOptions = [
    { value: "NV001", label: "Nguyễn Văn A" },
    { value: "NV002", label: "Trần Thị B" },
    { value: "NV003", label: "Lê Văn C" },
    { value: "NV004", label: "Phạm Thị D" },
    { value: "NV005", label: "Hoàng Văn E" },
  ];

  const [quickSearch, setQuickSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<WorkingScheduleItem[]>(sampleData);
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
              item.userCode.toLowerCase().includes(searchTerm) ||
              (item.userName &&
                item.userName.toLowerCase().includes(searchTerm))
          );
        }

        // Apply filters if provided
        if (filters) {
          // Filter by date
          if (filters.date) {
            const filterDate = filters.date.format("YYYY-MM-DD");
            filteredData = filteredData.filter((item) => {
              return item.date === filterDate;
            });
          }

          // Filter by month and year if specific date not selected
          if (!filters.date && filters.month) {
            const filterMonth = filters.month.month();
            const filterYear = filters.month.year();
            filteredData = filteredData.filter((item) => {
              const itemDate = dayjs(item.date);
              return (
                itemDate.month() === filterMonth &&
                itemDate.year() === filterYear
              );
            });
          }

          // Filter by year only if neither date nor month selected
          if (!filters.date && !filters.month && filters.year) {
            const filterYear = filters.year.year();
            filteredData = filteredData.filter((item) => {
              const itemDate = dayjs(item.date);
              return itemDate.year() === filterYear;
            });
          }

          // Filter by shift code
          if (filters.shiftCode) {
            filteredData = filteredData.filter(
              (item) => item.shiftCode === filters.shiftCode
            );
          }

          // Filter by department
          if (filters.department) {
            filteredData = filteredData.filter(
              (item) => item.department === filters.department
            );
          }

          // Filter by user code
          if (filters.userCode) {
            filteredData = filteredData.filter(
              (item) => item.userCode === filters.userCode
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

  const handleBeforeExport = async (): Promise<WorkingScheduleItem[]> => {
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

  const handleViewDetails = (record: WorkingScheduleItem) => {
    // In a real application, this would open a modal or navigate to a details page
    toast.info(`Xem chi tiết lịch làm việc: ${record.code}`);
  };

  const handleEdit = (record: WorkingScheduleItem) => {
    // In a real application, this would open a modal for editing
    toast.info(`Chỉnh sửa lịch làm việc: ${record.code}`);
  };

  const handleDelete = (record: WorkingScheduleItem) => {
    // In a real application, this would make an API call to delete the record
    const updatedData = tableData.filter((item) => item.id !== record.id);
    setTableData(updatedData);
    toast.success(`Đã xóa lịch làm việc: ${record.code}`);
  };

  const columns = useMemo(
    () => [
      {
        title: "Mã lịch",
        dataIndex: "code",
        key: "code",
        width: 100,
      },
      {
        title: "Nhân viên",
        dataIndex: "userName",
        key: "userName",
        width: 150,
      },
      {
        title: "Mã nhân viên",
        dataIndex: "userCode",
        key: "userCode",
        width: 120,
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
        title: "Ngày",
        dataIndex: "date",
        key: "date",
        width: 120,
        render: (date: string) => formatDate(date),
      },
      {
        title: "Ca làm việc",
        dataIndex: "shiftName",
        key: "shiftName",
        width: 150,
      },
      {
        title: "Giờ bắt đầu",
        dataIndex: "shiftStartTime",
        key: "shiftStartTime",
        width: 120,
        render: (time: string) => time,
      },
      {
        title: "Giờ kết thúc",
        dataIndex: "shiftEndTime",
        key: "shiftEndTime",
        width: 120,
        render: (time: string) => time,
      },
      {
        title: "Mã hợp đồng",
        dataIndex: "userContractCode",
        key: "userContractCode",
        width: 120,
      },
    ],
    []
  );

  // Define action column for our table
  const actionColumn = useMemo(
    () => ({
      fixed: "right",
      width: 120,
      render: (record: WorkingScheduleItem) => {
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

            {/* Edit button */}
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined style={{ color: "#faad14" }} />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>

            {/* Delete button */}
            <Tooltip title="Xóa">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    }),
    [tableData]
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
              <Form.Item name="date" label="Ngày">
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="month" label="Tháng">
                <DatePicker
                  style={{ width: "100%" }}
                  picker="month"
                  format="MM/YYYY"
                  placeholder="Chọn tháng"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="year" label="Năm">
                <DatePicker
                  style={{ width: "100%" }}
                  picker="year"
                  format="YYYY"
                  placeholder="Chọn năm"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="shiftCode" label="Ca làm việc">
                <Cselect
                  allowClear
                  showSearch
                  placeholder="Chọn ca làm việc"
                  options={shiftOptions}
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

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item name="userCode" label="Nhân viên">
                <Cselect
                  allowClear
                  showSearch
                  placeholder="Chọn nhân viên"
                  options={employeeOptions}
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
              label="Tìm kiếm"
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
          <div>
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() => toast.info("Thêm mới lịch làm việc")}
            >
              Thêm mới
            </Button>
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
          tableId="hr_lich_lam_viec"
          onBeforeExport={handleBeforeExport}
          scroll={{ x: 1200 }}
        />
      </div>
    </>
  );
};

export default LichLamViecPage;
