/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AppstoreOutlined,
  BarsOutlined,
  CalendarOutlined,
  ProfileOutlined,
  ScheduleOutlined,
  TableOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Tag,
  Space,
  Collapse,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./index.scss";

// Import view components
import DailyView from "./views/DailyView";
import WeeklyView from "./views/WeeklyView";
import MonthlyView from "./views/MonthlyView";
import ListView from "./views/ListView";
import CardView from "./views/CardView";
import GanttView from "./views/GanttView";
import TimelineView from "./views/TimelineView";
import DetailView from "./views/DetailView";
import WorkingScheduleServices from "@/services/quan-li-lich-lam-viec/working-schedule.service";

// Sample API response data
// const sampleApiResponse = {
//   count: 8,
//   limit: 100,
//   page: 1,
//   data: [
//     {
//       id: "4",
//       createdAt: "2025-06-11T18:00:28.822Z",
//       updatedAt: "2025-06-11T18:00:28.822Z",
//       code: "WS2506110009",
//       userCode: "USER2506100002",
//       userContractCode: "CONTRACT2506100005",
//       status: "NOTSTARTED",
//       date: "2025-06-11T17:50:16.000Z",
//       fullName: "Họ Staff Tên Viên",
//       shiftCode: "SHIFT001",
//       shiftName: "Ca fullday",
//       branchName: "Chi nhánh Nhà Văn Hóa",
//       branchCode: "BRANCH2506080001",
//       addressLine: "Nhà văn hóa sinh viên, Thử Đức, TP. Hồ Chí Minh",
//       startShiftTime: "1970-01-01T09:00:00.000Z",
//       endShiftTime: "1970-01-01T17:00:00.000Z",
//       checkInTime: null,
//       checkOutTime: null,
//       positionName: "thu duc",
//       fullNameManagerBy: "Pham HR",
//     },
//     {
//       id: "5",
//       createdAt: "2025-06-11T18:10:00.000Z",
//       updatedAt: "2025-06-11T18:10:00.000Z",
//       code: "WS2506110010",
//       userCode: "USER2506100002",
//       userContractCode: "CONTRACT2506100005",
//       status: "NOTSTARTED",
//       date: "2025-06-12T08:00:00.000Z",
//       fullName: "Họ Staff Tên Viên",
//       shiftCode: "SHIFT001",
//       shiftName: "Ca fullday",
//       branchName: "Chi nhánh Nhà Văn Hóa",
//       branchCode: "BRANCH2506080001",
//       addressLine: "Nhà văn hóa sinh viên, Thử Đức, TP. Hồ Chí Minh",
//       startShiftTime: "1970-01-01T09:00:00.000Z",
//       endShiftTime: "1970-01-01T17:00:00.000Z",
//       checkInTime: null,
//       checkOutTime: null,
//       positionName: "thu duc",
//       fullNameManagerBy: "Pham HR",
//     },
//     {
//       id: "6",
//       createdAt: "2025-06-11T18:20:00.000Z",
//       updatedAt: "2025-06-11T18:20:00.000Z",
//       code: "WS2506110011",
//       userCode: "USER2506100003",
//       userContractCode: "CONTRACT2506100006",
//       status: "NOTSTARTED",
//       date: "2025-06-13T08:00:00.000Z",
//       fullName: "Nguyễn Văn A",
//       shiftCode: "SHIFT001",
//       shiftName: "Ca fullday",
//       branchName: "Chi nhánh Tân Bình",
//       branchCode: "BRANCH2506080002",
//       addressLine: "123 Lê Văn Sỹ, Tân Bình, TP. Hồ Chí Minh",
//       startShiftTime: "1970-01-01T09:00:00.000Z",
//       endShiftTime: "1970-01-01T17:00:00.000Z",
//       checkInTime: null,
//       checkOutTime: null,
//       positionName: "tân bình",
//       fullNameManagerBy: "Nguyen HR",
//     },
//     {
//       id: "7",
//       createdAt: "2025-06-11T18:30:00.000Z",
//       updatedAt: "2025-06-11T18:30:00.000Z",
//       code: "WS2506110012",
//       userCode: "USER2506100003",
//       userContractCode: "CONTRACT2506100006",
//       status: "NOTSTARTED",
//       date: "2025-06-14T08:00:00.000Z",
//       fullName: "Nguyễn Văn A",
//       shiftCode: "SHIFT001",
//       shiftName: "Ca fullday",
//       branchName: "Chi nhánh Tân Bình",
//       branchCode: "BRANCH2506080002",
//       addressLine: "123 Lê Văn Sỹ, Tân Bình, TP. Hồ Chí Minh",
//       startShiftTime: "1970-01-01T09:00:00.000Z",
//       endShiftTime: "1970-01-01T17:00:00.000Z",
//       checkInTime: null,
//       checkOutTime: null,
//       positionName: "tân bình",
//       fullNameManagerBy: "Nguyen HR",
//     },
//     {
//       id: "8",
//       createdAt: "2025-06-11T18:40:00.000Z",
//       updatedAt: "2025-06-11T18:40:00.000Z",
//       code: "WS2506110013",
//       userCode: "USER2506100004",
//       userContractCode: "CONTRACT2506100007",
//       status: "NOTSTARTED",
//       date: "2025-06-15T08:00:00.000Z",
//       fullName: "Lê Thị B",
//       shiftCode: "SHIFT001",
//       shiftName: "Ca fullday",
//       branchName: "Chi nhánh Gò Vấp",
//       branchCode: "BRANCH2506080003",
//       addressLine: "45 Quang Trung, Gò Vấp, TP. Hồ Chí Minh",
//       startShiftTime: "1970-01-01T09:00:00.000Z",
//       endShiftTime: "1970-01-01T17:00:00.000Z",
//       checkInTime: null,
//       checkOutTime: null,
//       positionName: "gò vấp",
//       fullNameManagerBy: "Tran HR",
//     },
//     {
//       id: "9",
//       createdAt: "2025-06-11T18:50:00.000Z",
//       updatedAt: "2025-06-11T18:50:00.000Z",
//       code: "WS2506110014",
//       userCode: "USER2506100004",
//       userContractCode: "CONTRACT2506100007",
//       status: "NOTSTARTED",
//       date: "2025-06-16T08:00:00.000Z",
//       fullName: "Lê Thị B",
//       shiftCode: "SHIFT001",
//       shiftName: "Ca fullday",
//       branchName: "Chi nhánh Gò Vấp",
//       branchCode: "BRANCH2506080003",
//       addressLine: "45 Quang Trung, Gò Vấp, TP. Hồ Chí Minh",
//       startShiftTime: "1970-01-01T09:00:00.000Z",
//       endShiftTime: "1970-01-01T17:00:00.000Z",
//       checkInTime: null,
//       checkOutTime: null,
//       positionName: "gò vấp",
//       fullNameManagerBy: "Tran HR",
//     },
//     {
//       id: "10",
//       createdAt: "2025-06-11T19:00:00.000Z",
//       updatedAt: "2025-06-11T19:00:00.000Z",
//       code: "WS2506110015",
//       userCode: "USER2506100005",
//       userContractCode: "CONTRACT2506100008",
//       status: "NOTSTARTED",
//       date: "2025-06-17T08:00:00.000Z",
//       fullName: "Trần Văn C",
//       shiftCode: "SHIFT001",
//       shiftName: "Ca fullday",
//       branchName: "Chi nhánh Bình Thạnh",
//       branchCode: "BRANCH2506080004",
//       addressLine: "78 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh",
//       startShiftTime: "1970-01-01T09:00:00.000Z",
//       endShiftTime: "1970-01-01T17:00:00.000Z",
//       checkInTime: null,
//       checkOutTime: null,
//       positionName: "bình thạnh",
//       fullNameManagerBy: "Vo HR",
//     },
//     {
//       id: "11",
//       createdAt: "2025-06-11T19:10:00.000Z",
//       updatedAt: "2025-06-11T19:10:00.000Z",
//       code: "WS2506110016",
//       userCode: "USER2506100005",
//       userContractCode: "CONTRACT2506100008",
//       status: "NOTSTARTED",
//       date: "2025-06-18T08:00:00.000Z",
//       fullName: "Trần Văn C",
//       shiftCode: "SHIFT001",
//       shiftName: "Ca fullday",
//       branchName: "Chi nhánh Bình Thạnh",
//       branchCode: "BRANCH2506080004",
//       addressLine: "78 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh",
//       startShiftTime: "1970-01-01T09:00:00.000Z",
//       endShiftTime: "1970-01-01T17:00:00.000Z",
//       checkInTime: null,
//       checkOutTime: null,
//       positionName: "bình thạnh",
//       fullNameManagerBy: "Vo HR",
//     },
//   ],
// };

