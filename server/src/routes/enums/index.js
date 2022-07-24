import EnumsRepository from "./enums.repository.js";
const enumsRepository = new EnumsRepository();

export default async function (fastify) {
  fastify.get("/", async (req, res) => {
    const data = await enumsRepository.getEnums();
    res.send(data);
  });
}
