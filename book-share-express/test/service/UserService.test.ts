import { rollback, truncate } from '@/helper/prisma';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/middleware/prisma';
import {
  DUPLICATE_IS_EXISTING_MESSAGE,
  DATA_IS_NOT_EXIST_MESSAGE,
  PREVIOUS_IS_UPDATED_MESSAGE,
} from '~/repository/_';
import { UserRouterSchema } from '~/schema/UserRouterSchema';
import { UserService } from '~/service/UserService';

beforeAll(async () => {});

afterAll(async () => {});

describe('📝 user.create', () => {
  describe('🌿 分岐条件', () => {
    test(`✅ 正常に処理が終了したとき、 対象のデータが返却されること`, () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');

        // Act
        const input: z.infer<typeof UserRouterSchema.createInput> = {
          email: 'mytest@example.com',
          username: 'mytest',
        };
        const user = await UserService.createUser('reqid', prisma, 0, input);

        // Assert
        // 対象のデータが返却されること
        expect(user).toStrictEqual(
          expect.objectContaining({
            ...input,
            user_id: expect.any(Number),
            updated_at: expect.any(Date),
          }),
        );

        // After
        await rollback(prisma);
      });
    });
    test('❗ 入力したメールアドレスが既に登録されているとき、 重複エラーとなること', () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');
        await prisma.user.createMany({
          skipDuplicates: false,
          data: [
            {
              user_id: 1,
              email: 'mytest@example.com',
              username: 'mytest',
              created_by: 0,
              updated_by: 0,
            },
          ],
        });

        // Act
        const input: z.infer<typeof UserRouterSchema.createInput> = {
          email: 'mytest@example.com', // ❗ duplication
          username: 'mytest',
        };
        await expect(() => UserService.createUser('reqid', prisma, 0, input)).rejects.toThrow(
          // Assert
          // 重複エラーとなること
          new TRPCError({
            code: 'CONFLICT',
            message: DUPLICATE_IS_EXISTING_MESSAGE,
          }),
        );

        // After
        await rollback(prisma);
      });
    });
  });
  describe('💾 データアクセス', () => {
    test(`✅ 全項目登録`, () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');

        // Act
        const input: z.infer<typeof UserRouterSchema.createInput> = {
          email: 'mytest@example.com',
          username: 'mytest',
        };
        const user = await UserService.createUser('reqid', prisma, 0, input);

        // Assert
        // データが登録されていること
        expect(await prisma.user.findUnique({ where: { user_id: user.user_id } })).toStrictEqual(
          expect.objectContaining({
            ...input,
            updated_at: expect.any(Date),
          }),
        );

        // After
        await rollback(prisma);
      });
    });
    test(`✅ 必須のみ登録`, () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');

        // Act
        const input: z.infer<typeof UserRouterSchema.createInput> = {
          email: 'mytest@example.com',
          username: 'mytest',
        };
        const user = await UserService.createUser('reqid', prisma, 0, input);

        // Assert
        // データが登録されていること
        expect(await prisma.user.findUnique({ where: { user_id: user.user_id } })).toStrictEqual(
          expect.objectContaining({
            ...input,
            updated_at: expect.any(Date),
          }),
        );

        // After
        await rollback(prisma);
      });
    });
  });
});

