export type InvoiceStatus = "UPLOADED" | "EXTRACTED" | "NEEDS_REVIEW" | "SAVED";

export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Invoice {
  id?: string;
  status: InvoiceStatus;
  file_path?: string;
  supplier_name?: string | null;
  invoice_number?: string | null;
  invoice_date?: string | null; // ISO date string
  currency?: string | null;
  subtotal?: number | null;
  total?: number | null;
  raw_llm_json?: any;
  line_items: LineItem[]; // always present (default to [])
}
