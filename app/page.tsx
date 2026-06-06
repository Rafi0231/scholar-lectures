import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="p-8">
        <h1 className="text-2xl">Scholar Lectures</h1>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button type="submit" className="border px-4 py-2 mt-4">
            Sign in with Google
          </button>
        </form>
      </main>
    );
  }

  const scholars = await prisma.scholar.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl">Salam, {session.user.name}</h1>

      <h2 className="text-xl mt-8">Scholars</h2>
      <ul className="mt-4 space-y-3">
        {scholars.map((scholar) => (
          <li key={scholar.id}>
            <Link
              href={`/scholars/${scholar.id}`}
              className="block border p-3 hover:bg-gray-900"
            >
              <div className="font-medium">{scholar.name}</div>
              <div className="text-sm text-gray-600">{scholar.bio}</div>
            </Link>
          </li>
        ))}
      </ul>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit" className="border px-4 py-2 mt-8">
          Sign out
        </button>
      </form>
    </main>
  );
}