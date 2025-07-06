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
const validateProductId = (id: string): boolean => {
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

// GET handler - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: GetParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await params;

    // Validate product ID
    if (!validateProductId(id)) {
      return createErrorResponse(
        !id ? "Product ID is required" : "Invalid product ID format",
        400
      );
    }

    // Get database connection
    const dbConnection = DatabaseConnection.getInstance();
    const client = await dbConnection.getClient();
    const db = client.db();
    const collection = db.collection("products");

    const productId = new ObjectId(id);

    // Find the product
    const product = await collection.findOne({ _id: productId });

    if (!product) {
      return createErrorResponse("Product not found", 404);
    }

    return createDataResponse(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// Main DELETE handler
export async function DELETE(
  request: NextRequest,
  { params }: DeleteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await params;

    // Validate product ID
    if (!validateProductId(id)) {
      return createErrorResponse(
        !id ? "Product ID is required" : "Invalid product ID format",
        400
      );
    }

    // Get database connection
    const dbConnection = DatabaseConnection.getInstance();
    const client = await dbConnection.getClient();
    const db = client.db();
    const collection = db.collection("products");

    const productId = new ObjectId(id);

    // Check if product exists
    const existingProduct = await collection.findOne({ _id: productId });

    if (!existingProduct) {
      return createErrorResponse("Product not found", 404);
    }

    // Delete the product
    const result = await collection.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return createErrorResponse("Failed to delete product", 500);
    }

    return createSuccessResponse("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// PATCH handler - Update product by ID
export async function PATCH(
  request: NextRequest,
  { params }: GetParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await params;

    // Validate product ID
    if (!validateProductId(id)) {
      return createErrorResponse(
        !id ? "Product ID is required" : "Invalid product ID format",
        400
      );
    }

    // Parse request body as FormData
    const formData = await request.formData();
    const body: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      body[key] = value;
    });

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return createErrorResponse("Invalid request body", 400);
    }

    // Remove _id from body before updating
    if ("_id" in body) {
      delete body._id;
    }

    // Get database connection
    const dbConnection = DatabaseConnection.getInstance();
    const client = await dbConnection.getClient();
    const db = client.db();
    const collection = db.collection("products");

    const productId = new ObjectId(id);

    // Check if product exists
    const existingProduct = await collection.findOne({ _id: productId });
    if (!existingProduct) {
      return createErrorResponse("Product not found", 404);
    }

    // Update the product
    const updateResult = await collection.updateOne(
      { _id: productId },
      { $set: body }
    );

    if (updateResult.matchedCount === 0) {
      return createErrorResponse("Failed to update product", 500);
    }

    // Return updated product
    const updatedProduct = await collection.findOne({ _id: productId });
    return createDataResponse(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
