import { z } from "zod";
import { UserInforSchema } from "./auth.dto";

/**
 * Schema and type for user login
 */

export const UserRequestLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type UserRequestLoginItem = z.infer<typeof UserRequestLoginSchema>;

/**
 * Schema and type for user registration
 */
export const UserRequestRegisterSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleCode: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Invalid email format"),
  faceImg: z.string().optional(),
  contract: z.string().optional(),
  bod: z.string().or(z.date()),
  address: z.string(),
  phone: z.string(),
  branchCode: z.string(),
  managedBy: z.string(),
  // faceImg and contract are excluded as requested
});

export type UserRequestRegisterItem = z.infer<typeof UserRequestRegisterSchema>;

//update
export const UserRequestChangePasswordSchema = UserInforSchema.omit({
  id: true,
})
  .partial()
  .extend({
    // All fields are optional, but when provided they must pass validation
    userName: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    roleCode: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    faceImg: z.string().optional(),
    bod: z.string().or(z.date()).optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    branchCode: z.string().optional(),
    managedBy: z.string().optional(),
    positionCode: z.string().optional(),
    isActive: z.boolean().optional(),
  });
export type UserRequestUpdateUsser = z.infer<
  typeof UserRequestChangePasswordSchema
>;
