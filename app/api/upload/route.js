import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ----------------------
// 📤 GENERATE UPLOAD URL
// ----------------------
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");
    const contentType = searchParams.get("contentType") || "image/jpeg";

    if (!fileName) {
      return Response.json({ error: "fileName is required" }, { status: 400 });
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 120 });
    const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return Response.json({ uploadUrl, publicUrl });
  } catch (err) {
    console.error("S3 URL generation failed:", err);
    return Response.json({ error: "S3 URL generation failed" }, { status: 500 });
  }
}

// ----------------------
// ❌ DELETE FILE FROM S3
// ----------------------
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileKey = searchParams.get("key");

    if (!fileKey) {
      return Response.json({ error: "Missing 'key' query param" }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey,
    });

    await s3.send(command);
    return Response.json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    console.error("S3 delete failed:", err);
    return Response.json({ error: "S3 delete failed" }, { status: 500 });
  }
}