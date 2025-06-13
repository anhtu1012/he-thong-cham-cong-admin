/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { JSX } from "react";
import { List, Button } from "antd";
import dayjs from "dayjs";

interface ListViewProps {
  dateRange: { start: dayjs.Dayjs; end: dayjs.Dayjs };
  scheduleData: any[];
  employeeList: any[];
  selectedEmployees: number[];
  selectedDepartment: string;
  handleEditSchedule: (schedule: any) => void;
  handleDeleteSchedule: (id: number) => void;
  getStatusTag: (status: string) => JSX.Element;
}

const ListView: React.FC<ListViewProps> = ({
  dateRange,
  scheduleData,
  employeeList,
  selectedEmployees,
  selectedDepartment,
  handleEditSchedule,
  handleDeleteSchedule,
  getStatusTag,
}) => {
  const { start, end } = dateRange;

  const filteredSchedules = scheduleData.filter((schedule) => {
    const scheduleDate = dayjs(schedule.date);
    const inDateRange =
      (scheduleDate.isAfter(start) || scheduleDate.isSame(start)) &&
      (scheduleDate.isBefore(end) || scheduleDate.isSame(end));
    const matchesEmployeeFilter =
      selectedEmployees.length === 0 ||
      selectedEmployees.includes(schedule.employeeId);

    // Modified department filter to handle API data
    let matchesDepartmentFilter = selectedDepartment === "all";

    if (!matchesDepartmentFilter) {
      const employee = employeeList.find((e) => e.id === schedule.employeeId);
      if (employee) {
        matchesDepartmentFilter = employee.department === selectedDepartment;
      } else if (schedule.positionName) {
        // If employee not in list but schedule has position data
        matchesDepartmentFilter = schedule.positionName === selectedDepartment;
      }
    }

    return inDateRange && matchesEmployeeFilter && matchesDepartmentFilter;
  });

  // Group schedules by date
  const schedulesByDate: Record<string, any[]> = {};
  filteredSchedules.forEach((schedule) => {
    if (!schedulesByDate[schedule.date]) {
      schedulesByDate[schedule.date] = [];
    }
    schedulesByDate[schedule.date].push(schedule);
  });

  const dateKeys = Object.keys(schedulesByDate).sort();

  return (
    <div className="list-schedule-view">
      <h3>
        Danh sách lịch làm việc từ {start.format("DD/MM/YYYY")} đến{" "}
        {end.format("DD/MM/YYYY")}
      </h3>

      {dateKeys.length === 0 ? (
        <div className="empty-list">
          Không có lịch làm việc trong khoảng thời gian này
        </div>
      ) : (
        dateKeys.map((dateKey) => (
          <div key={dateKey} className="date-group">
            <h4 className="date-header">
              {dayjs(dateKey).format("dddd, DD/MM/YYYY")}
            </h4>
            <List
              dataSource={schedulesByDate[dateKey]}
              renderItem={(schedule) => {
                const employee = employeeList.find(
                  (e) => e.id === schedule.employeeId
                );
                const employeeName =
                  employee?.name || schedule.fullName || "N/A";
                const employeeAvatar = employee?.avatar;

                return (
                  <List.Item
                    actions={[
                      <Button
                        key="edit"
                        type="link"
                        onClick={() => handleEditSchedule(schedule)}
                      >
                        Chỉnh sửa
                      </Button>,
                      <Button
                        key="delete"
                        type="link"
                        danger
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        Xóa
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        employeeAvatar ? (
                          <img
                            src={employeeAvatar}
                            className="employee-avatar"
                            alt={employeeName}
                          />
                        ) : null
                      }
                      title={`${employeeName} - ${schedule.shift}`}
                      description={`${schedule.startTime} - ${schedule.endTime}`}
                    />
                    <div>{getStatusTag(schedule.status)}</div>
                  </List.Item>
                );
              }}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default ListView;
