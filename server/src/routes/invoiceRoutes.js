import express from "express";
import uploadInvoice from "../controllers/uploadInvoice.js";
import upload from "../middleware/upload.js";
import { updateInvoice } from "../controllers/UpdateInvoice.js";
import { getAllInvoices, getInvoiceById } from "../controllers/getInvoice.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadInvoice);
router.get("/", protect, getAllInvoices);
router.get("/:id", protect, getInvoiceById);
router.put("/:id", protect, updateInvoice);

export default router;
