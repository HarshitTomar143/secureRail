"use client";

import { useState } from "react";

export default function GenerateQRPage() {
  const [form, setForm] = useState({
    vendor_id: "",
    vendor_name: "",
    product_type: "",
    manufactured_location: "",
    manufactured_time: "",
  });

  const [qrUrl, setQrUrl] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.qr_image_url) {
      setQrUrl(data.qr_image_url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Generate Product QR</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-2xl shadow max-w-lg"
      >
        <select
          name="vendor_name"
          value={form.vendor_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Vendor Name</option>
          <option value="John Doe">John Doe</option>
          
        </select>

        <select
          name="vendor_id"
          value={form.vendor_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Vendor's Id</option>
          <option value="a45b84be-3fe9-4823-a9df-fcaaa01649c3">a45b84be-3fe9-4823-a9df-fcaaa01649c3</option>
        </select>
        

        <select
          name="product_type"
          value={form.product_type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Product Type</option>
          <option value="Rail Clips">Rail Clips</option>
          <option value="Rail Pads">Rail Pads</option>
          <option value="Food">Food</option>
        </select>

        <input
          type="text"
          name="manufactured_location"
          placeholder="Manufactured Location"
          value={form.manufactured_location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="datetime-local"
          name="manufactured_time"
          value={form.manufactured_time}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Generate
        </button>
      </form>

      {qrUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">QR Code Generated:</h2>
          <img src={qrUrl} alt="QR Code" className="w-48 h-48 border p-2" />
        </div>
      )}
    </div>
  );
}
