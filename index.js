import "./env";

import Koa from "koa";
import session from "koa-session";
import passport from "koa-passport";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";

import prisma from "./prisma";
import { isProtected, authRoutes } from "./auth";
import bookmarkRoutes from "./bookmarks";
import errorHandling from "./errors";
import tagRoutes from "./tags";
import profileRoutes from "./profile";

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
