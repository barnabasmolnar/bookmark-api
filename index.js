require("dotenv").config();

const Koa = require("koa");
const session = require("koa-session");
const passport = require("koa-passport");
const Router = require("@koa/router");
const prisma = require("./prisma");
const { isProtected, authRoutes } = require("./auth");
const bookmarkRoutes = require("./bookmarks");
const bodyParser = require("koa-bodyparser");
const errorHandling = require("./errors");
const logger = require("koa-logger");
const tagRoutes = require("./tags");
const profileRoutes = require("./profile");

const app = new Koa();

app.keys = [process.env.SESSION_SECRET];

app.use(logger());
app.use(bodyParser());
app.use(session(app));
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandling);

const router = new Router();
router.prefix("/api");

router.use("/auth", authRoutes.routes());
router.use("/bookmark", isProtected, bookmarkRoutes.routes());
router.use("/tag", isProtected, tagRoutes.routes());
router.use("/profile", isProtected, profileRoutes.routes());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3001).on("close", async () => await prisma.$disconnect());
