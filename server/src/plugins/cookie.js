import fp from "fastify-plugin";

export default fp(async function (fastify, opts) {
  fastify.register(import("@fastify/cookie"), {
    secret: "secret",
    parseOptions: {},
  });
});
