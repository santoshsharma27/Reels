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
    <main className="container mx-auto px-4 py-8">
      {status === "unauthenticated" && (
        <h2 className="text-2xl font-bold mb-8 text-center">
          Sign in to upload and watch reels{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-600 cursor-pointer text-xl underline"
          >
            Login
          </Link>
        </h2>
      )}

      {status === "authenticated" && (
        <>
          {loading ? (
            <h2 className="text-2xl font-semibold text-center">
              Loading videos...
            </h2>
          ) : videos.length > 0 ? (
            <VideoFeed videos={videos} />
          ) : (
            <h2 className="text-xl font-semibold text-center text-gray-500">
              No videos found
            </h2>
          )}
        </>
      )}
    </main>
  );
}
