import RecipesController from "./recipes.controller.js";
const recipesController = new RecipesController();

export default async function (fastify) {
  fastify.get("/:id", recipesController.getRecipe);
  fastify.get("/content/:id", recipesController.getRecipeContent);
  fastify.get(
    "/all/:limit-:offset-:title-:kitchen-:dish",
    recipesController.getRecipes,
  );
  fastify.get("/comments/:id", recipesController.getComments);
  fastify.get("/actions/:recipe/:user", recipesController.getUserActions);

  fastify.post("/", recipesController.createRecipe);
  fastify.post("/save", recipesController.saveRecipe);
  fastify.post("/like", recipesController.likeRecipe);
  fastify.post("/view", recipesController.addView);
  fastify.post("/comments", recipesController.addComment);

  fastify.delete("/save", recipesController.deleteSave);
  fastify.delete("/like", recipesController.deleteLike);
}