describe('📝 user.get', () => {
  describe('🌿 分岐条件', () => {
    const targetData: Prisma.UserCreateManyInput = {
      user_id: 1,
      email: 'mytest@example.com',
      username: 'mytest',
      created_by: 0,
      updated_by: 0,
      updated_at: new Date('2023-07-17T01:19:03+09:00'),
    };

    test(`✅ 正常に処理が終了したとき、 対象のデータが返却されること`, () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');
        await prisma.user.createMany({
          skipDuplicates: false,
          data: [
            targetData,
            {
              user_id: 2,
              email: 'mytest@example.com2',
              username: 'mytest2',
              created_by: 0,
              updated_by: 0,
            },
            {
              user_id: 3,
              email: 'mytest@example.com3',
              username: 'mytest3',
              created_by: 0,
              updated_by: 0,
            },
          ],
        });

        // Act
        const user = await UserService.getUser('reqid', prisma, 0, { user_id: 1 });

        // Assert
        // 対象のデータが返却されること
        expect(user).toStrictEqual(
          expect.objectContaining({
            ...targetData,
            updated_at: expect.any(Date),
          }),
        );

        // After
        await rollback(prisma);
      });
    });
    test('❗ 対象のデータが存在しないとき、 削除済みエラーとなること', () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');
        await prisma.user.createMany({
          skipDuplicates: false,
          data: [
            // targetData, // ❗ mismatch
            {
              user_id: 2,
              email: 'mytest@example.com2',
              username: 'mytest2',
              created_by: 0,
              updated_by: 0,
            },
            {
              user_id: 3,
              email: 'mytest@example.com3',
              username: 'mytest3',
              created_by: 0,
              updated_by: 0,
            },
          ],
        });

        // Act
        await expect(() =>
          UserService.getUser('reqid', prisma, 0, {
            user_id: 1, // ❗ mismatch
          }),
        ).rejects.toThrow(
          // Assert
          // 削除済みエラーとなること
          new TRPCError({
            code: 'NOT_FOUND',
            message: DATA_IS_NOT_EXIST_MESSAGE,
          }),
        );

        // After
        await rollback(prisma);
      });
    });
  });
});

