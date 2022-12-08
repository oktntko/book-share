import { Prisma, VolumeStatus } from "@prisma/client";
import dayjs from "dayjs";
import log from "~/libs/log";
import { PrismaClient } from "~/type";

async function countVolumesGroupByBookId(
  prisma: PrismaClient,
  where: {
    book_id?: string;
    book_title?: string;
    status: "ALL" | "HAS_STOCK";
  }
) {
  log.debug("countVolumesGroupByBookId");

  const data = await prisma.$queryRaw<{ count: number }[]>`
SELECT
  COUNT(DISTINCT book_id)::int AS count
FROM
  volumes
WHERE
  1 = 1
  ${where.book_title ? Prisma.sql`AND book_id = ${where.book_id}` : Prisma.empty}
  ${
    where.book_title
      ? Prisma.sql`AND book_title LIKE CONCAT('%', ${where.book_title}, '%')`
      : Prisma.empty
  }
HAVING
  ${
    where.status === "HAS_STOCK"
      ? Prisma.sql`COUNT(status = 'STOCK' OR NULL)`
      : Prisma.sql`COUNT(volume_id)`
  } > 0
`;

  return data[0].count;
}

export type BookVolumeResult = {
  book_id: string;
  all_count: number;
  stock_count: number;
  iam_borrower: boolean;
  volume_id_list: number[];
  bookshelf_list: string[];
  status_list: VolumeStatus[];
  borrower_id_list: (true | null)[];
  borrow_date_list: string[];
  updated_at_list: Date[];
};

async function findManyVolumesGroupByBookId(
  prisma: PrismaClient,
  where: {
    book_id?: string;
    book_title?: string;
    status: "ALL" | "HAS_STOCK";
    operator_id: number;
  },
  take?: number,
  skip?: number
) {
  log.debug("findManyVolumesGroupByBookId");

  return prisma.$queryRaw<BookVolumeResult[]>`
SELECT
    book_id
  , COUNT(volume_id)::int                                                    AS all_count
  , COUNT(status = 'STOCK' OR NULL)::int                                     AS stock_count
  , COUNT(borrower_id = ${where.operator_id} OR NULL)::INT                   AS iam_borrower
  , ARRAY_AGG(volume_id ORDER BY volume_id)                                  AS volume_id_list
  , ARRAY_AGG(bookshelf ORDER BY volume_id)                                  AS bookshelf_list
  , ARRAY_AGG(status ORDER BY volume_id)                                     AS status_list
  , ARRAY_AGG(borrower_id = ${where.operator_id} OR NULL ORDER BY volume_id) AS borrower_id_list
  , ARRAY_AGG(borrow_date ORDER BY volume_id)                                AS borrow_date_list
  , ARRAY_AGG(updated_at ORDER BY volume_id)                                 AS updated_at_list
FROM
  volumes
WHERE
  1 = 1
  ${where.book_id ? Prisma.sql`AND book_id = ${where.book_id}` : Prisma.empty}
  ${
    where.book_title
      ? Prisma.sql`AND book_title LIKE CONCAT('%', ${where.book_title}, '%')`
      : Prisma.empty
  }
GROUP BY
  book_id
HAVING
${
  where.status === "HAS_STOCK"
    ? Prisma.sql`COUNT(status = 'STOCK' OR NULL)`
    : Prisma.sql`COUNT(volume_id)`
} > 0
LIMIT
  ${take}
OFFSET
  ${skip}
  `;
}

async function countVolumes(prisma: PrismaClient, where: Prisma.VolumeWhereInput) {
  log.debug("countVolumes");

  return prisma.volume.count({
    where,
  });
}

async function findManyVolumes(
  prisma: PrismaClient,
  where: Prisma.VolumeWhereInput,
  orderBy: Prisma.Enumerable<Prisma.VolumeOrderByWithRelationInput> = {
    created_at: "desc",
  },
  take?: number,
  skip?: number
) {
  log.debug("findManyPosts");

  return prisma.volume.findMany({
    select: {
      volume_id: true,
      book_id: true,
      book_title: true,
      bookshelf: true,
      status: true,
      owner_id: true,
      owner: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
      borrower_id: true,
      borrower: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
      borrow_date: true,
      created_at: true,
      updated_at: true,
    },
    where,
    orderBy,
    take,
    skip,
  });
}

