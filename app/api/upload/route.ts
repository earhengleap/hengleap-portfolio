import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const { isAuthenticated } = getKindeServerSession();
    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return new NextResponse("Invalid file type", { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return new NextResponse("File too large", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;

    try {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          fileUri,
          {
            folder: "portfolio",
            resource_type: "auto",
            allowed_formats: ["jpg", "png", "webp"],
            transformation: [
              { quality: "auto:good" },
              { fetch_format: "auto" }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });

      return NextResponse.json(uploadResult);
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return new NextResponse("Upload to Cloudinary failed", { status: 500 });
    }

  } catch (error) {
    console.error("General upload error:", error);
    return new NextResponse("Upload failed", { status: 500 });
  }
}

export const runtime = "nodejs";