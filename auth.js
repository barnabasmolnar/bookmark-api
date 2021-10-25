import passport from "koa-passport";
import GoogleOAuth2 from "passport-google-oauth20";
import Boom from "@hapi/boom";
import Router from "@koa/router";

import prisma from "./prisma";

const { Strategy: GoogleStrategy } = GoogleOAuth2;

const router = new Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      try {
        const user = await prisma.user.upsert({
          where: { googleId: profile.id },
          update: { name: profile.displayName },
          create: { name: profile.displayName, googleId: profile.id },
        });
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

router.get("/login", passport.authenticate("google", { scope: "profile" }));
router.get(
  "/oauth2callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/login" }),
  (ctx) => {
    ctx.body = ctx.state.user;
  }
);
router.get("/logout", (ctx) => {
  ctx.logout();
  ctx.status = 200;
});

export const isProtected = async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    await next();
  } else {
    throw Boom.unauthorized("Please log in to continue.");
  }
};

export const authRoutes = router;
