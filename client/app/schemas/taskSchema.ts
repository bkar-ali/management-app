import { z } from "zod";
import { Priority as PriorityType, Status as StatusType } from "../store/api";

export const taskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters"),

    status: z.enum(StatusType),

    priority: z.enum(PriorityType),

    tags: z.string(),

    startDate: z.string().min(1, "Start date is required"),

    dueDate: z.string().min(1, "Due date is required"),

    authorUserId: z.coerce
      .number()
      .int("Author ID must be an integer")
      .positive("Author ID must be greater than 0"),

    assignedUserId: z.coerce
      .number()
      .int("Assigned User ID must be an integer")
      .positive("Assigned User ID must be greater than 0"),
    projectId: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce
        .number()
        .int("Project ID must be an integer")
        .positive("Project ID must be greater than 0")
        .optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.dueDate) < new Date(data.startDate)) {
      ctx.addIssue({
        code: "custom",
        message: "Due date must be after start date",
        path: ["dueDate"],
      });
    }
  });
