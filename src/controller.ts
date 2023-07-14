import { type Request, type Response } from "express";
import { userSchema, type UserSchema } from "./schemas";

const users: UserSchema[] = [
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    projects: [
      {
        id: 3,
        name: "Project 3",
        description: "A new project",
        tasks: [],
      },
    ],
  },
];

const getAllUsers = (req: Request, res: Response): Response => {
  return res.status(200).json(users);
};

const createUser = (req: Request, res: Response): Response => {
  const user = req.body;

  const parsedUser = userSchema.omit({ id: true }).safeParse(user);

  if (!parsedUser.success) {
    return res.status(400).json({
      error: parsedUser.error.flatten().fieldErrors,
    });
  }

  const newUser: UserSchema = {
    ...parsedUser.data,
    id: users.length + 1,
  };

  users.push(newUser);

  return res.status(200).json(newUser);
};

const getUserById = (req: Request, res: Response): Response => {
  const userId = Number(req.params.userId);
  const user = users.find((user) => user.id === userId);

  if (user === undefined) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(user);
};

const UserControllers = {
  getAllUsers,
  createUser,
  getUserById,
};

export default UserControllers;
