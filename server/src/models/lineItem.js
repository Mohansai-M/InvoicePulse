import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema(
  {
    invoice_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit_price: {
      type: Number,
      required: true,
    },
    line_total: {
      type: Number,
      required: true,
    },
  },
);

const LineItem = mongoose.model("LineItem", lineItemSchema);
export default LineItem;
