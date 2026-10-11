import express from "express";
import { search } from "../../controllers/dashboard/searchController.js";

const searchRouter = express.Router();

searchRouter.get("/", search);

export default searchRouter;
