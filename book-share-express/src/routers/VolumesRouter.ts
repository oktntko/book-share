import { VolumeStatus } from "@prisma/client";
import { z } from "zod";
import { createAuthorizedRouter } from "~/context";
import ORM from "~/libs/ORM";
import { VolumesService } from "~/services/VolumesService";

const VolumeSchema = z.object({
  volume_id: z.number().positive(),
  book_id: z.string().trim().max(255),
  book_title: z.string().trim().max(400),
  owner: z.enum(["ME", "UNKNOWN"]),
  bookshelf: z.string().trim().max(255),
  borrower_id: z.number().positive(),
});

export const volumes = createAuthorizedRouter()
  // # GET /volumes
  .query("search", {
    input: z.object({
      book_id: z.string().trim().max(255).optional(),
      book_title: z.string().trim().max(255).optional(),
      status: z.enum(["ALL", "HAS_STOCK"]).default("ALL"),
      limit: z.number().max(100).optional().default(10),
      offset: z.number().optional().default(0),
    }),
    resolve: async ({ input, ctx }) => {
      return VolumesService.searchVolumes(input, ctx.user.user_id);
    },
  })
  // # GET /volumes
  .query("list", {
    input: z.object({
      volume_id: z.number().positive().array().optional(),
      book_id: z.string().trim().max(255).optional(),
      keyword: z.string().trim().max(255).optional(),
      borrower: z.enum(["IAM", "OTHER"]).optional(),
      created_by: z.enum(["IAM", "OTHER"]).optional(),
      sort: z.enum(["created_at", "updated_at", "book_title", "bookshelf"]).array(),
      limit: z.number().max(100).optional(),
      offset: z.number().optional(),
    }),
    resolve: async ({ input, ctx }) => {
      return VolumesService.listVolumes(input, ctx.user.user_id);
    },
  })
  // # POST /volumes
  .mutation("create", {
    input: VolumeSchema.pick({
      book_id: true,
      book_title: true,
      owner: true,
      bookshelf: true,
    }),
    resolve: async ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        VolumesService.createVolume(prisma, ctx.user.user_id, input)
      );
    },
  })
  // # GET /volumes/:volume_id
  .query("get", {
    input: VolumeSchema.pick({
      volume_id: true,
    }),
    resolve: async ({ input }) => {
      return VolumesService.findUniqueVolume(input.volume_id);
    },
  })
  // # PUT /volumes/:volume_id
  .mutation("update", {
    input: VolumeSchema.pick({
      volume_id: true,
      book_id: true,
      book_title: true,
      owner: true,
      bookshelf: true,
    }),
    resolve: async ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        VolumesService.updateVolume(prisma, ctx.user.user_id, input)
      );
    },
  })
  // # PATCH /volumes/:volume_id/borrow
  .mutation("borrow", {
    input: VolumeSchema.pick({
      volume_id: true,
    }),
    resolve: ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        VolumesService.updateStatusVolume(
          prisma,
          ctx.user.user_id,
          input.volume_id,
          VolumeStatus.LENDING
        )
      );
    },
  })
  // # PATCH /volumes/:volume_id/back
  .mutation("back", {
    input: VolumeSchema.pick({
      volume_id: true,
    }),
    resolve: ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        VolumesService.updateStatusVolume(
          prisma,
          ctx.user.user_id,
          input.volume_id,
          VolumeStatus.STOCK
        )
      );
    },
  })
  // # DELETE /volumes/:volume_id
  .mutation("delete", {
    input: VolumeSchema.pick({
      volume_id: true,
    }),
    resolve: async ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        VolumesService.deleteVolume(prisma, ctx.user.user_id, input)
      );
    },
  });
