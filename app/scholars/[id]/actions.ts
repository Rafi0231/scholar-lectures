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
  const videoDuration = formData.get("videoDuration") as string;
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
        videoDuration: videoDuration || null,
        channelId,
        channelName,
      },
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return;
    }
    throw error;
  }
  
  revalidatePath("/saved");
}

export async function removeLecture(formData: FormData) {
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
  
  const videoId = formData.get("videoId") as string;
  
  await prisma.savedLecture.deleteMany({
    where: {
      userId: user.id,
      videoId,
    },
  });
  
  revalidatePath("/saved");
}