"use client";
import axios from "axios";
import { useState } from "react";
import { Invoice, LineItem } from "./types/index";
import "./invoice.css"; 

axios.defaults.withCredentials = true;

export default function Home() {

  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setInvoiceFile(e.target.files[0]);
  };

  const uploadInvoice = async () => {
    if (!invoiceFile) return alert("Select a file first!");
    const formData = new FormData();
    formData.append("file", invoiceFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/invoices/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setInvoiceData(res.data.invoice);
    } catch (err: any) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  const updateInvoice = async () => {
    if (!invoiceData) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/invoices/${invoiceData._id}`,
        invoiceData
      );
      setInvoiceData(res.data.invoice);
      alert("Invoice updated!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    if (!invoiceData) return;

    setInvoiceData((prev) => {
      if (!prev) return prev;

      const line_items = prev.line_items.map((item, idx) => {
        if (idx !== index) return item;

        const updatedItem = {
          ...item,
          [field]:
            field === "quantity" || field === "unit_price"
              ? Number(value)
              : value,
        };
        updatedItem.line_total = updatedItem.quantity * updatedItem.unit_price;
        return updatedItem;
      });

      return { ...prev, line_items };
    });
  };


  const addLineItem = () => {
    if (!invoiceData) return;
    setInvoiceData({
      ...invoiceData,
      line_items: [
        ...invoiceData.line_items,
        { description: "", quantity: 0, unit_price: 0, line_total: 0 },
      ],
    });
  };

  return (
    <div className="invoice-container">
      <div className="p-4">
      </div>
      <h2 className="invoice-header">Invoice Uploader & Editor</h2>

      <div className="file-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadInvoice} className="btn-upload">
          Upload
        </button>
      </div>

      {invoiceData && (
        <div className="invoice-box">
          <h3 className="section-title">Invoice Details</h3>
          <input
            type="text"
            value={invoiceData.supplier_name || ""}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, supplier_name: e.target.value })
            }
            placeholder="Supplier Name"
            className="input-field"
          />
          <input
            type="text"
            value={invoiceData.invoice_number || ""}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, invoice_number: e.target.value })
            }
            placeholder="Invoice #"
            className="input-field"
          />

          <h4 className="section-title">Line Items</h4>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.line_items?.map((item, idx) => (
                <tr key={item._id || idx}>
                  <td>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(idx, "description", e.target.value)
                      }
                      className="table-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(idx, "quantity", e.target.value)
                      }
                      className="table-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) =>
                        updateLineItem(idx, "unit_price", e.target.value)
                      }
                      className="table-input"
                    />
                  </td>
                  <td className="align-right">₹{item.line_total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="action-buttons">
            <button onClick={addLineItem} className="btn-add">
              Add Line Item
            </button>
            <button onClick={updateInvoice} className="btn-save">
              Save / Update Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
