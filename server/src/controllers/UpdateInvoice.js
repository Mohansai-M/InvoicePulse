import mongoose from "mongoose";
import Invoice from "../models/Invoice.js";
import LineItem from "../models/lineItem.js";

export const updateInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    
    const { line_items = [], ...invoiceFields } = req.body;

   
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }


    Object.assign(invoice, invoiceFields);
    invoice.status = "SAVED";
    await invoice.save();


    const updatedLineItems = [];
    for (const item of line_items) {
      if (item._id && mongoose.Types.ObjectId.isValid(item._id)) {
        const existing = await LineItem.findById(item._id);
        if (existing) {
          Object.assign(existing, item);
          existing.line_total = existing.quantity * existing.unit_price;
          await existing.save();
          updatedLineItems.push(existing);
        }
      } else {
        if (!item.description) item.description = " ";
        const newItem = await LineItem.create({
          ...item,
          invoice_id: invoice._id,
          line_total: item.quantity * item.unit_price,
        });
        updatedLineItems.push(newItem);
      }
    }


    // const updatedIds = updatedLineItems.map((i) => i._id);
    // await LineItem.deleteMany({
    //   invoice_id: invoice._id,
    //   _id: { $nin: updatedIds },
    // });

    res.status(200).json({
      success: true,
      invoice: { ...invoice.toObject(), line_items: updatedLineItems },
      message: "Invoice updated successfully",
    });
  } catch (err) {
    console.error("Update Invoice Error:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};
