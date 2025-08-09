import type { TrpcRouter } from '@book-share/express';
import type { RequestHandler, WebSocketHandler } from 'msw';
import { createTRPCMsw, httpLink } from 'msw-trpc';
import superjson from 'superjson';

const trpcMsw = createTRPCMsw<typeof TrpcRouter>({
  links: [
    httpLink({
      url: `${import.meta.env.BASE_URL}api/trpc`,
      transformer: superjson, // Date to Date
    }),
  ],
});

export const handlers: Array<RequestHandler | WebSocketHandler> = [
  // auth
  trpcMsw.auth.signup.mutation(() => {
    // void
  }),
  trpcMsw.auth.signin.mutation(() => {
    return {
      auth: true,
    };
  }),
  trpcMsw.auth.signinTwofa.mutation(() => {
    return {
      auth: true,
    };
  }),
  trpcMsw.auth.get.query(() => {
    return {
      auth: true,
    };
  }),
  trpcMsw.auth.delete.mutation(() => {
    // void
  }),

  // book
  trpcMsw.book.listVolume.query(() => {
    return {
      total: 100,
      volume_list: [
        // TODO
      ],
    };
  }),
  trpcMsw.book.getVolume.query(() => {
    return {
      // TODO
    };
  }),
  trpcMsw.book.ranking.query(() => {
    return {
      volume_list: [
        // TODO
      ],
    };
  }),

  // file
  // TODO

  // post
  trpcMsw.post.list.query(() => {
    return {
      total: 100,
      post_list: [
        // TODO
      ],
    };
  }),
  trpcMsw.post.getMyPostList.query(() => {
    return {
      total: 100,
      post_list: [
        // TODO
      ],
    };
  }),
  trpcMsw.post.get.query(() => {
    return {
      book_title: '',
      content: '',
      created_at: new Date(),
      hearts: 1,
      post_id: 1,
      post_title: '',
      published: true,
      published_at: new Date(),
      toukousya_id: 1,
      updated_at: new Date(),
      volume_id: '',
    };
  }),
  trpcMsw.post.getMyPost.query(() => {
    return {
      book_title: '',
      content: '',
      created_at: new Date(),
      hearts: 1,
      post_id: 1,
      post_title: '',
      published: true,
      published_at: new Date(),
      toukousya_id: 1,
      updated_at: new Date(),
      volume_id: '',
    };
  }),
  trpcMsw.post.create.mutation(() => {
    return {
      book_title: '',
      content: '',
      created_at: new Date(),
      hearts: 1,
      post_id: 1,
      post_title: '',
      published: true,
      published_at: new Date(),
      toukousya_id: 1,
      updated_at: new Date(),
      volume_id: '',
    };
  }),
  trpcMsw.post.update.mutation(() => {
    return {
      book_title: '',
      content: '',
      created_at: new Date(),
      hearts: 1,
      post_id: 1,
      post_title: '',
      published: true,
      published_at: new Date(),
      toukousya_id: 1,
      updated_at: new Date(),
      volume_id: '',
    };
  }),
  trpcMsw.post.delete.mutation(() => {
    return {
      book_title: '',
      content: '',
      created_at: new Date(),
      hearts: 1,
      post_id: 1,
      post_title: '',
      published: true,
      published_at: new Date(),
      toukousya_id: 1,
      updated_at: new Date(),
      volume_id: '',
    };
  }),

  // profile
  trpcMsw.profile.get.query(() => {
    return {
      avatar_image: '',
      email: '',
      twofa_enable: false,
      username: '',
    };
  }),
  trpcMsw.profile.patchProfile.mutation(() => {
    return {
      avatar_image: '',
      email: '',
      twofa_enable: false,
      username: '',
    };
  }),
  trpcMsw.profile.patchPassword.mutation(() => {
    return {
      avatar_image: '',
      email: '',
      twofa_enable: false,
      username: '',
    };
  }),
  trpcMsw.profile.delete.mutation(() => {
    // void
  }),
  trpcMsw.profile.generateSecret.mutation(() => {
    return {
      dataurl: '',
    };
  }),
  trpcMsw.profile.enableSecret.mutation(() => {
    // void
  }),
  trpcMsw.profile.disableSecret.mutation(() => {
    // void
  }),

  // readingrecord
  trpcMsw.readingrecord.list.query(() => {
    return {
      total: 100,
      readingrecord_list: [
        // TODO
      ],
    };
  }),
  trpcMsw.readingrecord.get.query(() => {
    return {
      book_title: '',
      created_at: new Date(),
      hitokoto: '',
      read_date: '',
      readingrecord_id: 1,
      star: 1,
      updated_at: new Date(),
      user_id: 1,
      volume_id: '',
    };
  }),
  trpcMsw.readingrecord.create.mutation(() => {
    return {
      book_title: '',
      created_at: new Date(),
      hitokoto: '',
      read_date: '',
      readingrecord_id: 1,
      star: 1,
      updated_at: new Date(),
      user_id: 1,
      volume_id: '',
    };
  }),
  trpcMsw.readingrecord.update.mutation(() => {
    return {
      book_title: '',
      created_at: new Date(),
      hitokoto: '',
      read_date: '',
      readingrecord_id: 1,
      star: 1,
      updated_at: new Date(),
      user_id: 1,
      volume_id: '',
    };
  }),
  trpcMsw.readingrecord.delete.mutation(() => {
    return {
      book_title: '',
      created_at: new Date(),
      hitokoto: '',
      read_date: '',
      readingrecord_id: 1,
      star: 1,
      updated_at: new Date(),
      user_id: 1,
      volume_id: '',
    };
  }),
];
