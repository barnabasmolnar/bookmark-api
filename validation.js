import yup from "yup";
import Boom from "@hapi/boom";

const convertToNullIfEmptyString = yup
  .string()
  .nullable()
  .transform((v) => (typeof v === "string" && !v.length ? null : v));

export const postBookmarkSchema = yup.object().shape({
  title: yup.string().required(),
  url: yup.string().url().required(),
  tags: yup.array().of(yup.string().required()),
  description: convertToNullIfEmptyString,
});

export const patchBookmarkSchema = yup.object().shape({
  title: yup.string(),
  url: yup.string().url(),
  tags: yup.array().of(yup.string().required()),
  description: convertToNullIfEmptyString,
});

export const paramsSchema = yup.object().shape({
  id: yup.number().integer().required(),
});

export const validateParams = (schema) => async (ctx, next) => {
  try {
    ctx.validatedParams = await schema.validate(ctx.params);
  } catch (error) {
    throw Boom.notFound();
  }
  await next();
};

export const validateSchema = (schema) => async (ctx, next) => {
  try {
    ctx.request.validatedBody = await schema.validate(ctx.request.body, {
      stripUnknown: true,
    });
  } catch (error) {
    throw Boom.badRequest("Validation error.", error);
  }
  await next();
};
