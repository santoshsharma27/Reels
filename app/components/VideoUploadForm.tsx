"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2, CheckCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
    },
  });

  const videoUrl = watch("videoUrl");

  const handleUploadSuccess = (response: IKUploadResponse) => {
    try {
      setValue("videoUrl", response.filePath);
      setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
    } catch (error) {
      console.error("Upload handling failed:", error);
    }
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) return;

    setLoading(true);
    setSuccessMessage(null); // Reset previous success message

    try {
      await apiClient.createVideo(data);
      reset();
      setUploadProgress(0);
      setSuccessMessage("Video uploaded successfully!");

      // Hide message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Error submitting video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto p-6 text-white"
    >
      <div>
        <h1 className="text-3xl font-bold mb-8">Upload New Reel</h1>

        {successMessage && (
          <div className="flex items-center bg-green-600 text-white p-3 rounded-md mb-4">
            <CheckCircle className="w-5 h-5 mr-2" />
            <p>{successMessage}</p>
          </div>
        )}

        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          className={`w-full border rounded-md p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-500" : "border-gray-600"
          }`}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          className={`w-full border rounded-md p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 ${
            errors.description ? "border-red-500" : "border-gray-600"
          }`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-1">Upload Video</label>
        <FileUpload
          fileType="video"
          onSuccess={handleUploadSuccess}
          onProgress={handleUploadProgress}
        />
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md flex justify-center items-center hover:bg-blue-600 disabled:bg-gray-500"
        disabled={loading || !videoUrl}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing
            Video...
          </>
        ) : (
          "Publish Video"
        )}
      </button>
    </form>
  );
}
