import { z } from "zod";

// Working Schedule Status Enum
export const WorkingScheduleStatusEnum = z.enum([
  "NOTSTARTED",
  "INPROGRESS",
  "COMPLETED",
  "ABSENT",
  "LATE",
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export type WorkingScheduleStatus = z.infer<typeof WorkingScheduleStatusEnum>;

// Base Working Schedule Schema
export const WorkingScheduleSchema = z.object({
  id: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  code: z.string(),
  userCode: z.string(),
  userContractCode: z.string(),
  status: WorkingScheduleStatusEnum,
  date: z.string().or(z.date()),
  fullName: z.string(),
  shiftCode: z.string(),
  shiftName: z.string(),
  branchName: z.string(),
  branchCode: z.string(),
  addressLine: z.string(),
  startShiftTime: z.string().or(z.date()),
  endShiftTime: z.string().or(z.date()),
  checkInTime: z.string().or(z.date()).nullable(),
  checkOutTime: z.string().or(z.date()).nullable(),
  positionName: z.string(),
  fullNameManagerBy: z.string(),
});

export type WorkingScheduleItem = z.infer<typeof WorkingScheduleSchema>;
