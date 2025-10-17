import Invoice from "../models/Invoice.js";
import LineItem from "../models/lineItem.js";

// Get all invoices
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, invoices });
  } catch (err) {
    console.error("Error fetching invoices:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

// Get a single invoice and its line items
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    const line_items = await LineItem.find({ invoice_id: invoice._id });
    return res.status(200).json({
      success: true,
      invoice: { ...invoice.toObject(), line_items },
    });
  } catch (err) {
    console.error("Error fetching invoice:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
