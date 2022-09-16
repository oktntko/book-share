import { z } from "zod";
import { createAuthorizedRouter } from "~/context";
import ORM from "~/libs/ORM";
import { UsersService } from "~/services/UsersService";

const UserSchema = z.object({
  user_id: z.number().positive(),
  email: z.string().trim().max(255),
  username: z.string().trim().max(255),
});

export const users = createAuthorizedRouter()
  // # GET /users
  .query("list", {
    input: z.object({
      keyword: z.string().trim().max(255),
      sort: z.enum(["email", "created_at", "username"]).array(),
      limit: z.number().max(100).optional().default(10),
      offset: z.number().optional().default(0),
    }),
    resolve: async ({ input }) => {
      return UsersService.listUsers(input);
    },
  })
  // # POST /users
  .mutation("create", {
    input: UserSchema.pick({
      email: true,
      username: true,
    }),
    resolve: async ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        UsersService.createUser(prisma, ctx.user.user_id, input)
      );
    },
  })
  // # GET /users/:user_id
  .query("get", {
    input: UserSchema.pick({
      user_id: true,
    }),
    resolve: async ({ input }) => {
      return UsersService.findUniqueUser(input.user_id);
    },
  })
  // # PUT /users/:user_id
  .mutation("update", {
    input: UserSchema.pick({
      user_id: true,
      email: true,
      username: true,
    }),
    resolve: async ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        UsersService.updateUser(prisma, ctx.user.user_id, input)
      );
    },
  })
  // # DELETE /users/:user_id
  .mutation("delete", {
    input: UserSchema.pick({
      user_id: true,
    }),
    resolve: async ({ input, ctx }) => {
      return ORM.$transaction(async (prisma) =>
        UsersService.deleteUser(prisma, ctx.user.user_id, input)
      );
    },
  });
