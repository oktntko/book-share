import { Prisma } from "@prisma/client";
import log from "~/libs/log";
import ORM from "~/libs/ORM";
import { trpc } from "~/libs/trpc";
import { BooksRepository } from "~/repositories/BooksRepository";
import { VolumesRepository } from "~/repositories/VolumesRepository";
import { PrismaClient } from "~/type";

// # GET /volumes
async function listVolumes(input: {
  book_id?: string;
  keyword?: string;
  owner_id?: number | undefined;
  borrower_id?: number | undefined;
  created_by?: number | undefined;
  sort: ("created_at" | "updated_at" | "book_title" | "bookshelf")[];
  limit: number;
  offset: number;
}) {
  log.debug("listVolumes", input);

  const where: Prisma.VolumeWhereInput = {};
  if (input.book_id) {
    where.book_id = input.book_id;
  }

  if (input.keyword) {
    where.OR = [
      {
        book_title: {
          contains: input.keyword,
        },
      },
      {
        bookshelf: {
          contains: input.keyword,
        },
      },
    ];
  }

  if (input.owner_id) {
    where.owner_id = input.owner_id;
  }

  if (input.borrower_id) {
    where.borrower_id = input.borrower_id;
  }

  if (input.created_by) {
    where.created_by = input.created_by;
  }

  log.debug("where", where);

  const orderBy: Prisma.Enumerable<Prisma.VolumeOrderByWithRelationInput> = input.sort.map(
    (key) => {
      switch (key) {
        case "created_at":
          return {
            created_at: "desc",
          };
        case "updated_at":
          return {
            updated_at: "desc",
          };
        case "book_title":
          return {
            book_title: "asc",
          };
        case "bookshelf":
          return {
            bookshelf: "asc",
          };
      }
    }
  );

  const [total, volumes] = await Promise.all([
    VolumesRepository.countVolumes(ORM, where),
    VolumesRepository.findManyVolumes(ORM, where, orderBy, input.limit, input.offset),
  ]);

  return {
    total,
    volumes: await Promise.all(
      volumes.map(async (volume) => {
        const book = volume.book_id ? await BooksRepository.getBook(volume.book_id) : undefined;
        return {
          ...volume,
          book,
        };
      })
    ),
  };
}

// # POST /volumes
async function createVolume(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    book_id: string;
    book_title: string;
    owner: "ME" | "UNKNOWN";
    bookshelf: string;
  }
) {
  const volume = await VolumesRepository.createVolume(prisma, operator_id, {
    book_id: input.book_id,
    book_title: input.book_title,
    owner_id: input.owner === "ME" ? operator_id : null,
    bookshelf: input.bookshelf,
  });

  const book = volume.book_id ? await BooksRepository.getBook(volume.book_id) : undefined;

  return {
    ...volume,
    book,
  };
}

// # GET /volumes/:volume_id
async function findUniqueVolume(volume_id: number) {
  const volume = await VolumesRepository.findUniqueVolume(ORM, volume_id);

  if (volume == null) {
    throw new trpc.TRPCError({
      code: "NOT_FOUND",
      message: "Data already Deleted, please refresh.",
    });
  }

  const book = volume.book_id ? await BooksRepository.getBook(volume.book_id) : undefined;

  return {
    ...volume,
    book,
  };
}

// # PUT /volumes/:volume_id
async function updateVolume(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    volume_id: number;
    book_id: string;
    book_title: string;
    owner: "ME" | "UNKNOWN";
    bookshelf: string;
  }
) {
  const volume = await VolumesRepository.updateVolume(prisma, operator_id, input.volume_id, {
    book_id: input.book_id,
    book_title: input.book_title,
    owner_id: input.owner === "ME" ? operator_id : null,
    bookshelf: input.bookshelf,
  });

  const book = volume.book_id ? await BooksRepository.getBook(volume.book_id) : undefined;

  return {
    ...volume,
    book,
  };
}

// # PATCH /volumes/:volume_id/borrow
async function borrowVolume(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    volume_id: number;
    borrower_id: number;
  }
) {
  const volume = await VolumesRepository.borrowOrBackVolume(
    prisma,
    operator_id,
    input.volume_id,
    input.borrower_id
  );

  const book = volume.book_id ? await BooksRepository.getBook(volume.book_id) : undefined;

  return {
    ...volume,
    book,
  };
}

// # PATCH /volumes/:volume_id/back
async function backVolume(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    volume_id: number;
  }
) {
  const volume = await VolumesRepository.borrowOrBackVolume(
    prisma,
    operator_id,
    input.volume_id,
    null
  );

  const book = volume.book_id ? await BooksRepository.getBook(volume.book_id) : undefined;

  return {
    ...volume,
    book,
  };
}

// # DELETE /volumes/:volume_id
async function deleteVolume(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    volume_id: number;
  }
) {
  const volume = await VolumesRepository.deleteVolume(prisma, operator_id, input.volume_id);

  const book = volume.book_id ? await BooksRepository.getBook(volume.book_id) : undefined;

  return {
    ...volume,
    book,
  };
}

export const VolumesService = {
  listVolumes,
  createVolume,
  findUniqueVolume,
  updateVolume,
  borrowVolume,
  backVolume,
  deleteVolume,
};
