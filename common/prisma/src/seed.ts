import { PrismaClient } from './client';

const prisma = new PrismaClient({});

const main = async () => {
  console.log(`Start seeding ...`);

  //

  console.log(`Seeding finished.`);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
