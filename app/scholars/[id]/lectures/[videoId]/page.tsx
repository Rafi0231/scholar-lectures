import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function LecturePage({
  params,
}: {
  params: Promise<{ id: string; videoId: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id, videoId } = await params;

  const scholar = await prisma.scholar.findUnique({
    where: { id },
  });

  if (!scholar) {
    notFound();
  }

  return (
    <main className="min-h-screen px-12 py-14 max-w-5xl mx-auto">
      <Link
        href={`/scholars/${id}`}
        className="font-label text-xs text-tan/70 uppercase tracking-[0.25em] font-medium hover:text-tan transition-colors duration-300"
      >
        ← Back to {scholar.name}
      </Link>

      {scholar.videosEmbeddable ? (
        <div className="mt-12">
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Lecture video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="font-display text-base text-cream/75">
              Lecture from {scholar.name}
            </p>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-label text-xs text-tan uppercase tracking-[0.18em] font-semibold hover:text-cream transition-colors duration-300"
            >
              Watch on YouTube ↗
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-12 bg-cream rounded-xl px-10 py-12 max-w-2xl mx-auto text-center shadow-2xl">
          <p className="font-display text-lg text-plum leading-relaxed">
            {scholar.name} hosts their lectures on YouTube directly.
          </p>
            <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-7 bg-plum text-cream font-label text-xs font-semibold uppercase tracking-[0.18em] px-7 py-3 rounded-lg hover:bg-mauve transition-colors duration-300"
          >
            Watch on YouTube ↗
          </a>
        </div>
      )}
    </main>
  );
}