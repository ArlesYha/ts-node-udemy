import express, { type Response, type Application, type Request } from "express";
import { type UserSchema, userSchema, projectSchema, type ProjectSchema } from "./schemas";
import UserControllers from "./controller";

const app: Application = express();

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

app.use(express.json());

const userRouter = express.Router();

// app.get("/users", getAllUsers);

// app.post("/users", createUser);

// app.get("/users/:userId", getUserById);

userRouter
  .route("/users")
  .get(UserControllers.getAllUsers)
  .post(UserControllers.createUser)
  .get(UserControllers.getUserById);

app.put("/users/:userId", (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const user = users.find((user) => user.id === userId);

  if (user === undefined) {
    return res.status(404).json({ error: "User not found" });
  }

  const parsedUser = userSchema.partial().safeParse(req.body);

  if (!parsedUser.success) {
    return res.status(400).json({ error: parsedUser.error.flatten().fieldErrors });
  }

  const updatedUser: UserSchema = {
    ...user,
    ...parsedUser.data,
  };

  const userIndex = users.findIndex((user) => user.id === userId);
  users[userIndex] = updatedUser;

  return res.status(200).json(updatedUser);
});

app.delete("/users/:userId", (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(userIndex, 1);
  return res.status(200).json("User deleted");
});

app.get("/users/:userId/projects", (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const user = users.find((user) => user.id === userId);

  if (user === undefined) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(user.projects);
});

app.post("/users/:userId/projects", (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const user = users.find((user) => user.id === userId);

  if (user === undefined) {
    return res.status(404).json({ error: "User not found" });
  }

  const project = req.body;
  const parsedProject = projectSchema.omit({ id: true }).safeParse(project);

  if (!parsedProject.success) {
    return res.status(400).json({ error: parsedProject.error.flatten().fieldErrors });
  }

  const newProject: ProjectSchema = {
    ...parsedProject.data,
    id: user.projects.length + 1,
  };

  user.projects.push(newProject);

  return res.status(200).json(newProject);
});

app.get("/users/:userId/projects/:projectId", (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const user = users.find((user) => user.id === userId);

  if (user === undefined) {
    return res.status(404).json({ error: "User not found" });
  }

  const projectId = Number(req.params.projectId);
  const project = user.projects.find((project) => project.id === projectId);

  if (process === undefined) {
    return res.status(400).json({ error: "Project not found" });
  }

  return res.status(200).json(project);
});

app.put("/users/:userId/projects/:projectId", (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const user = users.find((user) => user.id === userId);

  if (user === undefined) {
    return res.status(404).json({ error: "User not found" });
  }

  const projectId = Number(req.params.projectId);
  const project = user.projects.find((project) => project.id === projectId);

  if (project === undefined) {
    return res.status(400).json({ error: "Project not found" });
  }

  const parsedProject = projectSchema.partial().safeParse(req.body);

  if (!parsedProject.success) {
    return res.status(400).json({ error: parsedProject.error.flatten().fieldErrors });
  }

  const updatedProject: ProjectSchema = {
    ...project,
    ...parsedProject.data,
  };

  const projectIndex = user.projects.findIndex((project) => project.id === projectId);
  user.projects[projectIndex] = updatedProject;

  return res.status(200).json(updatedProject);
});

app.delete("/users/:userId/projects/:projectId", (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const user = users.find((user) => user.id === userId);

  if (user === undefined) {
    return res.status(404).json({ error: "User not found" });
  }

  const projectId = Number(req.params.projectId);
  const projectIndex = user.projects.findIndex((project) => project.id === projectId);

  if (projectIndex === -1) {
    return res.status(400).json({ error: "Project not found" });
  }

  user.projects.splice(projectIndex, 1);
  return res.status(200).json({ message: "Project deleted" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
