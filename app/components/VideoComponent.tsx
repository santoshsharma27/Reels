import { IKVideo } from "imagekitio-next";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div>
      <figure className="relative px-4 pt-4">
        <div
          className="rounded-lg overflow-hidden relative w-full"
          style={{ aspectRatio: "12/16" }}
        >
          <IKVideo
            path={video.videoUrl}
            transformation={[{ height: "1920", width: "1080" }]}
            controls={video.controls}
            className="w-full h-full object-cover"
          />
        </div>
      </figure>

      <div className="p-4">
        <p className="text-lg font-semibold text-white">{video.title}</p>

        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}
