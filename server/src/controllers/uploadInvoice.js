import LineItem from "../models/lineItem.js";
import Invoice from "../models/Invoice.js";
import { extractInvoiceData } from "../services/llmService.js";
import { invoiceSchema } from "../validator/invoiceValidator.js";

const uploadInvoice = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "File is required" });
    }

    const invoice = await Invoice.create({
      file_path: req.file.path,
      status: "UPLOADED",
      supplier_name: null,
      invoice_number: null,
      invoice_date: null,
      subtotal: null,
      total: null,
      currency: "INR",
      raw_llm_json: null,
    });

    const llmResult = await extractInvoiceData(req.file.path);



    const validatedData = await invoiceSchema.validate(
      {
        supplier_name: llmResult.supplier_name,
        invoice_number: llmResult.invoice_number,
        invoice_date: llmResult.invoice_date,
        subtotal: llmResult.subtotal,
        total: llmResult.total,
        currency: llmResult.currency || "INR",
        line_items: llmResult.line_items || [],
      },
      { abortEarly: false }
    );

  
    Object.assign(invoice, {
      ...validatedData,
      raw_llm_json: llmResult.raw_llm_json,
      status: "EXTRACTED",
    });
    await invoice.save();


    let savedLineItems = [];
    if (validatedData.line_items.length > 0) {
      const lineItems = validatedData.line_items.map((item) => ({
        invoice_id: invoice._id,
        description: item.description || "N/A",
        quantity: item.quantity || 0,
        unit_price: item.unit_price || 0,
        line_total: item.line_total || item.quantity * item.unit_price,
      }));
      savedLineItems = await LineItem.insertMany(lineItems);
    }


    res.status(200).json({
      success: true,
      invoice: {
        ...invoice.toObject(),
        line_items: savedLineItems,
      },
      message: "Invoice uploaded and extracted successfully",
    });
  } catch (error) {
    console.error("Upload Invoice Error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

export default uploadInvoice;