// Transform API data format
const transformApiScheduleData = (apiData: any[]) => {
  return apiData.map((item, index) => {
    // Extract time portions from the datetime strings
    const startTime = item.startShiftTime
      ? new Date(item.startShiftTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "08:00";

    const endTime = item.endShiftTime
      ? new Date(item.endShiftTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "17:00";

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

    // Find branch from API data if available, otherwise use random
    let branchId = Math.floor(Math.random() * branches.length) + 1;

    // Try to find an existing branch with matching name
    if (item.branchName) {
      const existingBranch = branches.find((b) => b.name === item.branchName);
      if (existingBranch) {
        branchId = existingBranch.id;
      }
    }

    // Extract or generate employee ID
    const employeeId = parseInt(item.userCode?.replace("USER", "") || "1");

    return {
      id: parseInt(item.id || index + 1),
      employeeId: employeeId,
      date: date,
      shift: item.shiftName || "Ca làm việc",
      startTime: startTime,
      endTime: endTime,
      status: status,
      branchId: branchId,
      checkinTime: checkinTime,
      checkoutTime: checkoutTime,
      attendanceStatus: attendanceStatus,
      note: "",
      // Original API data fields
      code: item.code,
      userCode: item.userCode,
      userContractCode: item.userContractCode,
      fullName: item.fullName,
      shiftCode: item.shiftCode,
      // New fields from updated API
      branchName: item.branchName,
      branchCode: item.branchCode,
      addressLine: item.addressLine,
      positionName: item.positionName,
      fullNameManagerBy: item.fullNameManagerBy,
    };
  });
};

// Replace the mockGetScheduleData function with a simpler version
// const mockGetScheduleData = async () => {
//   // In a real implementation, this would be an API call to fetch data
//   // For now, we just use the sample data and transform it

//   return {
//     data: transformedData,
//   };
// };

// Define branch data
const branches = [
  {
    id: 1,
    name: "Chi nhánh Quận 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  },
  { id: 2, name: "Chi nhánh Quận 2", address: "456 Thảo Điền, Quận 2, TP.HCM" },
  {
    id: 3,
    name: "Chi nhánh Quận 7",
    address: "789 Nguyễn Lương Bằng, Quận 7, TP.HCM",
  },
  {
    id: 4,
    name: "Chi nhánh Hà Nội",
    address: "101 Bà Triệu, Hai Bà Trưng, Hà Nội",
  },
  {
    id: 5,
    name: "Chi nhánh Đà Nẵng",
    address: "202 Bạch Đằng, Hải Châu, Đà Nẵng",
  },
];

// Define attendance status types
const attendanceStatuses = {
  NOT_STARTED: "not_started",
  ON_TIME: "on_time",
  LATE: "late",
  ABSENT: "absent",
  EARLY_LEAVE: "early_leave",
  COMPLETED: "completed",
};

// Function to calculate attendance status based on check-in/out times
// const calculateAttendanceStatus = (schedule: any) => {
//   if (!schedule.checkinTime && !schedule.checkoutTime) {
//     return attendanceStatuses.NOT_STARTED;
//   }

//   const scheduledStart = dayjs(
//     `${schedule.date} ${schedule.startTime}`,
//     "YYYY-MM-DD HH:mm"
//   );
//   const scheduledEnd = dayjs(
//     `${schedule.date} ${schedule.endTime}`,
//     "YYYY-MM-DD HH:mm"
//   );

//   if (schedule.checkinTime && !schedule.checkoutTime) {
//     // Only checked in
//     const checkin = dayjs(
//       `${schedule.date} ${schedule.checkinTime}`,
//       "YYYY-MM-DD HH:mm"
//     );
//     if (checkin.isAfter(scheduledStart.add(15, "minute"))) {
//       return attendanceStatuses.LATE;
//     }
//     return attendanceStatuses.ON_TIME;
//   }

//   if (schedule.checkinTime && schedule.checkoutTime) {
//     // Both checked in and out
//     const checkin = dayjs(
//       `${schedule.date} ${schedule.checkinTime}`,
//       "YYYY-MM-DD HH:mm"
//     );
//     const checkout = dayjs(
//       `${schedule.date} ${schedule.checkoutTime}`,
//       "YYYY-MM-DD HH:mm"
//     );

//     if (checkin.isAfter(scheduledStart.add(15, "minute"))) {
//       if (checkout.isBefore(scheduledEnd.subtract(15, "minute"))) {
//         return attendanceStatuses.EARLY_LEAVE;
//       }
//       return attendanceStatuses.LATE;
//     }

//     if (checkout.isBefore(scheduledEnd.subtract(15, "minute"))) {
//       return attendanceStatuses.EARLY_LEAVE;
//     }

//     return attendanceStatuses.COMPLETED;
//   }

//   return attendanceStatuses.NOT_STARTED;
// };

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
  const [branchFilter, setBranchFilter] = useState<number | null>(null);
  const [detailView, setDetailView] = useState<boolean>(false);
  const [attendanceFilter, setAttendanceFilter] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [collapsedFilters, setCollapsedFilters] = useState(false);

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
    } else {
      return {
        start: currentDate.startOf("month"),
        end: currentDate.endOf("month"),
      };
    }
  };

  // Now use getDateRange after it's defined
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(() => {
    const range = getDateRange();
    return [range.start, range.end];
  });

  // Fetch employee list
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const result = {
          data: [
            // {
            //   id: 4,
            //   name: "Họ Staff Tên Viên",
            //   department: "Kỹ thuật",
            //   avatar: "https://example.com/avatar1.jpg",
            // },
          ],
        };
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

    fetchEmployees();
  }, []);

  // Fetch schedule data when date or employees change
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        console.log("dateRange", dateRange);

        // Calculate fromDate and toDate based on viewType
        let fromDate, toDate;

        if (
          viewType === "list" ||
          viewType === "card" ||
          viewType === "gantt" ||
          viewType === "timeline"
        ) {
          fromDate = dateRange[0]
            ? dateRange[0].startOf("day").toISOString()
            : undefined;
          toDate = dateRange[1]
            ? dateRange[1].endOf("day").toISOString()
            : undefined;
        } else {
          const range = getDateRange();
          fromDate = range.start.startOf("day").toISOString();
          toDate = range.end.endOf("day").toISOString();
        }

        console.log(
          "Using date range:",
          dayjs(fromDate).format("YYYY-MM-DD hh:mm:ss"),
          "to",
          dayjs(toDate).format("YYYY-MM-DD hh:mm:ss")
        );

        const searchOwnweFilter: any = [
          { key: "limit", type: "=", value: 100 },
          { key: "offset", type: "=", value: 0 },
        ];

        const result = await WorkingScheduleServices.getWorkingSchedule(
          searchOwnweFilter,
          {
            ...(fromDate ? { fromDate } : {}),
            ...(toDate ? { toDate } : {}),
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

    fetchSchedules();
  }, [selectedEmployees, selectedDepartment, currentDate, viewType, dateRange]);

  const handleAddSchedule = () => {
    setCurrentSchedule(null);
    form.resetFields();
    form.setFieldsValue({
      date: currentDate,
    });
    setIsModalVisible(true);
  };

  const handleEditSchedule = (schedule: any) => {
    setCurrentSchedule(schedule);
    form.setFieldsValue({
      employeeId: schedule.employeeId,
      date: dayjs(schedule.date),
      shift: schedule.shift,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      status: schedule.status,
      branchId: schedule.branchId,
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
      const values = await form.validateFields();
      if (currentSchedule) {
        // Update existing schedule
        const updatedSchedule = { ...currentSchedule, ...values };
        // await updateScheduleService(updatedSchedule);
        setScheduleData(
          scheduleData.map((s) =>
            s.id === currentSchedule.id ? updatedSchedule : s
          )
        );
        toast.success("Cập nhật lịch làm việc thành công");
      } else {
        // Create new schedule
        const newSchedule = {
          id: Date.now(),
          ...values,
          status: "pending",
        };
        // await createScheduleService(newSchedule);
        setScheduleData([...scheduleData, newSchedule]);
        toast.success("Tạo lịch làm việc thành công");
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employeeList.find((e) => e.id === employeeId);
    return employee ? employee.name : "N/A";
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      confirmed: { color: "green", text: "Đã xác nhận" },
      pending: { color: "orange", text: "Chờ xác nhận" },
      cancelled: { color: "red", text: "Đã hủy" },
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
                {viewType === "month" && (
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
                  viewType === "gantt" ||
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
                  options={employeeList
                    .filter(
                      (emp) =>
                        selectedDepartment === "all" ||
                        emp.department === selectedDepartment
                    )
                    .map((emp) => ({
                      value: emp.id,
                      label: emp.name,
                    }))}
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
                  value={branchFilter}
                  onChange={setBranchFilter}
                  allowClear
                  onClear={() => setBranchFilter(null)}
                  size="middle"
                  options={branches.map((branch) => ({
                    value: branch.id,
                    label: branch.name,
                  }))}
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
            branches={branches}
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
            branches={branches}
            attendanceStatuses={attendanceStatuses}
            branchFilter={branchFilter}
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
            employeeList={employeeList}
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
            employeeList={employeeList}
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
            employeeList={employeeList}
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
          branches={branches}
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
        <Form form={form} layout="vertical" size="large">
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
              name="employeeId"
              label={<span style={{ fontWeight: 600 }}>Nhân viên</span>}
              rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
            >
              <Select
                placeholder="Chọn nhân viên"
                showSearch
                optionFilterProp="label"
                options={employeeList.map((emp) => ({
                  value: emp.id,
                  label: emp.name,
                }))}
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
                name="shift"
                label={<span style={{ fontWeight: 600 }}>Ca làm việc</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập ca làm việc" },
                ]}
                style={{ flex: 1, marginRight: "8px" }}
              >
                <Select
                  placeholder="Chọn ca làm việc"
                  options={[
                    { value: "Ca sáng", label: "Ca sáng (08:00 - 12:00)" },
                    { value: "Ca chiều", label: "Ca chiều (13:00 - 17:00)" },
                    { value: "Ca tối", label: "Ca tối (18:00 - 22:00)" },
                    { value: "Ca đêm", label: "Ca đêm (22:00 - 06:00)" },
                    {
                      value: "Ca fullday",
                      label: "Ca full ngày (08:00 - 17:00)",
                    },
                  ]}
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <Form.Item
                name="branchId"
                label={<span style={{ fontWeight: 600 }}>Chi nhánh</span>}
                rules={[{ required: true, message: "Vui lòng chọn chi nhánh" }]}
                style={{ flex: 1, marginLeft: "8px" }}
              >
                <Select
                  placeholder="Chọn chi nhánh"
                  showSearch
                  optionFilterProp="label"
                  options={branches.map((branch) => ({
                    value: branch.id,
                    label: branch.name,
                  }))}
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Space.Compact>

            <Space.Compact style={{ width: "100%" }}>
              <Form.Item
                name="startTime"
                label={<span style={{ fontWeight: 600 }}>Giờ bắt đầu</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập giờ bắt đầu" },
                ]}
                style={{ flex: 1, marginRight: "8px" }}
              >
                <Input
                  placeholder="VD: 08:00"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <Form.Item
                name="endTime"
                label={<span style={{ fontWeight: 600 }}>Giờ kết thúc</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập giờ kết thúc" },
                ]}
                style={{ flex: 1, marginLeft: "8px" }}
              >
                <Input
                  placeholder="VD: 17:00"
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
