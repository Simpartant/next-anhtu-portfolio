import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

// Types
interface DeleteParams {
  params: Promise<{ id: string }>;
}

interface GetParams {
  params: Promise<{ id: string }>;
}

interface ApiResponse {
  message?: string;
  error?: string;
  data?: unknown;
}

// Database connection singleton
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private clientPromise: Promise<MongoClient>;

  private constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }
    const client = new MongoClient(process.env.MONGODB_URI);
    this.clientPromise = client.connect();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async getClient(): Promise<MongoClient> {
    return this.clientPromise;
  }
}

// Utility functions
const validateBlogId = (id: string): boolean => {
  return typeof id === "string" && id.length > 0 && ObjectId.isValid(id);
};

const createErrorResponse = (
  message: string,
  status: number
): NextResponse<ApiResponse> => {
  return NextResponse.json({ error: message }, { status });
};

const createSuccessResponse = (
  message: string,
  status: number = 200
): NextResponse<ApiResponse> => {
  return NextResponse.json({ message }, { status });
};

const createDataResponse = (
  data: unknown,
  status: number = 200
): NextResponse<ApiResponse> => {
  return NextResponse.json({ data }, { status });
};

// GET handler - Get blog by ID
export async function GET(
  request: NextRequest,
  { params }: GetParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await params;

    if (!validateBlogId(id)) {
      return createErrorResponse(
        !id ? "Blog ID is required" : "Invalid blog ID format",
        400
      );
    }

    const dbConnection = DatabaseConnection.getInstance();
    const client = await dbConnection.getClient();
    const db = client.db();
    const collection = db.collection("blogs");

    const blogId = new ObjectId(id);

    const blog = await collection.findOne({ _id: blogId });

    if (!blog) {
      return createErrorResponse("Blog not found", 404);
    }

    return createDataResponse(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE handler - Delete blog by ID
export async function DELETE(
  request: NextRequest,
  { params }: DeleteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await params;

    if (!validateBlogId(id)) {
      return createErrorResponse(
        !id ? "Blog ID is required" : "Invalid blog ID format",
        400
      );
    }

    const dbConnection = DatabaseConnection.getInstance();
    const client = await dbConnection.getClient();
    const db = client.db();
    const collection = db.collection("blogs");

    const blogId = new ObjectId(id);

    const existingBlog = await collection.findOne({ _id: blogId });

    if (!existingBlog) {
      return createErrorResponse("Blog not found", 404);
    }

    const result = await collection.deleteOne({ _id: blogId });

    if (result.deletedCount === 0) {
      return createErrorResponse("Failed to delete blog", 500);
    }

    return createSuccessResponse("Blog deleted successfully");
  } catch (error) {
    console.error("Error deleting blog:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// PATCH handler - Update blog by ID
export async function PATCH(
  request: NextRequest,
  { params }: GetParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await params;

    if (!validateBlogId(id)) {
      return createErrorResponse(
        !id ? "Blog ID is required" : "Invalid blog ID format",
        400
      );
    }

    // Detect content type and parse body accordingly
    let body: Record<string, unknown> = {};
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        body[key] = value;
      });
    } else {
      return createErrorResponse("Unsupported Content-Type", 415);
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return createErrorResponse("Invalid request body", 400);
    }

    if ("_id" in body) {
      delete body._id;
    }

    const dbConnection = DatabaseConnection.getInstance();
    const client = await dbConnection.getClient();
    const db = client.db();
    const collection = db.collection("blogs");

    const blogId = new ObjectId(id);

    const existingBlog = await collection.findOne({ _id: blogId });
    if (!existingBlog) {
      return createErrorResponse("Blog not found", 404);
    }

    const updateResult = await collection.updateOne(
      { _id: blogId },
      { $set: body }
    );

    if (updateResult.matchedCount === 0) {
      return createErrorResponse("Failed to update blog", 500);
    }

    const updatedBlog = await collection.findOne({ _id: blogId });
    return createDataResponse(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
