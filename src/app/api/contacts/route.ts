import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

const resend = new Resend(process.env.RESEND_API_KEY);

const buildEmailHtml = (data: {
  name: string;
  email: string;
  phone: string;
  project: string;
  message: string;
}) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
    <h2 style="color: #2E86C1;">Cảm ơn bạn đã liên hệ với chúng tôi!</h2>
    <p>Chúng tôi đã nhận được thông tin của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
    <h3>Thông tin bạn đã gửi:</h3>
    <p><strong>Họ tên:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Số điện thoại:</strong> ${data.phone}</p>
    <p><strong>Dự án quan tâm:</strong> ${data.project}</p>
    <p><strong>Lời nhắn:</strong> ${data.message}</p>
    <hr style="margin: 20px 0;" />
    <p style="font-size: 0.9em; color: #999;">Đây là email tự động, vui lòng không phản hồi.</p>
    <p style="font-size: 0.9em; color: #999;">Trân trọng,<br/>Đội ngũ hỗ trợ khách hàng</p>
  </div>
`;

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    // Lưu vào MongoDB
    await Contact.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      project: data.project,
      message: data.message,
    });

    // Gửi email qua Resend
    await resend.emails.send({
      from: "no-reply@nguyenanhtu.vn <onboarding@resend.dev>",
      to: "anhtu.tenmien@gmail.com",
      subject: "Thông tin liên hệ mới từ website",
      html: buildEmailHtml(data),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
