import Boom from "@hapi/boom";

import prisma from "../prisma";
import { paramsSchema, validateParams } from "../validation";

const belongsToUser = async (ctx, next) => {
  const userId = ctx.state.user.id;

  const bookmark = await prisma.bookmark.findFirst({
    where: { authorId: userId, id: ctx.validatedParams.id },
    include: { tags: true, author: true },
  });

  if (bookmark?.authorId !== userId) {
    throw Boom.notFound();
    return;
  }

  ctx.bookmark = bookmark;

  await next();
};

export const validateBookmarkWithUser = [
  validateParams(paramsSchema),
  belongsToUser,
];
