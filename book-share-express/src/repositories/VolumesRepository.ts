import { Prisma, VolumeStatus } from "@prisma/client";
import log from "~/libs/log";
import { PrismaClient } from "~/type";

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
      book: {
        select: {
          book_id: true,
          google_id: true,
          book_title: true,
        },
      },
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
      bookshelf: true,
      status: true,
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
    book_id: number;
    owner_id: number | null;
    bookshelf: string;
  }
) {
  log.debug("createVolume", operator_id);

  return prisma.volume.create({
    select: {
      volume_id: true,
      book_id: true,
      book: {
        select: {
          book_id: true,
          google_id: true,
          book_title: true,
        },
      },
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
      bookshelf: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
    data: {
      book_id: volume.book_id,
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
      book: {
        select: {
          book_id: true,
          google_id: true,
          book_title: true,
        },
      },
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
      bookshelf: true,
      status: true,
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
    book_id: number;
    owner_id: number | null;
    bookshelf: string;
  }
) {
  log.debug("updateVolume", operator_id);

  return prisma.volume.update({
    select: {
      volume_id: true,
      book_id: true,
      book: {
        select: {
          book_id: true,
          google_id: true,
          book_title: true,
        },
      },
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
      bookshelf: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
    data: {
      book_id: volume.book_id,
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
      book: {
        select: {
          book_id: true,
          google_id: true,
          book_title: true,
        },
      },
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
      bookshelf: true,
      status: true,
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
  borrower_id: number | null
) {
  return prisma.volume.update({
    select: {
      volume_id: true,
      book_id: true,
      book: {
        select: {
          book_id: true,
          google_id: true,
          book_title: true,
        },
      },
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
      bookshelf: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
    data: {
      borrower_id,
      status: borrower_id ? VolumeStatus.LENDING : VolumeStatus.STOCK,
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
  borrowOrBackVolume,
};
