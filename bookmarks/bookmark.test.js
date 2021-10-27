import prismaErrors from "@prisma/client/runtime";

const { PrismaClientValidationError, PrismaClientKnownRequestError } =
  prismaErrors;

import { createBookmark, updateBookmark } from "./model";
import prisma from "../prisma";

afterAll(async () => {
  await prisma.bookmark.deleteMany({ where: { title: "csodatitle" } });
  await prisma.tag.deleteMany({ where: { name: "general kenobi" } });
  await prisma.$disconnect();
});

describe("create bookmark model/prisma tests", () => {
  it("should create a bookmark where description is null", async () => {
    const bookmark = await createBookmark(
      { title: "csodatitle", url: "totally not cool but whatever" },
      1
    );
    expect(bookmark).toHaveProperty("description", null);
  });

  it("should create a bookmark with a description", async () => {
    const bookmark = await createBookmark(
      {
        title: "csodatitle",
        url: "totally not cool but whatever",
        description: "desc",
      },
      2
    );
    expect(bookmark).toHaveProperty("description", "desc");
  });

  it("should fail with a PrismaClientValidationError", async () => {
    await expect(createBookmark({ title: "csodatitle" }, 1)).rejects.toThrow(
      PrismaClientValidationError
    );
  });

  it("should fail with a PrismaClientKnownRequestError", async () => {
    await expect(
      createBookmark({ title: "csodatitle", url: "csoda.com" }, 465216895431)
    ).rejects.toThrow(PrismaClientKnownRequestError);
  });
});

describe("update bookmark model/prisma tests", () => {
  it("should update the description", async () => {
    const bookmark = await prisma.bookmark.findFirst({
      where: { title: "csodatitle" },
    });

    const updatedBookmark = await updateBookmark(bookmark.id, {
      description: "hello there!",
    });

    expect(updatedBookmark).toHaveProperty("description", "hello there!");
  });

  it("should remove the description, ie set it to null", async () => {
    const bookmark = await prisma.bookmark.findFirst({
      where: { title: "csodatitle", description: "desc" },
    });

    const updatedBookmark = await updateBookmark(bookmark.id, {
      description: null,
    });

    expect(updatedBookmark).toHaveProperty("description", null);
  });

  it("should leave the description completely unchanged", async () => {
    const bookmark = await prisma.bookmark.findFirst({
      where: { title: "csodatitle", description: "hello there!" },
    });

    const updatedBookmark = await updateBookmark(bookmark.id, {
      url: "hello there!.com",
    });

    expect(updatedBookmark).toHaveProperty("description", "hello there!");
  });
});

describe("tags", () => {
  it("should create a bookmark with a tag", async () => {
    const bookmark = await createBookmark(
      {
        title: "csodatitle",
        url: "nem adja.cominho",
        tags: ["general kenobi"],
      },
      8
    );

    expect(bookmark.tags[0]).toHaveProperty("name", "general kenobi");
  });

  it("should remove all tags from the bookmark but persist the tags in the db", async () => {
    const bookmark = await prisma.bookmark.findFirst({
      where: { url: "nem adja.cominho" },
      include: { tags: true },
    });

    const updated = await updateBookmark(bookmark.id, { tags: [] });
    expect(updated).toHaveProperty("tags", []);

    const tag = await prisma.tag.findUnique({
      where: { name: "general kenobi" },
    });
    expect(tag).toHaveProperty("name", "general kenobi");
  });
});
