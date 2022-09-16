import { z } from "zod";
import { createAuthorizedRouter } from "~/context";
import ORM from "~/libs/ORM";
import { PostsService } from "~/services/PostsService";

const PostSchema = z.object({
  post_id: z.number().positive(),
  google_id: z.string().trim().max(255),
  post_title: z.string().trim().max(255),
  description: z.string().trim().max(255),
  publish: z.boolean(),
});

export const posts = createAuthorizedRouter()
  // # GET /posts
  .query("list", {
    input: z.object({
      keyword: z.string().trim().max(255),
      google_id: z.string().trim().max(255),
      contributor_id: z.number().positive().optional(),
      sort: z.enum(["hearts", "created_at", "book_title", "post_title"]).array(),
      limit: z.number().max(100).optional().default(10),
      offset: z.number().optional().default(0),
    }),
    resolve: async ({ input }) => {
      return PostsService.listPosts(input);
    },
  })
  // # POST /posts
  .mutation("create", {
    input: PostSchema.pick({
      google_id: true,
      post_title: true,
      description: true,
    }),
    resolve: async ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        PostsService.createPost(prisma, ctx.user.user_id, input)
      );
    },
  })
  // # GET /posts/:post_id
  .query("get", {
    input: PostSchema.pick({
      post_id: true,
    }),
    resolve: async ({ input }) => {
      return PostsService.findUniquePost(input.post_id);
    },
  })
  // # PUT /posts/:post_id
  .mutation("update", {
    input: PostSchema.pick({
      post_id: true,
      google_id: true,
      post_title: true,
      description: true,
    }),
    resolve: async ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        PostsService.updatePost(prisma, ctx.user.user_id, input)
      );
    },
  })
  // # PATCH /posts/:post_id/publish
  // # PATCH /posts/:post_id/unpublish
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
  // # DELETE /posts/:post_id
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
