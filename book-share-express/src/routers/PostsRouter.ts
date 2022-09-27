import { z } from "zod";
import { createAuthorizedRouter } from "~/context";
import { PostsService } from "~/services/PostsService";

export const PostSchema = z.object({
  post_id: z.number().positive(),
  google_id: z.string().trim().max(255).optional(),
  post_title: z.string().trim().max(255),
  content: z.string().trim(),
  publish: z.boolean(),
});

export const posts = createAuthorizedRouter()
  // # GET /posts
  .query("list", {
    input: z.object({
      keyword: z.string().trim().max(255).optional(),
      google_id: z.string().trim().max(255).optional(),
      contributor_id: z.number().positive().optional(),
      sort: z.enum(["hearts", "created_at", "updated_at", "book_title", "post_title"]).array(),
      limit: z.number().max(100).optional().default(10),
      offset: z.number().optional().default(0),
    }),
    resolve: async ({ input }) => {
      return PostsService.listPosts(input);
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
  });
