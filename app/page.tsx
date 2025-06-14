"use client";

import React, { useEffect, useState } from "react";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";
import VideoFeed from "./components/VideoFeed";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchVideos();
    }
  }, [status]);

  return (
    <div>
      {status === "unauthenticated" && (
        <h1 className="text-2xl font-bold mb-8 text-center pt-32">
          Sign in to upload and watch reels{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 cursor-pointer text-xl underline"
            aria-label="Go to login page"
          >
            Login
          </Link>
        </h1>
      )}

      {status === "authenticated" && (
        <>
          {loading ? (
            <p className="text-2xl font-semibold text-center" role="status">
              Loading videos...
            </p>
          ) : videos.length > 0 ? (
            <VideoFeed videos={videos} />
          ) : (
            <h2 className="text-xl font-semibold text-center text-gray-500">
              No videos found
            </h2>
          )}
        </>
      )}
    </div>
  );
}
