import * as z from "zod";

export const LoginSchema = z.object({
  username: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password is required",
  })
});

export const RegisterSchema = z.object({
    fullname: z.string().min(1, {
        message: "FullName is required",
      }),
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
    phone: z.string().min(9, {
        message: "Phone number is required",
    }),
    affiliation: z.string().optional(),
});

export const RecoverPasswordSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

export const VerifyNumberSchema = z.object({
  phone: z.string().min(9, {
      message: "Phone number is required",
  }),
});

export const UpdatePasswordSchema = z.object({
  otp: z.string().length(6, {
      message: "OTP is required",
  }),
  phone: z.string().min(6, {
      message: "Phone number is required",
  }),
  new_password: z.string().min(6, {
      message: "New Password is required",
  }),
});