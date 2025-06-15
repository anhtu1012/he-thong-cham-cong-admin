/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { JSX } from "react";
import dayjs from "dayjs";
import { getDayNameInVietnamese } from "../../../../utils/dateLocalization";

interface TimelineViewProps {
  dateRange: { start: dayjs.Dayjs; end: dayjs.Dayjs };
  scheduleData: any[];
  employeeList: any[];
  selectedEmployees: number[];
  selectedDepartment: string;
  handleEditSchedule: (schedule: any) => void;
  getStatusTag: (status: string) => JSX.Element;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  dateRange,
  scheduleData,
  employeeList,
  selectedEmployees,
  selectedDepartment,
  handleEditSchedule,
  getStatusTag,
}) => {
  const { start, end } = dateRange;

  // Filter schedules in date range and matching employee/department filters
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

  // Group by date
  const dateGroups: Record<string, any[]> = {};

  filteredSchedules.forEach((schedule) => {
    if (!dateGroups[schedule.date]) {
      dateGroups[schedule.date] = [];
    }
    dateGroups[schedule.date].push(schedule);
  });

  // Sort dates
  const sortedDates = Object.keys(dateGroups).sort();

  return (
    <div className="timeline-schedule-view">
      <h3>
        Lịch làm việc từ {start.format("DD/MM/YYYY")} đến{" "}
        {end.format("DD/MM/YYYY")}
      </h3>

      <div className="timeline-container">
        {sortedDates.length === 0 ? (
          <div className="empty-timeline">
            Không có lịch làm việc trong khoảng thời gian này
          </div>
        ) : (
          sortedDates.map((date) => {
            const dateObj = dayjs(date);
            const formattedDate = `${getDayNameInVietnamese(
              dateObj
            )}, ${dateObj.format("DD/MM/YYYY")}`;
            const daySchedules = dateGroups[date];

            // Group by shift for timeline view
            const shiftGroups: Record<string, any[]> = {
              "Ca sáng": [],
              "Ca chiều": [],
              "Ca tối": [],
              "Ca đêm": [],
            };

            daySchedules.forEach((schedule) => {
              if (shiftGroups[schedule.shift]) {
                shiftGroups[schedule.shift].push(schedule);
              } else {
                // Handle custom shifts
                shiftGroups[schedule.shift] = [schedule];
              }
            });

            return (
              <div key={date} className="timeline-date-group">
                <div className="timeline-date">{formattedDate}</div>

                <div className="timeline-shifts">
                  {Object.entries(shiftGroups).map(
                    ([shiftName, shiftSchedules]) => {
                      if (shiftSchedules.length === 0) return null;

                      return (
                        <div key={shiftName} className="timeline-shift">
                          <div className="timeline-shift-name">{shiftName}</div>

                          <div className="timeline-employees">
                            {shiftSchedules.map((schedule) => {
                              const employee = employeeList.find(
                                (e) => e.id === schedule.employeeId
                              );

                              // Handle employee display name
                              const displayName =
                                employee?.name || schedule.fullName || "N/A";

                              return (
                                <div
                                  key={schedule.id}
                                  className={`timeline-employee-item status-${schedule.status}`}
                                  onClick={() => handleEditSchedule(schedule)}
                                >
                                  <div className="timeline-employee-avatar">
                                    {employee?.avatar ? (
                                      <img
                                        src={employee.avatar}
                                        alt={displayName}
                                      />
                                    ) : (
                                      employee?.name.charAt(0) || "?"
                                    )}
                                  </div>
                                  <div className="timeline-employee-info">
                                    <div>{employee?.name || "N/A"}</div>
                                    <div className="timeline-schedule-time">
                                      {schedule.startTime} - {schedule.endTime}
                                      {getStatusTag(schedule.status)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TimelineView;
