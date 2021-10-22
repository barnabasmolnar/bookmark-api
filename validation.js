const yup = require("yup");
const Boom = require("@hapi/boom");

const postBookmarkSchema = yup.object().shape({
  title: yup.string().required(),
  url: yup.string().url().required(),
  tags: yup.array().of(yup.string().required()),
  description: yup
    .string()
    .nullable()
    .transform((v) => (typeof v === "string" && !v.length ? null : v)),
});

const patchBookmarkSchema = yup.object().shape({
  title: yup.string(),
  url: yup.string().url(),
  tags: yup.array().of(yup.string().required()),
  description: yup
    .string()
    .nullable()
    .transform((v) => (typeof v === "string" && !v.length ? null : v)),
});

const paramsSchema = yup.object().shape({
  id: yup.number().integer().required(),
});

const validateParams = (schema) => async (ctx, next) => {
  try {
    ctx.validatedParams = await schema.validate(ctx.params);
  } catch (error) {
    throw Boom.notFound();
  }
  await next();
};

const validateSchema = (schema) => async (ctx, next) => {
  try {
    ctx.request.validatedBody = await schema.validate(ctx.request.body, {
      stripUnknown: true,
    });
  } catch (error) {
    throw Boom.badRequest("Validation error.", error);
  }
  await next();
};

module.exports = {
  postBookmarkSchema,
  patchBookmarkSchema,
  validateSchema,
  paramsSchema,
  validateParams,
};