describe('📝 user.update', () => {
  describe('🌿 分岐条件', () => {
    const targetData: Prisma.UserCreateManyInput = {
      user_id: 1,
      email: 'mytest@example.com',
      username: 'mytest',
      created_by: 0,
      updated_by: 0,
      updated_at: new Date('2023-07-17T01:19:03+09:00'),
    };

    test(`✅ 正常に処理が終了したとき、 対象のデータが返却されること`, () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');
        await prisma.user.createMany({
          skipDuplicates: false,
          data: [
            targetData,
            {
              user_id: 2,
              email: 'mytest@example.com2',
              username: 'mytest2',
              created_by: 0,
              updated_by: 0,
            },
            {
              user_id: 3,
              email: 'mytest@example.com3',
              username: 'mytest3',
              created_by: 0,
              updated_by: 0,
            },
          ],
        });

        // Act
        const input: z.infer<typeof UserRouterSchema.updateInput> = {
          email: 'mytest@example.com',
          username: 'mytest',

          user_id: 1,
          updated_at: new Date('2023-07-17T01:19:03+09:00'),
        };
        const user = await UserService.updateUser('reqid', prisma, 0, input);

        // Assert
        // 対象のデータが返却されること
        expect(user).toStrictEqual(
          expect.objectContaining({
            ...input,
            updated_at: expect.anything(),
          }),
        );

        // After
        await rollback(prisma);
      });
    });
    test('❗ 対象のデータが存在しないとき、 削除済みエラーとなること', () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');
        await prisma.user.createMany({
          skipDuplicates: false,
          data: [
            // targetData, // ❗ mismatch
            {
              user_id: 2,
              email: 'mytest@example.com2',
              username: 'mytest2',
              created_by: 0,
              updated_by: 0,
            },
            {
              user_id: 3,
              email: 'mytest@example.com3',
              username: 'mytest3',
              created_by: 0,
              updated_by: 0,
            },
          ],
        });

        // Act
        const input: z.infer<typeof UserRouterSchema.updateInput> = {
          email: 'update-mytest@example.com',
          username: 'update-mytest',

          user_id: 1, // ❗ mismatch
          updated_at: new Date('2023-07-17T01:19:03+09:00'),
        };
        await expect(() => UserService.updateUser('reqid', prisma, 0, input)).rejects.toThrow(
          // Assert
          // 削除済みエラーとなること
          new TRPCError({
            code: 'NOT_FOUND',
            message: DATA_IS_NOT_EXIST_MESSAGE,
          }),
        );

        // After
        await rollback(prisma);
      });
    });
    test('❗ 対象のデータと更新日時が一致しないとき、 更新競合エラーとなること', () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');
        await prisma.user.createMany({
          skipDuplicates: false,
          data: [
            targetData,
            {
              user_id: 2,
              email: 'mytest@example.com2',
              username: 'mytest2',
              created_by: 0,
              updated_by: 0,
            },
            {
              user_id: 3,
              email: 'mytest@example.com3',
              username: 'mytest3',
              created_by: 0,
              updated_by: 0,
            },
          ],
        });

        // Act
        const input: z.infer<typeof UserRouterSchema.updateInput> = {
          email: 'update-mytest@example.com',
          username: 'update-mytest',

          user_id: 1,
          updated_at: new Date('2023-07-17T01:19:04+09:00'), // ❗ mismatch
        };
        await expect(() => UserService.updateUser('reqid', prisma, 0, input)).rejects.toThrow(
          // Assert
          // 更新競合エラーとなること
          new TRPCError({
            code: 'CONFLICT',
            message: PREVIOUS_IS_UPDATED_MESSAGE,
          }),
        );

        // After
        await rollback(prisma);
      });
    });
    test('❗ 入力したメールアドレスが既に登録されているとき、 重複エラーとなること', () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');
        await prisma.user.createMany({
          skipDuplicates: false,
          data: [
            targetData,
            {
              user_id: 2,
              email: 'mytest@example.com2', // ❗ duplication
              username: 'mytest2',
              created_by: 0,
              updated_by: 0,
            },
            {
              user_id: 3,
              email: 'mytest@example.com3',
              username: 'mytest3',
              created_by: 0,
              updated_by: 0,
            },
          ],
        });

        // Act
        const input: z.infer<typeof UserRouterSchema.updateInput> = {
          email: 'mytest@example.com2', // ❗ duplication
          username: 'mytest2',

          user_id: 1,
          updated_at: new Date('2023-07-17T01:19:03+09:00'),
        };
        await expect(() => UserService.updateUser('reqid', prisma, 0, input)).rejects.toThrow(
          // Assert
          // 重複エラーとなること
          new TRPCError({
            code: 'CONFLICT',
            message: DUPLICATE_IS_EXISTING_MESSAGE,
          }),
        );

        // After
        await rollback(prisma);
      });
    });
  });
  describe('💾 データアクセス', () => {
    test(`✅ 全項目 => 必須のみ に更新`, () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');
        await prisma.user.createMany({
          skipDuplicates: false,
          data: [
            {
              user_id: 1,
              email: 'mytest@example.com',
              username: 'mytest',
              created_by: 0,
              updated_by: 0,
              updated_at: new Date('2023-07-17T01:19:03+09:00'),
            },
            {
              user_id: 2,
              email: 'mytest@example.com2',
              username: 'mytest2',
              created_by: 0,
              updated_by: 0,
            },
            {
              user_id: 3,
              email: 'mytest@example.com3',
              username: 'mytest3',
              created_by: 0,
              updated_by: 0,
            },
          ],
        });

        // Act
        const input: z.infer<typeof UserRouterSchema.updateInput> = {
          email: 'updated@example.com',
          username: 'updated',

          user_id: 1,
          updated_at: new Date('2023-07-17T01:19:03+09:00'),
        };
        const user = await UserService.updateUser('reqid', prisma, 0, input);

        // Assert
        // データが登録されていること
        expect(await prisma.user.findUnique({ where: { user_id: user.user_id } })).toStrictEqual(
          expect.objectContaining({
            ...input,
            updated_at: expect.any(Date),
          }),
        );

        // After
        await rollback(prisma);
      });
    });
    test(`✅ 必須のみ登録`, () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');
        await prisma.user.createMany({
          skipDuplicates: false,
          data: [
            {
              user_id: 1,
              email: 'mytest@example.com',
              username: 'mytest',
              created_by: 0,
              updated_by: 0,
              updated_at: new Date('2023-07-17T01:19:03+09:00'),
            },
            {
              user_id: 2,
              email: 'mytest@example.com2',
              username: 'mytest2',
              created_by: 0,
              updated_by: 0,
            },
            {
              user_id: 3,
              email: 'mytest@example.com3',
              username: 'mytest3',
              created_by: 0,
              updated_by: 0,
            },
          ],
        });

        // Act
        const input: z.infer<typeof UserRouterSchema.updateInput> = {
          email: 'mytest@example.com',
          username: 'mytest',

          user_id: 1,
          updated_at: new Date('2023-07-17T01:19:03+09:00'),
        };
        const user = await UserService.updateUser('reqid', prisma, 0, input);

        // Assert
        // データが登録されていること
        expect(await prisma.user.findUnique({ where: { user_id: user.user_id } })).toStrictEqual(
          expect.objectContaining({
            ...input,
            updated_at: expect.any(Date),
          }),
        );

        // After
        await rollback(prisma);
      });
    });
  });
});

