import Boom from "@hapi/boom";

export default async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(error);
    const e = Boom.isBoom(error) ? error : Boom.badImplementation();
    ctx.status = e.output.statusCode;
    ctx.body = { boomPayload: e.output.payload, data: e.data };
  }
};
