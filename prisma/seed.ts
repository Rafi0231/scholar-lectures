import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ScholarSeed {
  name: string;
  bio: string;
  youtubeChannelId: string;
  videosEmbeddable: boolean;
}

const scholars: ScholarSeed[] = [
  {
    name: "MEC Morton Grove",
    bio: "A Muslim community center in Morton Grove, Illinois. Friday khutbahs and lectures from resident and visiting scholars.",
    youtubeChannelId: "UCzFLx26wWIJJo8HKTq7pWMw",
    videosEmbeddable: false,
  },
  {
    name: "Shaykh Omar Suleiman",
    bio: "Founder of Yaqeen Institute. Lectures on contemporary issues, Islamic ethics, and the application of faith in modern life.",
    youtubeChannelId: "UCtm8rtofLSnaIBi3noB0INg",
    videosEmbeddable: true,
  },
  {
    name: "Ustadh Nouman Ali Khan",
    bio: "Founder of Bayyinah Institute. Lectures on Quranic Arabic, tafsir, and recovering the intended meaning of the Qur'an.",
    youtubeChannelId: "UCRtiU-lpcBSi-ipFKyfIkug",
    videosEmbeddable: true,
  },
  {
    name: "Shaykh Dr. Mostafa al-Shaybani",
    bio: "Resident Scholar at Alfurqan Islamic Center Manchester, teaching under many fields including Fiqh, Quran, Seerah, and more.",
    youtubeChannelId: "UCe2wtrjY8TtVaCEnFdhFIEA",
    videosEmbeddable: true,
  },
  {
    name: "Yaqeen Institute",
    bio: "An independent, American non-profit research institute and think tank founded in 2016 by American Islamic scholar Dr. Omar Suleiman",
    youtubeChannelId: "UC3vHW2h22WE-pNi5WJtRIjg",
    videosEmbeddable: true,
  },
  {
    name: "Alfurqan Islamic Center Manchester",
    bio: "A prominent mosque and charitable organization located in Manchester, UK.",
    youtubeChannelId: "UCnxn7-L96mdYJL4GNLrXZHQ",
    videosEmbeddable: true,
  },
];

async function main() {
  console.log(`Seeding ${scholars.length} scholars...`);

  for (const scholar of scholars) {
    const result = await prisma.scholar.upsert({
      where: { youtubeChannelId: scholar.youtubeChannelId },
      update: {
        name: scholar.name,
        bio: scholar.bio,
        videosEmbeddable: scholar.videosEmbeddable,
      },
      create: scholar,
    });
    console.log(`  ✓ ${result.name}`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });