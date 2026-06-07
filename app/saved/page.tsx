import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { saveLecture } from "../scholars/[id]/actions";

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
    <main className="p-8">
      <Link href="/" className="text-sm text-gray-500 underline">
        ← Back
      </Link>
      
      <h1 className="text-2xl mt-4">Saved lectures</h1>
      
      {savedLectures.length === 0 ? (
        <p className="text-gray-600 mt-4">You haven't saved any lectures yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {savedLectures.map((lecture) => (
            <li key={lecture.id} className="border p-3 flex gap-4">
              <img
                src={lecture.videoThumb}
                alt={lecture.videoTitle}
                width={160}
                height={90}
                className="flex-shrink-0"
              />
              <div>
                <a
                  href={`/scholars/${lecture.scholarId}/lectures/${lecture.videoId}`}
                  className="font-medium underline"
                >
                  {lecture.videoTitle}
                </a>
                <div className="text-sm text-gray-500 mt-1">
                  {lecture.channelName} · Saved {new Date(lecture.savedAt).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}