const Router = require("@koa/router");
const prisma = require("./prisma");
const {
  postBookmarkSchema,
  patchBookmarkSchema,
  validateSchema,
  paramsSchema,
  validateParams,
} = require("./validation");
const Boom = require("@hapi/boom");

const router = new Router();

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

const validateBookmarkWithUser = [validateParams(paramsSchema), belongsToUser];

router.get("/", async (ctx) => {
  const userId = ctx.state.user.id;
  const bookmarks = await prisma.bookmark.findMany({
    where: { authorId: userId },
    include: { author: true, tags: true },
  });
  ctx.body = bookmarks;
});

router.get("/:id", ...validateBookmarkWithUser, async (ctx) => {
  ctx.body = ctx.bookmark;
});

router.post("/", validateSchema(postBookmarkSchema), async (ctx) => {
  const userId = ctx.state.user.id;
  const body = ctx.request.validatedBody;

  ctx.body = await prisma.bookmark.create({
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
});

router.patch(
  "/:id",
  ...validateBookmarkWithUser,
  validateSchema(patchBookmarkSchema),
  async (ctx) => {
    const body = ctx.request.validatedBody;

    ctx.body = await prisma.bookmark.update({
      where: { id: ctx.validatedParams.id },
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
  }
);

router.delete("/:id", ...validateBookmarkWithUser, async (ctx) => {
  await prisma.bookmark.delete({
    where: { id: ctx.validatedParams.id },
  });

  ctx.status = 204;
});

module.exports = router;
