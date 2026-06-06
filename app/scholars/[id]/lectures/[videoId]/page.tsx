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
    <main className="p-8">
      <Link
        href={`/scholars/${id}`}
        className="text-sm text-gray-500 underline"
      >
        ← Back to {scholar.name}
      </Link>

      <div className="mt-4 aspect-video w-full max-w-3xl">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Lecture video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

    <div className="mt-4 max-w-3xl flex items-center justify-between">
        <p className="text-sm text-gray-500">
            Lecture from {scholar.name}
        </p>
            <a>
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline"
            
            Watch on YouTube ↗
            </a>
        </div>
    </main>
  );
}