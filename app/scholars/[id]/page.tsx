import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRecentVideosForChannel } from "@/lib/youtube";
import { redirect, notFound } from "next/navigation";
import { saveLecture } from "./actions";
import Link from "next/link";

export default async function ScholarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;

  const scholar = await prisma.scholar.findUnique({
    where: { id },
  });

  if (!scholar) {
    notFound();
  }

  const videos = await getRecentVideosForChannel(scholar.youtubeChannelId, 20);
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });
  const savedIds = new Set(
    user
        ? (
            await prisma.savedLecture.findMany({
                where: { userId: user.id },
                select: { videoId: true},
            })
        ).map((s) => s.videoId)
        : []
  );
  

  return (
    <main className="p-8">
      <Link href="/" className="text-sm text-gray-500 underline">
        ← Back
      </Link>

      <h1 className="text-2xl mt-4">{scholar.name}</h1>
      <p className="text-gray-600 mt-2">{scholar.bio}</p>

      <h2 className="text-xl mt-8">Recent videos</h2>
      <ul className="mt-4 space-y-4">
        {videos.map((video) => (
          <li key={video.videoId} className="border p-3 flex gap-4">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              width={160}
              height={90}
              className="flex-shrink-0"
            />
            <div>
            <Link
                href={`/scholars/${scholar.id}/lectures/${video.videoId}`}
                className="font-medium underline"
              >
                {video.title}
              </Link>
              <div className="text-sm text-gray-500 mt-1">
                {new Date(video.publishedAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                {video.description}
              </div>
              <form action={saveLecture} className="mt-2">
                <input type="hidden" name="scholarId" value={scholar.id} />
                <input type="hidden" name="videoId" value={video.videoId} />
                <input type="hidden" name="videoTitle" value={video.title} />
                <input type="hidden" name="videoThumb" value={video.thumbnailUrl} />
                <input type="hidden" name="channelId" value={scholar.youtubeChannelId} />
                <input type="hidden" name="channelName" value={scholar.name} />
                <button
                  type="submit"
                  disabled={savedIds.has(video.videoId)}
                  className="text-sm border px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savedIds.has(video.videoId) ? "Saved" : "Save"}
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


