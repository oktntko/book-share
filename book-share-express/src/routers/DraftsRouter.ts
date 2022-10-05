import { z } from "zod";
import { createAuthorizedRouter } from "~/context";
import ORM from "~/libs/ORM";
import { PostSchema } from "~/routers/PostsRouter";
import { PostsService } from "~/services/PostsService";

export const drafts = createAuthorizedRouter()
  // # GET /drafts
  .query("list", {
    input: z.object({
      keyword: z.string().trim().max(255).optional(),
      book_id: z.string().trim().max(255).optional(),
      sort: z.enum(["hearts", "created_at", "updated_at", "book_title", "post_title"]).array(),
      limit: z.number().max(100).optional().default(10),
      offset: z.number().optional().default(0),
    }),
    resolve: async ({ input, ctx }) => {
      return PostsService.listPosts({ ...input, contributor_id: ctx.user.user_id });
    },
  })
  // # POST /drafts
  .mutation("create", {
    input: PostSchema.pick({
      book_id: true,
      book_title: true,
      post_title: true,
      content: true,
    }),
    resolve: async ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        PostsService.createPost(prisma, ctx.user.user_id, input)
      );
    },
  })
  // # GET /drafts/:post_id
  .query("get", {
    input: PostSchema.pick({
      post_id: true,
    }),
    resolve: async ({ input }) => {
      return PostsService.findUniquePost(input.post_id);
    },
  })
  // # PUT /drafts/:post_id
  .mutation("update", {
    input: PostSchema.pick({
      post_id: true,
      book_id: true,
      book_title: true,
      post_title: true,
      content: true,
    }),
    resolve: async ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        PostsService.updatePost(prisma, ctx.user.user_id, input)
      );
    },
  })
  // # PATCH /drafts/:post_id/publish
  // # PATCH /drafts/:post_id/unpublish
  .mutation("publish", {
    input: PostSchema.pick({
      post_id: true,
      publish: true,
    }),
    resolve: ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        PostsService.publishPost(prisma, ctx.user.user_id, input)
      );
    },
  })
  // # DELETE /drafts/:post_id
  .mutation("delete", {
    input: PostSchema.pick({
      post_id: true,
    }),
    resolve: async ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        PostsService.deletePost(prisma, ctx.user.user_id, input)
      );
    },
  });
