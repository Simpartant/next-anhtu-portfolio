import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  const user = verifyToken(token || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, category, type, slug } = await req.json();

  if (!name || !description || !category || !type || !slug) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const newProject = await Project.create({
      name,
      description,
      category,
      type,
      slug,
    });
    return NextResponse.json(newProject, { status: 201 });
  } catch (err) {
    console.error("Error creating project:", err);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type");

    const filter: Record<string, string> = {};
    if (category) filter.category = category;
    if (type) filter.type = type;

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
