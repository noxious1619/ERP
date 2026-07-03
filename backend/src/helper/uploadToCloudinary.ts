import type { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import cloudinary from "../lib/cloudinary.js";

export function uploadPdfToCloudinary(
  buffer: Buffer
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
   const uploadStream = cloudinary.uploader.upload_stream(
  {
    folder: "erp/homework",
    resource_type: "image",
    format: "pdf",
  },
  (error, result) => {
    console.log("UPLOAD RESULT:");
    console.log(result);

    if (error) return reject(error);
    resolve(result as UploadApiResponse);
  }
);

    Readable.from(buffer).pipe(uploadStream);
  });
}