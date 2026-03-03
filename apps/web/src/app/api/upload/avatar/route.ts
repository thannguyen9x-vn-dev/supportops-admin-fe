import { NextResponse } from "next/server";

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type UploadAvatarResponse = {
  fileName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  url: string;
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ code: "MISSING_FILE" }, { status: 400 });
  }

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json({ code: "INVALID_TYPE" }, { status: 415 });
  }

  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return NextResponse.json({ code: "FILE_TOO_LARGE" }, { status: 413 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  const response: UploadAvatarResponse = {
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    url: dataUrl,
  };

  return NextResponse.json(response);
}
