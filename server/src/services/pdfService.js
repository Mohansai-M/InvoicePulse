import fs from "fs";
import { PDFParse } from "pdf-parse";



async function pdfService(filePath) {
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });
  const textResult = await parser.getText();
  await parser.destroy();
  return textResult;
}

export default pdfService;
