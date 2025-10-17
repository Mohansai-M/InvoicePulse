import express from "express";
import { signup, login, logout, getMe } from "../controllers/authcontrollers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);

export default router;
