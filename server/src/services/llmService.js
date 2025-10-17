import fs from "fs";
import { OpenAI } from "openai";
import pdfService from "./pdfService.js";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getFileExtension(filename) {
  const parts = filename.split(".");
  return parts.pop().toLowerCase();
}

export async function extractInvoiceData(filePath) {
  try {
    const ext = getFileExtension(filePath);
    let llmData = {};

    if (ext === "jpg" || ext === "png") {
      const fileBuffer = fs.readFileSync(filePath, "base64");

      const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extract invoice fields as JSON: supplier_name, invoice_number, invoice_date, currency, subtotal, total, line_items (description, quantity, unit_price, line_total)`,
              },
              {
                type: "input_image",
                image_url: `data:image/jpeg;base64,${fileBuffer}`,
              },
            ],
          },
        ],
      });

      llmData = JSON.parse(response.output_text || "{}");
    } else if (ext === "pdf") {
      const pdfText = await pdfService(filePath);

      const prompt = `Extract invoice fields as JSON (supplier_name, invoice_number, invoice_date, currency, subtotal, total, line_items).
       Example format:   {
                        "supplier_name": "",
                         "invoice_number": "",
                         "invoice_date": "",
                         "currency": "INR",
                         "subtotal": 0,
                         "total": 0,
                         "line_items": [
                         { "description": "", "quantity": 0, "unit_price": 0, "line_total": 0 } ]}
                         Invoice text: ${pdfText}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
      });

      const outputText =
        completion.choices?.[0]?.message?.content?.[0]?.text || "{}";
      llmData = JSON.parse(outputText);
    }

    if (!Array.isArray(llmData.line_items)) llmData.line_items =   [{ "description": "", "quantity": 0, "unit_price": 0, "line_total": 0 }];

    return {
      supplier_name: llmData.supplier_name || null,
      invoice_number: llmData.invoice_number || null,
      invoice_date: llmData.invoice_date || null,
      subtotal: llmData.subtotal || null,
      total: llmData.total || null,
      currency: llmData.currency || "INR",
      line_items: llmData.line_items,
      raw_llm_json: llmData,
    };
  } catch (error) {
    console.error("LLM extraction error:", error);
    return {
      supplier_name: null,
      invoice_number: null,
      invoice_date: null,
      subtotal: null,
      total: null,
      currency: "INR",
      line_items: [],
      raw_llm_json: { error: error.message },
    };
  }
}
