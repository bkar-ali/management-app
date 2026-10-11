import express from "express";
import { getTeams } from "../../controllers/dashboard/teamController.js";
const teamRouter = express.Router();

teamRouter.get("/", getTeams);

export default teamRouter;
