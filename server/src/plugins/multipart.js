import fp from "fastify-plugin";

export default fp(async function (fastify) {
  fastify.register(import("@fastify/multipart"));
});
