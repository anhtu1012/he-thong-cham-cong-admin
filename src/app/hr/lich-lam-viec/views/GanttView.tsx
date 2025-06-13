/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import dayjs from "dayjs";

interface GanttViewProps {
  dateRange: { start: dayjs.Dayjs; end: dayjs.Dayjs };
  scheduleData: any[];
  employeeList: any[];
  selectedEmployees: number[];
  selectedDepartment: string;
  form: any;
  handleEditSchedule: (schedule: any) => void;
  handleAddSchedule: () => void;
}

const GanttView: React.FC<GanttViewProps> = ({
  dateRange,
  scheduleData,
  employeeList,
  selectedEmployees,
  selectedDepartment,
  form,
  handleEditSchedule,
  handleAddSchedule,
}) => {
  const { start, end } = dateRange;
  const days: any = [];
  let day = start;

  while (day.isBefore(end) || day.isSame(end, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  // Create a combined list of employees that includes both employeeList and
  // any employees found only in the schedule data (from API)
  const combinedEmployeeList = [...employeeList];

  // Add unique employees from schedule data
  scheduleData.forEach((schedule) => {
    if (
      schedule.fullName &&
      !combinedEmployeeList.find((e) => e.id === schedule.employeeId)
    ) {
      combinedEmployeeList.push({
        id: schedule.employeeId,
        name: schedule.fullName,
        department: schedule.positionName || "Unknown",
      });
    }
  });

  const filteredEmployees = combinedEmployeeList.filter(
    (employee) =>
      (selectedEmployees.length === 0 ||
        selectedEmployees.includes(employee.id)) &&
      (selectedDepartment === "all" ||
        employee.department === selectedDepartment)
  );

  return (
    <div className="gantt-schedule-view">
      <h3>
        Lịch làm việc từ {start.format("DD/MM/YYYY")} đến{" "}
        {end.format("DD/MM/YYYY")}
      </h3>

      <div className="gantt-container">
        <div className="gantt-header">
          <div className="gantt-side-header">Nhân viên</div>
          <div className="gantt-timeline-header">
            {days.map((day: any) => (
              <div key={day.format("YYYY-MM-DD")} className="gantt-day-header">
                <div className="day-name">{day.format("ddd")}</div>
                <div className="day-date">{day.format("DD/MM")}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="gantt-body">
          {filteredEmployees.map((employee) => {
            return (
              <div key={employee.id} className="gantt-row">
                <div className="gantt-side-cell">{employee.name}</div>
                <div className="gantt-timeline">
                  {days.map((day: any) => {
                    const daySchedules = scheduleData.filter(
                      (s) =>
                        s.employeeId === employee.id &&
                        s.date === day.format("YYYY-MM-DD")
                    );

                    return (
                      <div
                        key={day.format("YYYY-MM-DD")}
                        className="gantt-day-cell"
                      >
                        {daySchedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className={`gantt-schedule-item status-${schedule.status}`}
                            onClick={() => handleEditSchedule(schedule)}
                            title={`${schedule.shift}: ${schedule.startTime}-${schedule.endTime}`}
                          >
                            {schedule.shift}
                          </div>
                        ))}
                        <div
                          className="gantt-add-button"
                          onClick={() => {
                            form.setFieldsValue({
                              employeeId: employee.id,
                              date: day,
                            });
                            handleAddSchedule();
                          }}
                        >
                          +
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GanttView;
