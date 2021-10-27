import prisma from "../prisma";

export const getAllBookmarks = (userId) =>
  prisma.bookmark.findMany({
    where: { authorId: userId },
    include: { author: true, tags: true },
  });

export const createBookmark = (body, userId) =>
  prisma.bookmark.create({
    include: { author: true, tags: true },
    data: {
      ...body,
      author: {
        connect: {
          id: userId,
        },
      },
      tags: {
        connectOrCreate: body.tags?.map((tag) => ({
          create: { name: tag },
          where: { name: tag },
        })),
      },
    },
  });

export const updateBookmark = (id, body) =>
  prisma.bookmark.update({
    where: { id },
    data: {
      ...body,
      tags: {
        set: body.tags ? [] : undefined,
        connectOrCreate: body.tags?.map((tag) => ({
          create: { name: tag },
          where: { name: tag },
        })),
      },
    },
    include: { tags: true },
  });

export const removeBookmark = (id) =>
  prisma.bookmark.delete({
    where: { id },
  });
