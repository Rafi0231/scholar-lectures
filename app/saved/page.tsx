import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { removeLecture } from "../scholars/[id]/actions";

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/");
  }

  const savedLectures = await prisma.savedLecture.findMany({
    where: { userId: user.id },
    orderBy: { savedAt: "desc" },
  });

  return (
    <main className="min-h-screen px-12 py-14 max-w-5xl mx-auto">
      <Link
        href="/"
        className="font-label text-xs text-tan/70 uppercase tracking-[0.25em] font-medium hover:text-tan transition-colors duration-300"
      >
        ← Back home
      </Link>

      <header className="mt-10">
        <h1 className="font-display text-6xl leading-tight tracking-tight title-ember">
          Saved Lectures
        </h1>
        <p className="font-display text-lg text-cream/80 mt-4">
          {savedLectures.length === 0
            ? "Nothing saved yet."
            : `${savedLectures.length} ${savedLectures.length === 1 ? "lecture" : "lectures"} saved.`}
        </p>
      </header>

      <div className="h-px bg-tan/15 my-12"></div>

      {savedLectures.length === 0 ? (
        <div className="bg-cream rounded-xl px-10 py-14 text-center max-w-xl mx-auto shadow-2xl">
          <p className="font-display text-base text-plum leading-relaxed">
            Save lectures from the scholar pages to view them here later.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 bg-plum text-cream font-label text-xs font-semibold uppercase tracking-[0.18em] px-7 py-3 rounded-lg hover:bg-mauve transition-colors duration-300"
          >
            Browse scholars →
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedLectures.map((lecture) => (
            <li key={lecture.id}>
              <div className="group bg-cream rounded-xl overflow-hidden h-full flex flex-col hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <Link
                  href={`/scholars/${lecture.scholarId}/lectures/${lecture.videoId}`}
                  className="block aspect-video bg-mauve overflow-hidden relative"
                >
                  <img
                    src={lecture.videoThumb}
                    alt={lecture.videoTitle}
                    width={480}
                    height={270}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                  {lecture.videoDuration && (
                    <div className="absolute bottom-2 right-2 bg-plum/90 text-cream font-label text-[11px] font-semibold px-1.5 py-0.5 rounded">
                      {lecture.videoDuration}
                    </div>
                  )}
                </Link>

                <div className="flex flex-col flex-1 px-5 py-4">
                  <Link
                    href={`/scholars/${lecture.scholarId}/lectures/${lecture.videoId}`}
                    className="font-display text-base font-semibold text-plum leading-snug line-clamp-2 hover:text-mauve transition-colors duration-300"
                  >
                    {lecture.videoTitle}
                  </Link>

                  <p className="font-label text-[10px] text-rose uppercase tracking-[0.15em] font-semibold mt-2">
                    {lecture.channelName}
                  </p>

                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <p className="font-label text-[10px] text-mauve/70 uppercase tracking-[0.15em] font-medium">
                      Saved {new Date(lecture.savedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <form action={removeLecture}>
                      <input type="hidden" name="videoId" value={lecture.videoId} />
                      <button
                        type="submit"
                        className="font-label text-[10px] text-mauve/70 uppercase tracking-[0.15em] font-medium hover:text-rose transition-colors duration-300 cursor-pointer"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}