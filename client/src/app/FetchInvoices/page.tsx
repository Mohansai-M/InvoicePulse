"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function FetchInvoicesPage() {
  const [allInvoices, setAllInvoices] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllInvoices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/invoices", {
          withCredentials: true,
        });
        setAllInvoices(res.data.invoices || []);
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to fetch invoices");
      }
    };
    fetchAllInvoices();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Invoices</h1>

      {allInvoices.length === 0 ? (
        <p className="text-gray-500">No invoices found.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Invoice #</th>
              <th className="border px-3 py-2 text-left">Supplier</th>
              <th className="border px-3 py-2 text-left">Date</th>
              <th className="border px-3 py-2 text-right">Line Items</th>
              <th className="border px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {allInvoices.map((inv, idx) => {
              const totalAmount = inv.line_items?.reduce(
                (sum: number, item: any) => sum + item.line_total,
                0
              );
              return (
                <tr
                  key={inv._id || idx}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border px-3 py-2">{inv.invoice_number}</td>
                  <td className="border px-3 py-2">{inv.supplier_name}</td>
                  <td className="border px-3 py-2">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {inv.line_items?.length || 0}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    ₹{totalAmount?.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
