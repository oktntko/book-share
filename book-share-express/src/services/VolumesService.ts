import { Prisma } from "@prisma/client";
import log from "~/libs/log";
import ORM from "~/libs/ORM";
import { trpc } from "~/libs/trpc";
import { VolumesRepository } from "~/repositories/VolumesRepository";
import { PrismaClient } from "~/type";
import { PostsService } from "./PostsService";

// # GET /volumes
async function listVolumes(input: {
  google_id?: string;
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
  if (input.google_id) {
    where.book = {
      google_id: input.google_id,
    };
  }

  if (input.keyword) {
    where.OR = [
      {
        book: {
          book_title: {
            contains: input.keyword,
          },
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
            book: {
              book_title: "asc",
            },
          };
        case "bookshelf":
          return {
            bookshelf: "asc",
          };
      }
    }
  );

  const total = await VolumesRepository.countVolumes(ORM, where);
  const volumes = await VolumesRepository.findManyVolumes(
    ORM,
    where,
    orderBy,
    input.limit,
    input.offset
  );

  return {
    total,
    volumes,
  };
}

// # POST /volumes
async function createVolume(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    google_id: string;
    owner: "ME" | "UNKNOWN";
    bookshelf: string;
  }
) {
  const book = await PostsService.findBookOrCreate(prisma, input.google_id);

  return VolumesRepository.createVolume(prisma, operator_id, {
    book_id: book.book_id,
    owner_id: input.owner === "ME" ? operator_id : null,
    bookshelf: input.bookshelf,
  });
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

  return volume;
}

// # PUT /volumes/:volume_id
async function updateVolume(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    volume_id: number;
    google_id: string;
    owner: "ME" | "UNKNOWN";
    bookshelf: string;
  }
) {
  const book = await PostsService.findBookOrCreate(prisma, input.google_id);

  return VolumesRepository.updateVolume(prisma, operator_id, input.volume_id, {
    book_id: book.book_id,
    owner_id: input.owner === "ME" ? operator_id : null,
    bookshelf: input.bookshelf,
  });
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
  return VolumesRepository.borrowOrBackVolume(
    prisma,
    operator_id,
    input.volume_id,
    input.borrower_id
  );
}

// # PATCH /volumes/:volume_id/back
async function backVolume(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    volume_id: number;
  }
) {
  return VolumesRepository.borrowOrBackVolume(prisma, operator_id, input.volume_id, null);
}

// # DELETE /volumes/:volume_id
async function deleteVolume(
  prisma: PrismaClient,
  operator_id: number,
  input: {
    volume_id: number;
  }
) {
  return VolumesRepository.deleteVolume(prisma, operator_id, input.volume_id);
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
