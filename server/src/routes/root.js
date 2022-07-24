export default async function (fastify, opts) {
  fastify.get("/", async (req, res) => {
    res.send("Welcome to server of Recipes app");
  });
}
