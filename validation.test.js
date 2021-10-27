import { postBookmarkSchema } from "./validation";

describe("bookmark post validation tests", () => {
  it("should pass validation", () => {
    expect(
      postBookmarkSchema.isValidSync({ title: "title", url: "http://hm.com" })
    ).toBe(true);
  });

  it("should fail url validation", async () => {
    await expect(
      postBookmarkSchema.validate({ title: "title", url: "hm.com" })
    ).rejects.toThrow("url must be a valid URL");
  });

  it(`should convert description: "" to description: null`, async () => {
    const bookmark = await postBookmarkSchema.validate({
      title: "title",
      url: "http://hm.com",
      description: "",
    });
    expect(bookmark).toHaveProperty("description", null);
  });

  it(`should fail tags validation`, async () => {
    await expect(
      postBookmarkSchema.validate({
        title: "title",
        url: "hm.com",
        tags: "lel",
      })
    ).rejects.toThrow("tags must be a `array` type");
  });
});
