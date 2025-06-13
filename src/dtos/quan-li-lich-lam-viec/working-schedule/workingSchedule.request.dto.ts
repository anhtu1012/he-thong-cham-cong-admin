import { z } from "zod";
import {
  WorkingScheduleSchema,
  WorkingScheduleStatusEnum,
} from "./workingSchedule.dto";

/**
 * Schema and type for creating a working schedule
 */
export const CreateWorkingScheduleSchema = WorkingScheduleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .partial({
    checkInTime: true,
    checkOutTime: true,
  })
  .extend({
    // Required fields with validation
    userCode: z.string().min(1, "User code is required"),
    userContractCode: z.string().min(1, "User contract code is required"),
    date: z.string().refine((value) => {
      try {
        return !isNaN(Date.parse(value));
      } catch {
        return false;
      }
    }, "Date must be a valid ISO 8601 date string"),
    shiftCode: z.string().min(1, "Shift code is required"),
    branchCode: z.string().min(1, "Branch code is required"),
    startShiftTime: z.string().refine((value) => {
      try {
        return !isNaN(Date.parse(value));
      } catch {
        return false;
      }
    }, "Start shift time must be a valid ISO 8601 date string"),
    endShiftTime: z.string().refine((value) => {
      try {
        return !isNaN(Date.parse(value));
      } catch {
        return false;
      }
    }, "End shift time must be a valid ISO 8601 date string"),
  });

export type CreateWorkingScheduleRequest = z.infer<
  typeof CreateWorkingScheduleSchema
>;

/**
 * Schema and type for updating a working schedule
 */
export const UpdateWorkingScheduleSchema = WorkingScheduleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  code: true,
})
  .partial()
  .extend({
    // Optional fields with validation when provided
    status: WorkingScheduleStatusEnum.optional(),
    checkInTime: z
      .string()
      .refine((value) => {
        try {
          return !isNaN(Date.parse(value));
        } catch {
          return false;
        }
      }, "Check-in time must be a valid ISO 8601 date string")
      .nullable()
      .optional(),
    checkOutTime: z
      .string()
      .refine((value) => {
        try {
          return !isNaN(Date.parse(value));
        } catch {
          return false;
        }
      }, "Check-out time must be a valid ISO 8601 date string")
      .nullable()
      .optional(),
  });

export type UpdateWorkingScheduleRequest = z.infer<
  typeof UpdateWorkingScheduleSchema
>;

/**
 * Schema and type for attendance check-in/check-out
 */
export const AttendanceCheckSchema = z.object({
  scheduleCode: z.string(),
  timeStamp: z.string().refine((value) => {
    try {
      return !isNaN(Date.parse(value));
    } catch {
      return false;
    }
  }, "Timestamp must be a valid ISO 8601 date string"),
  type: z.enum(["CHECK_IN", "CHECK_OUT"]),
  location: z.string().optional(),
});

export type AttendanceCheckRequest = z.infer<typeof AttendanceCheckSchema>;
