import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    console.log("✅ API /api/products called");

    // 1. Parse body
    const body = await req.json();
    console.log("📥 Request body:", body);

    const { vendor_id, vendor_name, product_type, manufactured_location, manufactured_time } = body;

    if (!vendor_id || !vendor_name) {
      console.error("❌ Missing required fields");
      return NextResponse.json({ error: "vendor_id and vendor_name are required" }, { status: 400 });
    }

    // 2. Generate a product_id
    const product_id = crypto.randomUUID();
    console.log("🆕 Generated product_id:", product_id);

    // 3. Generate QR code data
    const qrData = `product_id:${product_id}`;
    console.log("🔗 QR Data string:", qrData);

    const qrImageBuffer = await QRCode.toBuffer(qrData);
    console.log("🖼️ QR code buffer generated, size:", qrImageBuffer.length);

    // 4. Upload QR image to Supabase bucket
    const fileName = `${product_id}.png`;
    console.log("📤 Uploading QR code as:", fileName);

    const { data: storageData, error: storageError } = await supabase.storage
      .from("qr")
      .upload(fileName, qrImageBuffer, { contentType: "image/png" });

    if (storageError) {
      console.error("❌ Supabase storage error:", storageError);
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }
    console.log("✅ Uploaded to storage:", storageData);

    // 5. Get public URL
    const { data: publicUrlData } = supabase.storage.from("qr").getPublicUrl(fileName);
    const qr_image_url = publicUrlData.publicUrl;
    console.log("🌍 Public URL of QR:", qr_image_url);

    // 6. Insert into products table
    const { data: insertData, error: insertError } = await supabase.from("products").insert([
      {
        product_id,
        vendor_id,
        vendor_name,
        product_type,
        manufactured_location,
        manufactured_time,
        created_at: new Date().toISOString(),
        qr_image_url,
      },
    ]);

    if (insertError) {
      console.error("❌ Supabase insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    console.log("✅ Inserted into products table:", insertData);

    // 7. Success response
    return NextResponse.json({
      success: true,
      product_id,
      qr_image_url,
    });
  } catch (err) {
    console.error("🔥 Unexpected error in /api/products:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
