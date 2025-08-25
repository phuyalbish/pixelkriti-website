import { z } from "zod";

export const nameSchema = z
  .string()
  .trim()
  .nonempty("This Field is required.")
  .min(4, { message: "Must be 4 or more characters long." });
export const emailSchema = z
  .string()
  .trim()
  .nonempty("This Field is required.")
  .email();
export const textareaSchema = z
  .string()
  .trim()
  .nonempty("This Field is required.")
  .min(20, { message: "Must be 20 or more characters long." });

export const phoneNumberSchema = z
  .string()
  .trim()
  .nonempty("This Field is required.")
  .regex(/^(97|98)\d{8}$/, {
    message:
      "Must be a valid phone number starting with 98 or 97 and 10 digits long.",
  });

  export const futureDateSchema = z
  .string()
  .trim()
  .nonempty("This Field is required.")
  .refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, {
    message: "Date must be in the future.",
  });


export const durationSchema = z
  .string()
  .trim()
  .nonempty("This Field is required.")
  .refine((val) => !isNaN(Number(val)), {
    message: "Must be a valid number.",
  })
  .transform((val) => Number(val))
  .refine((val) => val >= 1, {
    message: "Must be at least 1.",
  })
  .refine((val) => val <= 20, {
    message: "Must be less than 20.",
  });



export const totalPeopleSchema = z
  .string()
  .trim()
  .nonempty("This Field is required.")
  .refine((val) => !isNaN(Number(val)), {
    message: "Must be a valid number.",
  })
  .transform((val) => Number(val))
  .refine((val) => val >= 1, {
    message: "Must be at least 1.",
  })
  .refine((val) => val <= 40, {
    message: "Must be less than 20.",
  });





export const totalBudgetSchema = z
  .string()
  .trim()
  .nonempty("This Field is required.")
  .refine((val) => !isNaN(Number(val)), {
    message: "Must be a valid number.",
  })
  .transform((val) => Number(val))
  .refine((val) => val >= 500, {
    message: "Must be at least 500.",
  })
  .refine((val) => val <= 5000, {
    message: "Must be less than 5000.",
  });