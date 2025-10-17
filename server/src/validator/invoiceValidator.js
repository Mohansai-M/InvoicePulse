import * as yup from "yup";

export const lineItemSchema = yup.object().shape({
  _id: yup.string().optional(),
  description: yup.string().required("Description is required").transform((value, originalValue) => value || " "),
  quantity: yup.number().required("Quantity is required").min(0),
  unit_price: yup.number().required("Unit price is required").min(0),
  line_total: yup.number().optional(), // computed server-side
});

export const invoiceSchema = yup.object().shape({
  supplier_name: yup.string().nullable(),
  invoice_number: yup.string().nullable(),
  invoice_date: yup.date().nullable(),
  subtotal: yup.number().nullable().min(0),
  total: yup.number().nullable().min(0),
  currency: yup.string().required(),
  line_items: yup.array().of(lineItemSchema).required(),
});
