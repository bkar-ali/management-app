import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  getProjectsByUserId,
} from "../../controllers/dashboard/projectController.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const projectRouter = express.Router();

projectRouter.get("/getProjectsByUserId", verifyToken, getProjectsByUserId);
projectRouter.get("/", getProjects);
projectRouter.get("/:projectId", getProjectById);
projectRouter.post("/", createProject);

export default projectRouter;
