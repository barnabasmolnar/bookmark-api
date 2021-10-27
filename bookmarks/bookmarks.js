import Router from "@koa/router";

import {
  postBookmarkSchema,
  patchBookmarkSchema,
  validateSchema,
} from "../validation";
import {
  createBookmark,
  getAllBookmarks,
  removeBookmark,
  updateBookmark,
} from "./model";
import { validateBookmarkWithUser } from "./middleware";

const router = new Router();

router.get("/", async (ctx) => {
  const userId = ctx.state.user.id;
  const bookmarks = await getAllBookmarks(userId);
  ctx.body = bookmarks;
});

router.get("/:id", ...validateBookmarkWithUser, async (ctx) => {
  ctx.body = ctx.bookmark;
});

router.post("/", validateSchema(postBookmarkSchema), async (ctx) => {
  const userId = ctx.state.user.id;
  const body = ctx.request.validatedBody;

  ctx.body = await createBookmark(body, userId);
});

router.patch(
  "/:id",
  ...validateBookmarkWithUser,
  validateSchema(patchBookmarkSchema),
  async (ctx) => {
    const id = ctx.validatedParams.id;
    const body = ctx.request.validatedBody;

    ctx.body = await updateBookmark(id, body);
  }
);

router.delete("/:id", ...validateBookmarkWithUser, async (ctx) => {
  await removeBookmark(ctx.validatedParams.id);

  ctx.status = 204;
});

export default router;
