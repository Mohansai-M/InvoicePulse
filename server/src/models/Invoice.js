import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["UPLOADED", "EXTRACTED", "NEEDS_REVIEW", "SAVED"],
      default: "UPLOADED",
    },
    file_path: {
      type: String,
      required: true,
    },
    supplier_name: {
      type: String,
      default: null,
    },
    invoice_number: {
      type: String,
      default: null,
    },
    invoice_date: {
      type: String,
      default: null,
    },
    currency: {
      type: String,
      default: "INR",
    },
    subtotal: {
      type: Number,
      default: null,
    },
    total: {
      type: Number,
      default: null,
    },
    raw_llm_json: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
