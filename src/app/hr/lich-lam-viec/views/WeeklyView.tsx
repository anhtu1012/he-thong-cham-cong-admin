/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button } from "antd";
import { EnvironmentOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface WeeklyViewProps {
  dateRange: { start: dayjs.Dayjs; end: dayjs.Dayjs };
  scheduleData: any[];
  employeeList?: any[];
  selectedEmployees: number[];
  selectedDepartment: string;
  branches: any[];
  attendanceStatuses: Record<string, string>;
  branchFilter: number | null;
  attendanceFilter: string | null;
  form: any;
  handleViewSchedule: (schedule: any) => void;
  handleAddSchedule: () => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({
  dateRange,
  scheduleData,
  selectedEmployees,
  selectedDepartment,
  branches,
  attendanceStatuses,
  branchFilter,
  attendanceFilter,
  form,
  handleViewSchedule,
  handleAddSchedule,
}) => {
  const { start, end } = dateRange;
  const days: any = [];
  let day = start;

  while (day.isBefore(end) || day.isSame(end, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  const getBranchName = (schedule: any) => {
    // First check if the schedule has branchName from API
    if (schedule.branchName) {
      return schedule.branchName;
    }
    // Otherwise lookup from branches array
    const branch = branches.find((b) => b.id === schedule.branchId);
    return branch ? branch.name : "N/A";
  };

  //   // Find employees with schedules in the date range
  const employeesWithSchedules: any = [];

  // Add employees from API data that might not be in our employeeList
  scheduleData.forEach((schedule) => {
    if (schedule.fullName) {
      const existingEmployee = employeesWithSchedules.find(
        (emp: any) => emp.id === schedule.employeeId
      );
      if (!existingEmployee) {
        employeesWithSchedules.push({
          id: schedule.employeeId,
          name: schedule.fullName,
          department: schedule.positionName || "Unknown",
        });
      }
    }
  });

  const getAttendanceStatusClass = (status: string) => {
    if (!status) return "";
    return `attendance-${status}`;
  };

  return (
    <div className="weekly-schedule-view">
      <h3>
        Lịch làm việc tuần: {start.format("DD/MM/YYYY")} -{" "}
        {end.format("DD/MM/YYYY")}
      </h3>

      <div className="weekly-calendar">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="employee-column">
                <div>Nhân viên</div>
              </th>
              {days.map((d: any) => (
                <th key={d.format("YYYY-MM-DD")}>
                  <div>{d.format("dddd")}</div>
                  <div>{d.format("DD/MM")}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employeesWithSchedules
              .filter(
                (emp) =>
                  selectedEmployees.length === 0 ||
                  selectedEmployees.includes(emp.id)
              )
              .filter(
                (emp) =>
                  selectedDepartment === "all" ||
                  emp.department === selectedDepartment
              )
              .map((employee) => (
                <tr key={employee.id}>
                  <td className="employee-name">
                    <div className="employee-cell">
                      {employee.avatar && (
                        <img
                          src={employee.avatar}
                          className="employee-avatar-small"
                          alt={employee.name}
                        />
                      )}
                      <span>{employee.name}</span>
                    </div>
                  </td>
                  {days.map((d: any) => {
                    const daySchedules = scheduleData.filter(
                      (s) =>
                        s.employeeId === employee.id &&
                        s.date === d.format("YYYY-MM-DD") &&
                        (branchFilter === null ||
                          s.branchId === branchFilter) &&
                        (attendanceFilter === null ||
                          s.attendanceStatus === attendanceFilter)
                    );
                    return (
                      <td
                        key={d.format("YYYY-MM-DD")}
                        className="schedule-cell"
                      >
                        {daySchedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className={`schedule-item status-${
                              schedule.status
                            } ${getAttendanceStatusClass(
                              schedule.attendanceStatus
                            )}`}
                            onClick={() => handleViewSchedule(schedule)}
                            title={`${schedule.shift} (${schedule.startTime}-${schedule.endTime})`}
                          >
                            <div className="schedule-title">
                              {schedule.shift}
                            </div>
                            <div className="schedule-info">
                              <span className="branch-badge">
                                <EnvironmentOutlined />
                                {getBranchName(schedule)
                                  .split(" ")
                                  .slice(-1)
                                  .join(" ")}
                              </span>
                              <span className="time-range">
                                {schedule.startTime}-{schedule.endTime}
                              </span>
                            </div>
                            {schedule.attendanceStatus && (
                              <div
                                className="attendance-indicator"
                                title={
                                  schedule.attendanceStatus ===
                                  attendanceStatuses.ON_TIME
                                    ? "Đúng giờ"
                                    : schedule.attendanceStatus ===
                                      attendanceStatuses.LATE
                                    ? "Đi trễ"
                                    : schedule.attendanceStatus ===
                                      attendanceStatuses.EARLY_LEAVE
                                    ? "Về sớm"
                                    : schedule.attendanceStatus ===
                                      attendanceStatuses.ABSENT
                                    ? "Vắng mặt"
                                    : schedule.attendanceStatus ===
                                      attendanceStatuses.COMPLETED
                                    ? "Hoàn thành"
                                    : ""
                                }
                              ></div>
                            )}
                          </div>
                        ))}
                        <Button
                          type="dashed"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            form.setFieldsValue({
                              employeeId: employee.id,
                              date: d,
                            });
                            handleAddSchedule();
                          }}
                          title={`Thêm lịch làm việc cho ${
                            employee.name
                          } ngày ${d.format("DD/MM/YYYY")}`}
                        >
                          Thêm ca
                        </Button>
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {employeesWithSchedules.length === 0 && (
        <div className="empty-list">
          <div className="empty-icon">📅</div>
          <p>Không có nhân viên nào được lên lịch trong tuần này</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyView;
