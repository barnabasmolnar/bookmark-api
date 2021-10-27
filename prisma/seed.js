import prisma from "../prisma.js";
import faker from "faker";

const range = (size, startAt = 0) =>
  [...Array(size).keys()].map((i) => i + startAt);

async function main() {
  range(10).map(async (_) => {
    await prisma.user.create({
      data: {
        googleId: faker.datatype.uuid(),
        name: faker.name.findName(),
        bookmarks: {
          create: {
            title: faker.random.words(),
            url: faker.internet.url(),
            description: faker.lorem.sentence(),
            tags: {
              create: range(2).map((_) => ({ name: faker.random.word() })),
            },
          },
        },
      },
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
