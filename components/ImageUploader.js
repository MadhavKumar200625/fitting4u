"use client";

import { useState, useRef } from "react";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // 0 - 100
  const [fileInfo, setFileInfo] = useState(null);
  const inputRef = useRef(null);

  // Upload using XHR so we can show progress
  const uploadImage = async (file) => {
    if (!file) return;
    setFileInfo({ name: file.name, size: file.size });
    setUploading(true);
    setProgress(0);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `site-config/${Date.now()}.${ext}`;

      // get presigned url & public url
      const presignRes = await fetch(
        `/api/upload?fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(file.type)}`
      );

      if (!presignRes.ok) {
        const txt = await presignRes.text().catch(() => "");
        throw new Error(`Presign failed (${presignRes.status}): ${txt}`);
      }

      const presignData = await presignRes.json();
      const { uploadUrl, publicUrl } = presignData || {};

      if (!uploadUrl || !publicUrl) {
        throw new Error("Invalid presign response (missing uploadUrl/publicUrl).");
      }

      // XHR upload with progress
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setProgress(pct);
          }
        };

        xhr.onload = () => {
          // S3 responds 200 or 204 usually for presigned PUT
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network error during upload"));
        };

        xhr.onabort = () => {
          reject(new Error("Upload aborted"));
        };

        xhr.send(file);
      });

      // success
      setProgress(100);
      toast.success("Image uploaded!");
      onChange(publicUrl);
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error(typeof err?.message === "string" ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 400); // clear nicely
      setFileInfo(null);
      // reset file input so same file can be reselected if needed
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const deleteImage = async () => {
    if (!value) return;
    try {
      // get the key from the public URL (assumes publicUrl contains bucket domain + key)
      const parts = value.split(".com/");
      if (parts.length < 2) {
        throw new Error("Cannot determine S3 key from URL");
      }
      const key = parts[1];

      const res = await fetch(`/api/s3?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Delete failed (${res.status}): ${txt}`);
      }

      const data = await res.json();
      if (data?.success) {
        onChange("");
        toast.success("Image deleted");
      } else {
        throw new Error(data?.error || "Delete failed");
      }
    } catch (err) {
      console.error("S3 delete error:", err);
      toast.error(typeof err?.message === "string" ? err.message : "Delete failed");
    }
  };

  return (
    <div className="flex flex-col items-start gap-3 w-full">
      {/* Preview */}
      {value ? (
        <div className="relative w-full rounded-xl overflow-hidden border shadow-sm">
          <Image
            src={value}
            alt="Uploaded"
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
          />
          <button
            onClick={deleteImage}
            className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition"
            aria-label="Delete image"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : null}

      {/* Upload area */}
      <label className={`w-full cursor-pointer ${uploading ? "pointer-events-none opacity-70" : ""}`}>
        <div className="border border-dashed border-[#003466]/40 bg-[#f9fbff] p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#f0f6ff] transition">
          {uploading ? (
            <div className="flex items-center gap-3">
              <Loader2 size={18} className="animate-spin text-[#003466]" />
              <div className="flex flex-col items-start">
                <div className="text-sm font-medium text-gray-700">{fileInfo?.name || "Uploading..."}</div>
                <div className="text-xs text-gray-500">{fileInfo ? `${(fileInfo.size / 1024).toFixed(0)} KB` : ""}</div>
              </div>
            </div>
          ) : (
            <>
              <UploadCloud size={28} className="text-[#003466]" />
              <p className="text-sm text-gray-600">Click to upload an image</p>
            </>
          )}

          {/* progress */}
          {uploading && (
            <div className="w-full bg-[#e6eefc] rounded-full h-2 mt-3 overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-2 bg-[#003466] transition-all"
              />
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => uploadImage(e.target.files?.[0])}
        />
      </label>
    </div>
  );
}