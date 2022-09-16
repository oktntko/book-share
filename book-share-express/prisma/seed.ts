import { Prisma, PrismaClient } from "@prisma/client";

const ORM = new PrismaClient({});

const users: Prisma.UserCreateManyInput[] = [
  {
    username: "example",
    email: "example@example.com",
    password: "example@example.com",
    created_by: 0,
    updated_by: 0,
  },
];

const main = async () => {
  console.log(`Start seeding ...`);
  await ORM.user.createMany({
    skipDuplicates: true,
    data: users,
  });

  console.log(`Seeding finished.`);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await ORM.$disconnect();
  });
