import { z } from "zod";

export const taskSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(2),
  description: z.string().trim().min(3),
  state: z.enum(["todo", "in-progress", "done"]),
});
export type TaskSchema = z.infer<typeof taskSchema>;

export const projectSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(2),
  description: z.string().trim().min(3),
  tasks: z.array(taskSchema),
});
export type ProjectSchema = z.infer<typeof projectSchema>;

export const userSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(2),
  email: z.string().email(),
  projects: z.array(projectSchema),
});
export type UserSchema = z.infer<typeof userSchema>;
