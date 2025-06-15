/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { JSX } from "react";
import { Card, Button, Row, Col, List } from "antd";
import dayjs from "dayjs";

interface CardViewProps {
  dateRange: { start: dayjs.Dayjs; end: dayjs.Dayjs };
  scheduleData: any[];
  selectedEmployees: number[];
  selectedDepartment: string;
  currentDate: dayjs.Dayjs;
  form: any;
  handleAddSchedule: () => void;
  handleEditSchedule: (schedule: any) => void;
  getStatusTag: (status: string) => JSX.Element;
}

const CardView: React.FC<CardViewProps> = ({
  dateRange,
  scheduleData,
  selectedEmployees,
  selectedDepartment,
  currentDate,
  form,
  handleAddSchedule,
  handleEditSchedule,
  getStatusTag,
}) => {
  const { start, end } = dateRange;

  // Create a combined list of employees that includes both employeeList and
  // any employees found only in the schedule data (from API)
  const combinedEmployeeList: {
    userCode: number;
    name: string;
    department: string;
    avatar?: string;
  }[] = [];

  // Add unique employees from schedule data
  scheduleData.forEach((schedule) => {
    if (
      schedule.fullName &&
      !combinedEmployeeList.find((e) => e.userCode === schedule.userCode)
    ) {
      combinedEmployeeList.push({
        userCode: schedule.userCode,
        name: schedule.fullName,
        department: schedule.positionName || "Unknown",
        // No avatar for API-only employees
      });
    }
  });

  const filteredEmployees = combinedEmployeeList.filter(
    (employee) =>
      (selectedEmployees.length === 0 ||
        selectedEmployees.includes(employee.userCode)) &&
      (selectedDepartment === "all" ||
        employee.department === selectedDepartment)
  );

  return (
    <div className="card-schedule-view">
      <h3>
        Lịch làm việc từ {start.format("DD/MM/YYYY")} đến{" "}
        {end.format("DD/MM/YYYY")}
      </h3>

      <Row gutter={[16, 16]}>
        {filteredEmployees.map((employee) => {
          // Get schedules for this employee in the date range
          const employeeSchedules = scheduleData.filter((schedule) => {
            const scheduleDate = dayjs(schedule.date);
            return (
              schedule.userCode === employee.userCode &&
              (scheduleDate.isAfter(start) || scheduleDate.isSame(start)) &&
              (scheduleDate.isBefore(end) || scheduleDate.isSame(end))
            );
          });

          return (
            <Col xs={24} sm={12} md={8} lg={6} key={employee.userCode}>
              <Card
                title={
                  <div className="employee-card-header">
                    {employee.avatar && (
                      <img
                        src={employee.avatar}
                        className="employee-avatar"
                        alt={employee.name}
                      />
                    )}
                    <div>
                      <div>{employee.name}</div>
                      <small>{employee.department}</small>
                    </div>
                  </div>
                }
                extra={
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      form.setFieldsValue({
                        userCode: employee.userCode,
                        date: currentDate,
                      });
                      handleAddSchedule();
                    }}
                  >
                    Thêm ca
                  </Button>
                }
                className="employee-schedule-card"
              >
                {employeeSchedules.length === 0 ? (
                  <div className="no-schedules">Không có ca làm việc</div>
                ) : (
                  <List
                    size="small"
                    dataSource={employeeSchedules}
                    renderItem={(schedule) => (
                      <List.Item
                        key={schedule.userCode}
                        className={`schedule-list-item status-${schedule.status}`}
                        actions={[
                          <Button
                            key="edit"
                            type="link"
                            size="small"
                            onClick={() => handleEditSchedule(schedule)}
                          >
                            Sửa
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          title={`${dayjs(schedule.date).format("DD/MM")} - ${
                            schedule.shift
                          }`}
                          description={`${schedule.startTime} - ${schedule.endTime}`}
                        />
                        {getStatusTag(schedule.status)}
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default CardView;
