import { PrismaClient } from './client';

const prisma = new PrismaClient({});

const main = async () => {
  console.log(`Start seeding ...`);

  await prisma.user.deleteMany();

  const example = await prisma.user.upsert({
    where: { email: 'example@example.com' },
    update: {},
    create: {
      email: 'example@example.com',
      username: 'example',
      // cSpell:ignore vsQDysmORCJm4R0iI5og9Sce6lvrq
      password: '$2a$10$iFYoa/8.jROwy/vsQDysmORCJm4R0iI5og9Sce6lvrq.F1ba5eOSi', // example@example.com
      description: 'description',
    },
  });

  //
  await prisma.post.create({
    data: {
      book_title: '',
      content: '',
      toukousya_id: example.user_id,
    },
  });

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
