import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-sm bg-cream rounded-xl p-10 shadow-lg">
          <div className="text-center">
            <h1 className="font-display text-3xl text-plum text-center leading-tight">
              Scholar Lectures
            </h1>
            <p className="font-label text-[10px] text-mauve uppercase tracking-[0.2em] mt-2 font-medium">
              powered by <span className="font-semibold">Lantern Software</span>
            </p>
          </div>

          <div className="h-px bg-mauve/15 my-7"></div>

          <p className="font-display text-mauve text-center text-base">
            Sign in to continue
          </p>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
            className="mt-5"
          >
            <button
              type="submit"
              className="w-full bg-mauve text-cream font-label text-xs font-semibold uppercase tracking-[0.15em] py-3 rounded-lg hover:bg-rose transition-colors duration-300"
            >
              Sign in with Google
            </button>
          </form>
        </div>
      </main>
    );
  }

  const scholars = await prisma.scholar.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen px-12 py-14 max-w-5xl mx-auto">
      <header className="mb-14">
        <h1 className="font-display text-8xl leading-none tracking-tight title-ember">
          Scholar Lectures
        </h1>
        <p className="font-label text-sm text-cream/70 uppercase tracking-[0.28em] mt-5 font-medium">
          powered by <span className="font-semibold text-cream">Lantern Software</span>
        </p>

        <div className="mt-20 flex items-baseline justify-between">
          <p className="font-display text-2xl text-cream/85">
            Salam, {session.user.name}
          </p>
          <Link
            href="/saved"
            className="font-label text-xs text-tan uppercase tracking-[0.18em] font-semibold hover:text-cream transition-colors duration-300"
          >
            View saved lectures →
          </Link>
        </div>
      </header>

      <div className="h-px bg-tan/15 mb-8"></div>

      <p className="font-label text-xs text-tan/60 uppercase tracking-[0.25em] font-medium mb-5">
        Scholars
      </p>

      <ul className="flex flex-col gap-3">
        {scholars.map((scholar) => (
          <li key={scholar.id}>
            <Link
              href={`/scholars/${scholar.id}`}
              className="group block bg-cream rounded-xl px-7 py-6 h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              <div className="font-display text-2xl font-semibold text-plum leading-snug">
                {scholar.name}
              </div>
              <div className="font-label text-[10px] text-rose uppercase tracking-[0.15em] font-semibold mt-2">
                {scholar.bio?.split(".")[0] || "View lectures"}
              </div>

              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <div className="overflow-hidden">
                  <p className="font-display text-sm text-mauve leading-relaxed mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {scholar.bio}
                  </p>
                  <p className="font-label text-[11px] text-mauve uppercase tracking-[0.15em] font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                    View lectures →
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-16 flex justify-end">
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="font-label text-xs text-tan/55 uppercase tracking-[0.15em] font-medium hover:text-tan transition-colors duration-300"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}