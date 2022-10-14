import { Prisma, VolumeStatus } from "@prisma/client";
import log from "~/libs/log";
import ORM from "~/libs/ORM";
import { trpc } from "~/libs/trpc";
import { BooksRepository } from "~/repositories/BooksRepository";
import { BookVolumeResult, VolumesRepository } from "~/repositories/VolumesRepository";
import { PrismaClient } from "~/type";

// # GET /volumes
async function searchVolumes(
  input: {
    book_id?: string;
    book_title?: string;
    status: "ALL" | "HAS_STOCK";
    limit: number;
    offset: number;
  },
  operator_id: number
) {
  log.debug("searchVolumes", input);

  const [total, bookVolumes] = await Promise.all([
    VolumesRepository.countVolumesGroupByBookId(ORM, input),
    VolumesRepository.findManyVolumesGroupByBookId(
      ORM,
      { ...input, operator_id },
      input.limit,
      input.offset
    ),
  ]);

  return {
    total: total,
    bookVolumes: await Promise.all(
      bookVolumes.map(async (bookVolume) => {
        const book = bookVolume.book_id
          ? await BooksRepository.getBook(bookVolume.book_id)
          : undefined;

        return {
          book,
          book_id: bookVolume.book_id,
          all_count: bookVolume.all_count,
          stock_count: bookVolume.stock_count,
          status: convertBookStatus(bookVolume),
          volumes: bookVolume.volume_id_list.map((volume_id, i) => {
            return {
              volume_id,
              bookshelf: bookVolume.bookshelf_list[i],
              status: bookVolume.status_list[i],
              borrower_id: bookVolume.borrower_id_list[i],
              borrow_date: bookVolume.borrow_date_list[i],
              reserve_date: bookVolume.reserve_date_list[i],
              updated_at: bookVolume.updated_at_list[i],
            };
          }),
        };
      })
    ),
  };
}

// # GET /volumes
async function listVolumes(
  input: {
    volume_id?: number[] | undefined;
    book_id?: string;
    keyword?: string;
    borrower?: "IAM" | "OTHER";
    created_by?: "IAM" | "OTHER";
    sort: ("created_at" | "updated_at" | "book_title" | "bookshelf")[];
    limit?: number | undefined;
    offset?: number | undefined;
  },
  operator_id: number
) {
  log.debug("listVolumes", input);

  const where: Prisma.VolumeWhereInput = {};
  if (input.volume_id) {
    where.volume_id = {
      in: input.volume_id,
    };
  }

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

  if (input.borrower === "IAM") {
    where.borrower_id = operator_id;
  }

  if (input.created_by === "IAM") {
    where.created_by = operator_id;
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
// # PATCH /volumes/:volume_id/back
async function updateStatusVolume(
  prisma: PrismaClient,
  operator_id: number,
  volume_id: number,
  status: VolumeStatus
) {
  const volume = await VolumesRepository.updateStatusVolume(prisma, operator_id, volume_id, status);

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
  searchVolumes,
  listVolumes,
  createVolume,
  findUniqueVolume,
  updateVolume,
  updateStatusVolume,
  deleteVolume,
};

function convertBookStatus(
  bookVolume: Pick<
    BookVolumeResult,
    "iam_borrower" | "borrower_id_list" | "status_list" | "stock_count"
  >
): "予約中" | "借用中" | "在庫あり" | "在庫なし" {
  // 借りている場合
  if (bookVolume.iam_borrower) {
    if (
      bookVolume.borrower_id_list.some((borrower_id, i) => {
        return borrower_id && bookVolume.status_list[i] === "RESERVE";
      })
    ) {
      return "予約中";
    } else {
      return "借用中";
    }

    // 借りていない場合
  } else {
    if (bookVolume.stock_count > 0) {
      return "在庫あり";
    } else {
      return "在庫なし";
    }
  }
}
