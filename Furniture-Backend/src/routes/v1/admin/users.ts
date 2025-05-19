import express from "express";
import { getAllUsers } from "../../../controllers/admin/usersController";
import { auth } from "../../../middlewares/auth";

const router = express.Router();

router.get("/users", auth, getAllUsers);

export default router;
