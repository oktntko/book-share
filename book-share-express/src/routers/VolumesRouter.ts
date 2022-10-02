import { z } from "zod";
import { createAuthorizedRouter } from "~/context";
import ORM from "~/libs/ORM";
import { VolumesService } from "~/services/VolumesService";

const VolumeSchema = z.object({
  volume_id: z.number().positive(),
  google_id: z.string().trim().max(255),
  owner: z.enum(["ME", "UNKNOWN"]),
  bookshelf: z.string().trim().max(255),
  borrower_id: z.number().positive(),
});

export const volumes = createAuthorizedRouter()
  // # GET /volumes
  .query("list", {
    input: z.object({
      google_id: z.string().trim().max(255).optional(),
      keyword: z.string().trim().max(255).optional(),
      owner_id: z.number().positive().optional(),
      borrower_id: z.number().positive().optional(),
      created_by: z.number().positive().optional(),
      sort: z.enum(["created_at", "updated_at", "book_title", "bookshelf"]).array(),
      limit: z.number().max(100).optional().default(10),
      offset: z.number().optional().default(0),
    }),
    resolve: async ({ input }) => {
      return VolumesService.listVolumes(input);
    },
  })
  // # POST /volumes
  .mutation("create", {
    input: VolumeSchema.pick({
      google_id: true,
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
      google_id: true,
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
      borrower_id: true,
    }),
    resolve: ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        VolumesService.borrowVolume(prisma, ctx.user.user_id, input)
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
        VolumesService.backVolume(prisma, ctx.user.user_id, input)
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
