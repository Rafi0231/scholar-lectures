"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function saveLecture(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new Error("User not found");
  }
  
  const scholarId = formData.get("scholarId") as string;
  const videoId = formData.get("videoId") as string;
  const videoTitle = formData.get("videoTitle") as string;
  const videoThumb = formData.get("videoThumb") as string;
  const channelId = formData.get("channelId") as string;
  const channelName = formData.get("channelName") as string;
  
  try {
    await prisma.savedLecture.create({
      data: {
        userId: user.id,
        scholarId,
        videoId,
        videoTitle,
        videoThumb,
        channelId,
        channelName,
      },
    });
  } catch (error: any) {
    // P2002 = unique constraint violation (already saved)
    if (error.code === "P2002") {
      // Already saved — that's fine, do nothing
      return;
    }
    throw error;
  }
  
  revalidatePath("/saved");
}