import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRecentVideosForChannel } from "@/lib/youtube";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { saveLecture } from "./actions";

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
            select: { videoId: true },
          })
        ).map((s) => s.videoId)
      : []
  );

  return (
    <main className="min-h-screen px-12 py-14 max-w-5xl mx-auto">
      <Link
        href="/"
        className="font-label text-xs text-tan/70 uppercase tracking-[0.25em] font-medium hover:text-tan transition-colors duration-300"
      >
        ← All scholars
      </Link>

      <header className="mt-10">
        <h1 className="font-display text-6xl text-tan leading-tight tracking-tight">
          {scholar.name}
        </h1>
        {scholar.bio && (
          <p className="font-display text-lg text-cream/80 leading-relaxed max-w-2xl mt-5">
            {scholar.bio}
          </p>
        )}
      </header>

      <div className="h-px bg-tan/15 my-12"></div>

      <p className="font-label text-xs text-tan/60 uppercase tracking-[0.25em] font-medium mb-6">
        Recent lectures
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((video) => {
          const isSaved = savedIds.has(video.videoId);
          return (
            <li key={video.videoId}>
              <div className="bg-cream rounded-xl overflow-hidden h-full flex flex-col group hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <Link
                    href={`/scholars/${scholar.id}/lectures/${video.videoId}`}
                    className="block aspect-video bg-mauve overflow-hidden relative"
                    >
                    <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        width={480}
                        height={270}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />
                    {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-plum/90 text-cream font-label text-[11px] font-semibold px-1.5 py-0.5 rounded">
                        {video.duration}
                        </div>
                    )}
                </Link>

                <div className="flex flex-col flex-1 px-5 py-4">
                  <Link
                    href={`/scholars/${scholar.id}/lectures/${video.videoId}`}
                    className="font-display text-base font-semibold text-plum leading-snug line-clamp-2 hover:text-mauve transition-colors duration-300"
                  >
                    {video.title}
                  </Link>

                  <p className="font-label text-[10px] text-mauve uppercase tracking-[0.15em] font-semibold mt-2">
                    {new Date(video.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  <div className="mt-auto pt-4">
                    <form action={saveLecture}>
                      <input type="hidden" name="scholarId" value={scholar.id} />
                      <input type="hidden" name="videoId" value={video.videoId} />
                      <input type="hidden" name="videoTitle" value={video.title} />
                      <input type="hidden" name="videoThumb" value={video.thumbnailUrl} />
                      <input type="hidden" name="videoDuration" value={video.duration} />
                      <input type="hidden" name="channelId" value={scholar.youtubeChannelId} />
                      <input type="hidden" name="channelName" value={scholar.name} />
                      <button
                        type="submit"
                        disabled={isSaved}
                        className={
                          isSaved
                            ? "font-label text-[11px] uppercase tracking-[0.15em] font-semibold px-3.5 py-1.5 rounded-md border border-mauve text-mauve cursor-not-allowed"
                            : "font-label text-[11px] uppercase tracking-[0.15em] font-semibold px-3.5 py-1.5 rounded-md bg-plum text-cream hover:bg-mauve transition-colors duration-300"
                        }
                      >
                        {isSaved ? "Saved" : "Save"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}