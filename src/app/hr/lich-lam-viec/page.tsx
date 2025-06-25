/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AppstoreOutlined,
  BarsOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  ProfileOutlined,
  ScheduleOutlined,
  TableOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Tag,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./index.scss";

// Import view components
import { SelectOptionsArray } from "@/dtos/select/select.dto";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import WorkingScheduleServices from "@/services/quan-li-lich-lam-viec/working-schedule.service";
import SelectServices from "@/services/select/select.service";
import { useSelector } from "react-redux";
import CardView from "./views/CardView";
import DailyView from "./views/DailyView";
import DetailView from "./views/DetailView";
import GanttView from "./views/GanttView";
import ListView from "./views/ListView";
import MonthlyView from "./views/MonthlyView";
import TimelineView from "./views/TimelineView";
import WeeklyView from "./views/WeeklyView";

// Transform API data format
const transformApiScheduleData = (apiData: any[]) => {
  return apiData.map((item, index) => {
    const checkinTime = item.checkInTime
      ? new Date(item.checkInTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : null;

    const checkoutTime = item.checkOutTime
      ? new Date(item.checkOutTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : null;

    // Extract date in YYYY-MM-DD format
    const date = item.date
      ? new Date(item.date).toISOString().split("T")[0]
      : dayjs().format("YYYY-MM-DD");

    // Map API status to our application status
    let status = "pending";
    if (item.status === "APPROVED") status = "confirmed";
    else if (item.status === "REJECTED") status = "cancelled";

    // Map attendance status
    let attendanceStatus = attendanceStatuses.NOT_STARTED;
    if (item.status === "COMPLETED")
      attendanceStatus = attendanceStatuses.COMPLETED;
    else if (item.status === "ABSENT")
      attendanceStatus = attendanceStatuses.ABSENT;

    // Extract or generate employee ID
    const employeeId = parseInt(item.userCode?.replace("USER", "") || "1");

    return {
      id: parseInt(item.id || index + 1),
      employeeId: employeeId,
      userCode: item.userCode,
      date: date,
      shift: item.shiftName || "Ca làm việc",
      startTime: item.startShiftTime,
      endTime: item.endShiftTime,
      status: item.status || status,
      statusTimeKeeping: item.statusTimeKeeping || null,
      checkinTime: checkinTime,
      checkoutTime: checkoutTime,
      attendanceStatus: attendanceStatus,
      note: "",
      code: item.code,
      userContractCode: item.userContractCode,
      fullName: item.fullName,
      shiftCode: item.shiftCode,
      branchName: item.branchName,
      branchCode: item.branchCode,
      addressLine: item.addressLine,
      positionName: item.positionName,
      managerFullName: item.managerFullName,
    };
  });
};

// Define attendance status types
const attendanceStatuses = {
  NOT_STARTED: "not_started",
  ON_TIME: "on_time",
  LATE: "late",
  ABSENT: "absent",
  EARLY_LEAVE: "early_leave",
  COMPLETED: "completed",
};

const WorkSchedulePage = () => {
  //   const t = useTranslations("WorkSchedule");
  const [viewType, setViewType] = useState<
    "day" | "week" | "month" | "list" | "card" | "gantt" | "timeline"
  >("week");
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs());
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentSchedule, setCurrentSchedule] = useState<any>(null);
  const [branchFilter, setBranchFilter] = useState<any>(null);
  const [detailView, setDetailView] = useState<boolean>(false);
  const [attendanceFilter, setAttendanceFilter] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [collapsedFilters, setCollapsedFilters] = useState(false);
  const [shiftList, setShiftList] = useState<SelectOptionsArray[]>([]);
  const { userProfile } = useSelector(selectAuthLogin);
  const userCode = Form.useWatch("userCode", form);
  const [branchList, setBranchList] = useState<SelectOptionsArray[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Get date range based on view type - moved here before it's used
  const getDateRange = () => {
    if (viewType === "day") {
      return {
        start: currentDate.startOf("day"),
        end: currentDate.endOf("day"),
      };
    } else if (viewType === "week") {
      return {
        start: currentDate.startOf("week"),
        end: currentDate.endOf("week"),
      };
    } else if (viewType === "month" || viewType === "gantt") {
      return {
        start: currentDate.startOf("month"),
        end: currentDate.endOf("month"),
      };
    } else if (
      viewType === "list" ||
      viewType === "card" ||
      viewType === "timeline"
    ) {
      // For these views, use the explicitly selected date range from the date pickers
      return {
        start: dateRange[0],
        end: dateRange[1],
      };
    } else {
      // Default fallback
      return {
        start: currentDate.startOf("month"),
        end: currentDate.endOf("month"),
      };
    }
  };

  // Now use getDateRange after it's defined
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(() => {
    // Initialize with current month if not set
    return [currentDate.startOf("month"), currentDate.endOf("month")];
  });
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const searchFilterEmployees: any = [
        { key: "limit", type: "=", value: 15 },
        { key: "offset", type: "=", value: 0 },
      ];
      const result = await WorkingScheduleServices.getSelectStaff(
        searchFilterEmployees,
        {
          quickSearch: "",
          userCode: userProfile.code,
        }
      );
      if (result.data) {
        setEmployeeList(result.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };
  const fetchSelect = async () => {
    try {
      const selectShift = await SelectServices.getSelectShift();
      setShiftList(selectShift);
      const selectBranch = await SelectServices.getSelectBrand();
      if (selectBranch) {
        setBranchFilter(selectBranch);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Không thể tải danh sách chi nhánh");
    }
  };
  // Fetch schedule data when date or employees change

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      // Get date range based on current view type
      const range = getDateRange();
      const fromDate = range.start.startOf("day").toISOString();
      const toDate = range.end.endOf("day").toISOString();

      const searchOwnweFilter: any = [
        { key: "limit", type: "=", value: 100 },
        { key: "offset", type: "=", value: 0 },
      ];

      const result = await WorkingScheduleServices.getWorkingSchedule(
        searchOwnweFilter,
        {
          fromDate,
          toDate,
        }
      );
      const transformedData = transformApiScheduleData(result.data);

      if (transformedData) {
        setScheduleData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Không thể tải lịch làm việc");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSchedules();
    fetchSelect();
    fetchEmployees();
  }, [selectedEmployees, selectedDepartment, currentDate, viewType, dateRange]);

  const fetchSelectBranchByCode = async () => {
    try {
      const selectBranchByUserCode = await SelectServices.getSelectBrand(
        userCode
      );
      setBranchList(selectBranchByUserCode);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Không thể tải danh sách chi nhánh");
    }
  };
  useEffect(() => {
    if (userCode) {
      fetchSelectBranchByCode();
    }
  }, [userCode]);

  const handleAddSchedule = async () => {
    setCurrentSchedule(null);
    console.log("form", form.getFieldsValue());
    setIsModalVisible(true);
  };

  const handleEditSchedule = (schedule: any) => {
    setCurrentSchedule(schedule);
    form.setFieldsValue({
      employeeId: schedule.employeeId,
      userCode: schedule.userCode,
      date: dayjs(schedule.date),
      shift: schedule.shift,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      status: schedule.status,
      branchCode: schedule.branchCode,
      checkinTime: schedule.checkinTime,
      checkoutTime: schedule.checkoutTime,
      attendanceStatus: schedule.attendanceStatus,
    });
    setIsModalVisible(true);
  };

  const handleViewSchedule = (schedule: any) => {
    setCurrentSchedule(schedule);
    setDetailView(true);
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    try {
      // await deleteScheduleService(scheduleId);
      setScheduleData(scheduleData.filter((s) => s.id !== scheduleId));
      toast.success("Xóa lịch làm việc thành công");
    } catch (error: any) {
      console.log("Error deleting schedule:", error);

      toast.error("Không thể xóa lịch làm việc");
    }
  };

  const handleSaveSchedule = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      if (currentSchedule) {
        // Update existing schedule
        const updatedSchedule = { ...currentSchedule, ...values };
        console.log("Updated schedule:", updatedSchedule);

        // await updateScheduleService(updatedSchedule);
        setScheduleData(
          scheduleData.map((s) =>
            s.id === currentSchedule.id ? updatedSchedule : s
          )
        );

        toast.success("Cập nhật lịch làm việc thành công");
      } else {
        values.date = dayjs(values.date).toISOString();
        try {
          console.log("Creating new schedule with values:", values);
          await WorkingScheduleServices.createWorkingSchedule(values);
          toast.success("Tạo lịch làm việc thành công");
          fetchSchedules();
        } catch (error) {
          console.error("Error creating schedule:", error);
          toast.error("Không thể tạo lịch làm việc");
        }
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error("Form validation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employeeList.find((e) => e.id === employeeId);
    return employee ? employee.name : "N/A";
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      ACTIVE: { color: "green", text: "Đang diễn ra" },
      NOTSTARTED: { color: "#1e40af", text: "Chưa bắt đầu" },
      END: { color: "red", text: "Kết thúc" },
      NOTWORK: { color: "orange", text: "Không chấm công" },
    };

    const statusInfo = statusMap[status] || { color: "default", text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const getAttendanceTag = (status: string) => {
    const statusMap: Record<
      string,
      { color: string; text: string; icon: React.ReactNode }
    > = {
      [attendanceStatuses.NOT_STARTED]: {
        color: "default",
        text: "Chưa bắt đầu",
        icon: <ClockCircleOutlined />,
      },
      [attendanceStatuses.ON_TIME]: {
        color: "green",
        text: "Đúng giờ",
        icon: <CheckCircleOutlined />,
      },
      [attendanceStatuses.LATE]: {
        color: "orange",
        text: "Đi trễ",
        icon: <WarningOutlined />,
      },
      [attendanceStatuses.ABSENT]: {
        color: "red",
        text: "Vắng mặt",
        icon: <CloseCircleOutlined />,
      },
      [attendanceStatuses.EARLY_LEAVE]: {
        color: "volcano",
        text: "Về sớm",
        icon: <ClockCircleOutlined />,
      },
      [attendanceStatuses.COMPLETED]: {
        color: "green",
        text: "Hoàn thành",
        icon: <CheckCircleOutlined />,
      },
    };

    const statusInfo = statusMap[status] || {
      color: "default",
      text: status,
      icon: null,
    };
    return (
      <Tag color={statusInfo.color} icon={statusInfo.icon}>
        {statusInfo.text}
      </Tag>
    );
  };

  // Helper functions for time calculations
  const calculateLateMinutes = (schedule: any) => {
    if (!schedule.checkinTime) return 0;

    const scheduledStart = dayjs(
      `${schedule.date} ${schedule.startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const actualCheckin = dayjs(
      `${schedule.date} ${schedule.checkinTime}`,
      "YYYY-MM-DD HH:mm"
    );

    const diffMinutes = actualCheckin.diff(scheduledStart, "minute");
    return diffMinutes > 0 ? diffMinutes : 0;
  };

  const calculateEarlyMinutes = (schedule: any) => {
    if (!schedule.checkoutTime) return 0;

    const scheduledEnd = dayjs(
      `${schedule.date} ${schedule.endTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const actualCheckout = dayjs(
      `${schedule.date} ${schedule.checkoutTime}`,
      "YYYY-MM-DD HH:mm"
    );

    const diffMinutes = scheduledEnd.diff(actualCheckout, "minute");
    return diffMinutes > 0 ? diffMinutes : 0;
  };

  const renderCollapsibleFilters = () => {
    const { Panel } = Collapse;

    return (
      <Collapse
        activeKey={collapsedFilters ? [] : ["filters"]}
        onChange={() => setCollapsedFilters(!collapsedFilters)}
        className="unified-filters-panel"
        ghost
        expandIcon={({ isActive }) => (
          <FilterOutlined
            style={{ color: "#3b82f6" }}
            rotate={isActive ? 0 : 0}
          />
        )}
      >
        <Panel
          header={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 600, color: "#ffffff" }}>
                Bộ lọc và tùy chọn hiển thị
              </span>
              <Button
                type="primary"
                icon={<ScheduleOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  form.resetFields();
                  form.setFieldsValue({
                    date: currentDate,
                  });
                  handleAddSchedule();
                }}
                size="middle"
                style={{
                  background:
                    "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(30, 64, 175, 0.3)",
                }}
              >
                Tạo lịch làm việc
              </Button>
            </div>
          }
          key="filters"
          showArrow={false}
        >
          <Row gutter={[16, 16]}>
            {/* View Type Selection */}
            <Col xs={24} lg={12}>
              <div className="filter-section">
                <label className="filter-label">Kiểu hiển thị:</label>
                <Radio.Group
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value)}
                  buttonStyle="solid"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Radio.Button
                    value="day"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <CalendarOutlined /> Ngày
                  </Radio.Button>
                  <Radio.Button
                    value="week"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <CalendarOutlined /> Tuần
                  </Radio.Button>
                  <Radio.Button
                    value="month"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <CalendarOutlined /> Tháng
                  </Radio.Button>
                  <Radio.Button
                    value="list"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <BarsOutlined /> Danh sách
                  </Radio.Button>
                </Radio.Group>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <div className="filter-section">
                <label className="filter-label">Chế độ xem khác:</label>
                <Radio.Group
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value)}
                  buttonStyle="solid"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Radio.Button
                    value="card"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <AppstoreOutlined /> Thẻ
                  </Radio.Button>
                  <Radio.Button
                    value="gantt"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <ProfileOutlined /> Gantt
                  </Radio.Button>
                  <Radio.Button
                    value="timeline"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <TableOutlined /> Timeline
                  </Radio.Button>
                </Radio.Group>
              </div>
            </Col>

            {/* Date Selection */}
            <Col xs={24} md={12} lg={8}>
              <div className="filter-section">
                <label className="filter-label">Thời gian:</label>
                {viewType === "day" && (
                  <DatePicker
                    value={currentDate}
                    onChange={(date) => date && setCurrentDate(date)}
                    format="DD/MM/YYYY"
                    allowClear={false}
                    size="middle"
                    placeholder="Chọn ngày"
                    style={{ width: "100%" }}
                  />
                )}
                {viewType === "week" && (
                  <DatePicker
                    value={currentDate}
                    onChange={(date) => date && setCurrentDate(date)}
                    format="DD/MM/YYYY"
                    allowClear={false}
                    picker="week"
                    size="middle"
                    placeholder="Chọn tuần"
                    style={{ width: "100%" }}
                  />
                )}
                {(viewType === "month" || viewType === "gantt") && (
                  <DatePicker
                    value={currentDate}
                    onChange={(date) => date && setCurrentDate(date)}
                    format="MM/YYYY"
                    allowClear={false}
                    picker="month"
                    size="middle"
                    placeholder="Chọn tháng"
                    style={{ width: "100%" }}
                  />
                )}
                {(viewType === "list" ||
                  viewType === "card" ||
                  viewType === "timeline") && (
                  <Space.Compact style={{ width: "100%" }}>
                    <DatePicker
                      value={dateRange[0]}
                      onChange={(date) => {
                        if (date) {
                          setDateRange([date, dateRange[1]]);
                          setCurrentDate(date);
                        }
                      }}
                      format="DD/MM/YYYY"
                      placeholder="Từ ngày"
                      size="middle"
                      style={{ width: "50%" }}
                    />
                    <DatePicker
                      value={dateRange[1]}
                      onChange={(date) => {
                        if (date) {
                          setDateRange([dateRange[0], date]);
                        }
                      }}
                      format="DD/MM/YYYY"
                      placeholder="Đến ngày"
                      size="middle"
                      style={{ width: "50%" }}
                    />
                  </Space.Compact>
                )}
              </div>
            </Col>

            {/* Department Filter */}
            <Col xs={24} md={12} lg={8}>
              <div className="filter-section">
                <label className="filter-label">Bộ phận:</label>
                <Select
                  placeholder="Chọn bộ phận"
                  style={{ width: "100%" }}
                  value={selectedDepartment}
                  onChange={setSelectedDepartment}
                  size="middle"
                  options={[
                    { value: "all", label: "Tất cả bộ phận" },
                    { value: "IT", label: "Công nghệ thông tin" },
                    { value: "HR", label: "Nhân sự" },
                    { value: "Marketing", label: "Marketing" },
                    { value: "Finance", label: "Tài chính" },
                  ]}
                />
              </div>
            </Col>

            {/* Employee Filter */}
            <Col xs={24} md={12} lg={8}>
              <div className="filter-section">
                <label className="filter-label">Nhân viên:</label>
                <Select
                  mode="multiple"
                  placeholder="Chọn nhân viên"
                  style={{ width: "100%" }}
                  value={selectedEmployees}
                  onChange={setSelectedEmployees}
                  allowClear
                  optionFilterProp="label"
                  size="middle"
                  maxTagCount="responsive"
                  options={employeeList}
                />
              </div>
            </Col>

            {/* Branch Filter */}
            <Col xs={24} md={12} lg={8}>
              <div className="filter-section">
                <label className="filter-label">Chi nhánh:</label>
                <Select
                  placeholder="Chọn chi nhánh"
                  style={{ width: "100%" }}
                  allowClear
                  size="middle"
                  options={branchFilter}
                />
              </div>
            </Col>

            {/* Attendance Status Filter */}
            <Col xs={24} md={12} lg={8}>
              <div className="filter-section">
                <label className="filter-label">Trạng thái chấm công:</label>
                <Select
                  placeholder="Chọn trạng thái"
                  style={{ width: "100%" }}
                  value={attendanceFilter}
                  onChange={setAttendanceFilter}
                  allowClear
                  onClear={() => setAttendanceFilter(null)}
                  size="middle"
                  options={[
                    {
                      value: attendanceStatuses.NOT_STARTED,
                      label: "Chưa bắt đầu",
                    },
                    { value: attendanceStatuses.ON_TIME, label: "Đúng giờ" },
                    { value: attendanceStatuses.LATE, label: "Đi trễ" },
                    { value: attendanceStatuses.ABSENT, label: "Vắng mặt" },
                    { value: attendanceStatuses.EARLY_LEAVE, label: "Về sớm" },
                    {
                      value: attendanceStatuses.COMPLETED,
                      label: "Hoàn thành",
                    },
                  ]}
                />
              </div>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    );
  };

  // Render the current view based on viewType
  const renderCurrentView = () => {
    const dateRange = getDateRange();

    switch (viewType) {
      case "day":
        return (
          <DailyView
            currentDate={currentDate}
            scheduleData={scheduleData}
            attendanceStatuses={attendanceStatuses}
            loading={loading}
            handleViewSchedule={handleViewSchedule}
            handleEditSchedule={handleEditSchedule}
            handleDeleteSchedule={handleDeleteSchedule}
            getAttendanceTag={getAttendanceTag}
            getStatusTag={getStatusTag}
          />
        );
      case "week":
        return (
          <WeeklyView
            dateRange={dateRange}
            scheduleData={scheduleData}
            selectedEmployees={selectedEmployees}
            selectedDepartment={selectedDepartment}
            attendanceStatuses={attendanceStatuses}
            attendanceFilter={attendanceFilter}
            form={form}
            handleViewSchedule={handleViewSchedule}
            handleAddSchedule={handleAddSchedule}
          />
        );
      case "month":
        return (
          <MonthlyView
            currentDate={currentDate}
            scheduleData={scheduleData}
            employeeList={employeeList}
            selectedEmployees={selectedEmployees}
            selectedDepartment={selectedDepartment}
            setCurrentDate={setCurrentDate}
            setViewType={setViewType}
            handleEditSchedule={handleEditSchedule}
            getEmployeeName={getEmployeeName}
          />
        );
      case "list":
        return (
          <ListView
            dateRange={dateRange}
            scheduleData={scheduleData}
            selectedEmployees={selectedEmployees}
            selectedDepartment={selectedDepartment}
            handleEditSchedule={handleEditSchedule}
            handleDeleteSchedule={handleDeleteSchedule}
            getStatusTag={getStatusTag}
          />
        );
      case "card":
        return (
          <CardView
            dateRange={dateRange}
            scheduleData={scheduleData}
            selectedEmployees={selectedEmployees}
            selectedDepartment={selectedDepartment}
            currentDate={currentDate}
            form={form}
            handleAddSchedule={handleAddSchedule}
            handleEditSchedule={handleEditSchedule}
            getStatusTag={getStatusTag}
          />
        );
      case "gantt":
        return (
          <GanttView
            dateRange={dateRange}
            scheduleData={scheduleData}
            selectedEmployees={selectedEmployees}
            selectedDepartment={selectedDepartment}
            form={form}
            handleAddSchedule={handleAddSchedule}
            handleEditSchedule={handleEditSchedule}
          />
        );
      case "timeline":
        return (
          <TimelineView
            dateRange={dateRange}
            scheduleData={scheduleData}
            employeeList={employeeList}
            selectedEmployees={selectedEmployees}
            selectedDepartment={selectedDepartment}
            handleEditSchedule={handleEditSchedule}
            getStatusTag={getStatusTag}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="work-schedule-page">
      {detailView ? (
        <DetailView
          currentSchedule={currentSchedule}
          employeeList={employeeList}
          scheduleData={scheduleData}
          setDetailView={setDetailView}
          handleEditSchedule={handleEditSchedule}
          handleDeleteSchedule={handleDeleteSchedule}
          handleViewSchedule={handleViewSchedule}
          getAttendanceTag={getAttendanceTag}
          getStatusTag={getStatusTag}
          calculateLateMinutes={calculateLateMinutes}
          calculateEarlyMinutes={calculateEarlyMinutes}
        />
      ) : (
        <div className="schedule-layout">
          {/* Unified Collapsible Filters */}
          <div className="filters-container">{renderCollapsibleFilters()}</div>

          {/* Main Schedule Content - 70% height */}
          <div className="schedule-content-container">
            {renderCurrentView()}
          </div>
        </div>
      )}

      <Modal
        title={
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#667eea",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ScheduleOutlined />
            {currentSchedule
              ? "Chỉnh sửa lịch làm việc"
              : "Tạo lịch làm việc mới"}
          </div>
        }
        open={isModalVisible}
        confirmLoading={isLoading}
        onOk={handleSaveSchedule}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        className="schedule-detail-modal-enhanced"
        okText={currentSchedule ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy bỏ"
        okButtonProps={{
          size: "large",
          style: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
          },
        }}
        cancelButtonProps={{
          size: "large",
          style: {
            borderRadius: "8px",
            fontWeight: 500,
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          size="large"
          initialValues={{
            optionCreate: "NGAY",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "24px",
              border: "1px solid rgba(102, 126, 234, 0.1)",
            }}
          >
            <h4
              style={{
                margin: "0 0 16px 0",
                color: "#667eea",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              Thông tin cơ bản
            </h4>

            <Form.Item
              name="userCode"
              label={<span style={{ fontWeight: 600 }}>Nhân viên</span>}
              rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
            >
              <Select
                placeholder="Chọn nhân viên"
                showSearch
                optionFilterProp="label"
                options={employeeList}
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>

            <Form.Item
              name="date"
              label={<span style={{ fontWeight: 600 }}>Ngày làm việc</span>}
              rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%", borderRadius: "8px" }}
                placeholder="Chọn ngày làm việc"
              />
            </Form.Item>

            <Space.Compact style={{ width: "100%" }}>
              <Form.Item
                name="shiftCode"
                label={<span style={{ fontWeight: 600 }}>Ca làm việc</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập ca làm việc" },
                ]}
                style={{ flex: 1, marginRight: "8px" }}
              >
                <Select
                  placeholder="Chọn ca làm việc"
                  options={shiftList}
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <Form.Item
                name="branchCode"
                label={<span style={{ fontWeight: 600 }}>Chi nhánh</span>}
                rules={[{ required: true, message: "Vui lòng chọn chi nhánh" }]}
                style={{ flex: 1, marginLeft: "8px" }}
              >
                <Select
                  placeholder="Chọn chi nhánh"
                  showSearch
                  optionFilterProp="label"
                  options={branchList}
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Space.Compact>
            <Space.Compact style={{ width: "100%" }}>
              <Form.Item
                name="optionCreate"
                label={<span style={{ fontWeight: 600 }}>Chế độ tạo</span>}
                style={{ flex: 1, marginLeft: "8px" }}
              >
                <Select
                  placeholder="Chọn chế độ tạo"
                  showSearch
                  optionFilterProp="label"
                  options={[
                    { value: "NGAY", label: "Tạo 1 ngày" },
                    { value: "TUAN", label: "Tạo 1 tuần" },
                    { value: "THANG", label: "Tạo 1 tháng" },
                  ]}
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
              <Form.Item
                name="holidayMode"
                label={<span style={{ fontWeight: 600 }}>Chế ngày nghỉ</span>}
                style={{ flex: 1, marginLeft: "8px" }}
              >
                <Select
                  placeholder="Chọn ngày nghỉ"
                  showSearch
                  mode="multiple"
                  optionFilterProp="label"
                  options={[
                    { value: "T2", label: "Thứ 2" },
                    { value: "T3", label: "Thứ 3" },
                    { value: "T4", label: "Thứ 4" },
                    { value: "T5", label: "Thứ 5" },
                    { value: "T6", label: "Thứ 6" },
                    { value: "T7", label: "Thứ 7" },
                    { value: "CN", label: "Chủ Nhật" },
                  ]}
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Space.Compact>
          </div>

          {currentSchedule && (
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(250, 173, 20, 0.05) 0%, rgba(255, 193, 7, 0.05) 100%)",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid rgba(250, 173, 20, 0.1)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 16px 0",
                  color: "#fa8c16",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                Thông tin chấm công
              </h4>

              <Space.Compact style={{ width: "100%" }}>
                <Form.Item
                  name="checkinTime"
                  label={<span style={{ fontWeight: 600 }}>Giờ check-in</span>}
                  style={{ flex: 1, marginRight: "8px" }}
                >
                  <Input
                    placeholder="VD: 08:05"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Item>

                <Form.Item
                  name="checkoutTime"
                  label={<span style={{ fontWeight: 600 }}>Giờ check-out</span>}
                  style={{ flex: 1, marginLeft: "8px" }}
                >
                  <Input
                    placeholder="VD: 17:00"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Item>
              </Space.Compact>

              <Form.Item
                name="attendanceStatus"
                label={
                  <span style={{ fontWeight: 600 }}>Trạng thái chấm công</span>
                }
              >
                <Select
                  placeholder="Chọn trạng thái"
                  style={{ borderRadius: "8px" }}
                  options={[
                    {
                      value: attendanceStatuses.NOT_STARTED,
                      label: "🕐 Chưa bắt đầu",
                    },
                    {
                      value: attendanceStatuses.ON_TIME,
                      label: "✅ Đúng giờ",
                    },
                    {
                      value: attendanceStatuses.LATE,
                      label: "⏰ Đi trễ",
                    },
                    {
                      value: attendanceStatuses.ABSENT,
                      label: "❌ Vắng mặt",
                    },
                    {
                      value: attendanceStatuses.EARLY_LEAVE,
                      label: "🏃 Về sớm",
                    },
                    {
                      value: attendanceStatuses.COMPLETED,
                      label: "🎉 Hoàn thành",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="note"
                label={<span style={{ fontWeight: 600 }}>Ghi chú</span>}
              >
                <Input.TextArea
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={3}
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default WorkSchedulePage;