describe('📝 user.delete', () => {
  describe('🌿 分岐条件', () => {
    const targetData: Prisma.UserCreateManyInput = {
      user_id: 1,
      email: 'mytest@example.com',
      username: 'mytest',
      created_by: 0,
      updated_by: 0,
      updated_at: new Date('2023-07-17T01:19:03+09:00'),
    };

    test(`✅ 正常に処理が終了したとき、 対象のデータが返却されること`, () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');
        await prisma.user.createMany({
          skipDuplicates: false,
          data: [
            targetData,
            {
              user_id: 2,
              email: 'mytest@example.com2',
              username: 'mytest2',
              created_by: 0,
              updated_by: 0,
            },
            {
              user_id: 3,
              email: 'mytest@example.com3',
              username: 'mytest3',
              created_by: 0,
              updated_by: 0,
            },
          ],
        });

        // Act
        const user = await UserService.deleteUser('reqid', prisma, 0, {
          user_id: 1,
          updated_at: new Date('2023-07-17T01:19:03+09:00'),
        });

        // Assert
        // 対象のデータが返却されること
        expect(user).toStrictEqual(expect.objectContaining(targetData));

        // After
        await rollback(prisma);
      });
    });
    test('❗ 対象のデータが存在しないとき、 削除済みエラーとなること', () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');
        await prisma.user.createMany({
          skipDuplicates: false,
          data: [
            // targetData,
            {
              user_id: 2,
              email: 'mytest@example.com2',
              username: 'mytest2',
              created_by: 0,
              updated_by: 0,
            },
            {
              user_id: 3,
              email: 'mytest@example.com3',
              username: 'mytest3',
              created_by: 0,
              updated_by: 0,
            },
          ],
        });

        // Act
        await expect(() =>
          UserService.deleteUser('reqid', prisma, 0, {
            user_id: 1, // ❗ mismatch
            updated_at: new Date('2023-07-17T01:19:03+09:00'),
          }),
        ).rejects.toThrow(
          // Assert
          // 削除済みエラーとなること
          new TRPCError({
            code: 'NOT_FOUND',
            message: DATA_IS_NOT_EXIST_MESSAGE,
          }),
        );

        // After
        await rollback(prisma);
      });
    });
    test('❗ 対象のデータと更新日時が一致しないとき、 更新競合エラーとなること', () => {
      return prisma.$transaction(async (prisma) => {
        // Arrange
        await truncate(prisma, 'user');
        await prisma.user.createMany({
          skipDuplicates: false,
          data: [
            targetData,
            {
              user_id: 2,
              email: 'mytest@example.com2',
              username: 'mytest2',
              created_by: 0,
              updated_by: 0,
            },
            {
              user_id: 3,
              email: 'mytest@example.com3',
              username: 'mytest3',
              created_by: 0,
              updated_by: 0,
            },
          ],
        });

        // Act
        await expect(() =>
          UserService.deleteUser('reqid', prisma, 0, {
            user_id: 1,
            updated_at: new Date('2023-07-17T01:19:04+09:00'), // ❗ mismatch
          }),
        ).rejects.toThrow(
          // Assert
          // 更新競合エラーとなること
          new TRPCError({
            code: 'CONFLICT',
            message: PREVIOUS_IS_UPDATED_MESSAGE,
          }),
        );

        // After
        await rollback(prisma);
      });
    });
  });
});