async function createVolume(
  prisma: PrismaClient,
  operator_id: number,
  volume: {
    book_id: string;
    book_title: string;
    owner_id: number | null;
    bookshelf: string;
  }
) {
  log.debug("createVolume", operator_id);

  return prisma.volume.create({
    select: {
      volume_id: true,
      book_id: true,
      book_title: true,
      bookshelf: true,
      status: true,
      owner_id: true,
      owner: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
      borrower_id: true,
      borrower: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
      created_at: true,
      updated_at: true,
    },
    data: {
      book_id: volume.book_id,
      book_title: volume.book_title,
      owner_id: volume.owner_id,
      bookshelf: volume.bookshelf,
      status: VolumeStatus.STOCK,
      created_by: operator_id,
      updated_by: operator_id,
    },
  });
}

async function findUniqueVolume(prisma: PrismaClient, volume_id: number) {
  log.debug("findUniqueVolume");

  return prisma.volume.findUnique({
    select: {
      volume_id: true,
      book_id: true,
      book_title: true,
      bookshelf: true,
      status: true,
      owner_id: true,
      owner: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
      borrower_id: true,
      borrower: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
      borrow_date: true,
      created_at: true,
      updated_at: true,
    },
    where: {
      volume_id,
    },
  });
}

async function updateVolume(
  prisma: PrismaClient,
  operator_id: number,
  volume_id: number,
  volume: {
    book_id: string;
    book_title: string;
    owner_id: number | null;
    bookshelf: string;
  }
) {
  log.debug("updateVolume", operator_id);

  return prisma.volume.update({
    select: {
      volume_id: true,
      book_id: true,
      book_title: true,
      bookshelf: true,
      status: true,
      owner_id: true,
      owner: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
      borrower_id: true,
      borrower: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
      borrow_date: true,
      created_at: true,
      updated_at: true,
    },
    data: {
      book_id: volume.book_id,
      book_title: volume.book_title,
      owner_id: volume.owner_id,
      bookshelf: volume.bookshelf,
      created_by: operator_id,
      updated_by: operator_id,
    },
    where: {
      volume_id,
    },
  });
}

async function deleteVolume(prisma: PrismaClient, operator_id: number, volume_id: number) {
  log.debug("deleteVolume", operator_id);

  return prisma.volume.delete({
    select: {
      volume_id: true,
      book_id: true,
      book_title: true,
      bookshelf: true,
      status: true,
      owner_id: true,
      owner: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
      borrower_id: true,
      borrower: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
      borrow_date: true,
      created_at: true,
      updated_at: true,
    },
    where: {
      volume_id,
    },
  });
}

async function borrowOrBackVolume(
  prisma: PrismaClient,
  operator_id: number,
  volume_id: number,
  status: VolumeStatus
) {
  return prisma.volume.update({
    select: {
      volume_id: true,
      book_id: true,
      book_title: true,
      bookshelf: true,
      status: true,
      owner_id: true,
      owner: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
      borrower_id: true,
      borrower: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
      borrow_date: true,
      created_at: true,
      updated_at: true,
    },
    data: {
      borrower_id: status !== VolumeStatus.STOCK ? operator_id : null,
      status,
      borrow_date: status !== VolumeStatus.LENDING ? "" : dayjs().format("YYYY-MM-DD"),
      updated_by: operator_id,
    },
    where: {
      volume_id,
    },
  });
}

export const VolumesRepository = {
  countVolumes,
  findManyVolumes,
  createVolume,
  findUniqueVolume,
  updateVolume,
  deleteVolume,
  //
  updateStatusVolume: borrowOrBackVolume,
  countVolumesGroupByBookId,
  findManyVolumesGroupByBookId,
};
