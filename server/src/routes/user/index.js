import UserController from "./user.controller.js";
const userController = new UserController();

export default async function (fastify) {
  fastify.get("/:id", userController.getUserData);
  fastify.get("/:id/recipes", userController.getUserRecipes);
  fastify.get("/:id/saved", userController.getUserSavedRecipes);
  fastify.get("/sign-in/:email-:password", userController.signIn);

  fastify.post("/sign-up", userController.signUp);
  fastify.post("/avatar", userController.setAvatar);
  fastify.post("/biography", userController.setBiography);

  fastify.delete("/:id", userController.deleteUser);
}
