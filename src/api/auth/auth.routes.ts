import { FastifyInstance } from "fastify";
import { authHandler } from ".";
import { isUserWhitelisted, userAuthenticated } from "../../middlewares/authMiddleware";

export default function (fastify: FastifyInstance, opts: any, done: any) {
    // fastify.get("/twitch", {
    //     handler: handleTwitchAuth,
    // });

    fastify.get("/twitch/callback", {
        handler: (req, reply) => authHandler.handleTwitchCallback(fastify, req, reply),
    });

    fastify.get("/check-session", authHandler.checkSession);

    fastify.get("/user", {
        preHandler: [isUserWhitelisted, userAuthenticated],
        handler: authHandler.getUser,
    });

    fastify.get("/refresh", {
        preHandler: [isUserWhitelisted, userAuthenticated],
        handler: authHandler.refreshToken,
    });

    fastify.get("/signout", {
        preHandler: [isUserWhitelisted, userAuthenticated],
        handler: authHandler.signOut,
    });

    done();
}
