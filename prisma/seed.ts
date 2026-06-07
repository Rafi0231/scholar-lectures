import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.scholar.createMany({
    data: [
      {
        name: "MEC Morton Grove",
        bio: "Muslim Education Center in Morton Grove, Illinois. Friday khutbas amd lectures from resident and visiting scholars.",
        youtubeChannelId: "UCzFLx26wWIJJo8HKTq7pWMw",
        videosEmbeddable: false,
      },
      {
        name: "Omar Suleiman",
        bio: "Founder of Yaqeen Institute, focused on contemporary issues and Islamic ethics.",
        youtubeChannelId: "UC3vHW2h22WE-pNi5WJtRIjg",
      },
      {
        name: "Nouman Ali Khan",
        bio: "Founder of Bayyinah Institute, focused on Quranic Arabic and tafsir.",
        youtubeChannelId: "UCRtiU-lpcBSi-ipFKyfIkug",
      },
    ],
    skipDuplicates: true,
  });

  const count = await prisma.scholar.count();
  console.log(`Scholars in database: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());