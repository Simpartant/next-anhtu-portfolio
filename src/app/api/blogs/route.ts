import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { checkToken } from "@/lib/checkToken";

export async function POST(req: NextRequest) {
  const user = checkToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const { title, content, image, description, author } = await req.json();

  if (!title || !content || !image || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const newBlog = await Blog.create({
      title,
      content,
      image,
      description,
      author,
    });
    return NextResponse.json(newBlog, { status: 201 });
  } catch (err) {
    console.error("Error creating blog:", err);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

interface BlogFilter {
  title?: { $regex: string | null; $options: string };
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get search params from the request URL
    const { searchParams } = new URL(req.url);

    // Build filter object
    const filter: BlogFilter = {};
    if (searchParams.has("title")) {
      filter.title = { $regex: searchParams.get("title"), $options: "i" };
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
