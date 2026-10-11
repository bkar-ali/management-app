import express from "express";
import {
  createTask,
  gettasks,
  updateTaskStatus,
  getUserTasks,
} from "../../controllers/dashboard/taskController.js";

const taskRouter = express.Router();

taskRouter.get("/", gettasks);
taskRouter.post("/", createTask);
taskRouter.patch("/:taskId/status", updateTaskStatus);
taskRouter.get("/user/:userId", getUserTasks);

export default taskRouter;
