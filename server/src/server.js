import path from "path";
import Fastify from "fastify";
import autoload from "@fastify/autoload";
import cloudinary from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve();
const fastify = new Fastify({ logger: true });

fastify.register(autoload, {
  dir: path.join(__dirname, "src/plugins"),
});

fastify.register(autoload, {
  dir: path.join(__dirname, "src/routes"),
});

try {
  fastify.listen({ host: "0.0.0.0", port: 4000 });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
