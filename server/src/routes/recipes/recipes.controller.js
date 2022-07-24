import RecipesRepository from "./recipes.repository.js";
const recipesRepository = new RecipesRepository();

export default class RecipesController {
  // GET
  async getRecipe(req, res) {
    const recipe = await recipesRepository.getRecipe(req.params.id);
    res.send(recipe);
  }

  async getRecipeContent(req, res) {
    const content = await recipesRepository.getRecipeContent(req.params.id);
    res.send({ content });
  }

  async getRecipes(req, res) {
    const recipes = await recipesRepository.getRecipes({
      limit: +req.params.limit,
      offset: +req.params.offset,
      title: req.params.title,
      kitchen: req.params.kitchen,
      dish: req.params.dish,
    });
    res.send(recipes);
  }

  async getComments(req, res) {
    const comments = await recipesRepository.getComments(req.params.id);
    res.send(comments);
  }

  async getUserActions(req, res) {
    const actions = await recipesRepository.getUserActions(
      req.params.user,
      req.params.recipe,
    );
    res.send(actions);
  }

  // POST
  async createRecipe(req, res) {
    const recipe = await recipesRepository.createRecipe(req.body);
    res.send(recipe);
  }

  async saveRecipe(req, res) {
    const save = await recipesRepository.saveRecipe(
      req.body.user,
      req.body.recipe,
    );
    res.send({ result: save });
  }

  async likeRecipe(req, res) {
    const like = await recipesRepository.likeRecipe(
      req.body.user,
      req.body.recipe,
    );
    res.send({ result: like });
  }

  async addView(req, res) {
    const view = await recipesRepository.addView(
      req.body.user,
      req.body.recipe,
    );
    res.send({ result: view });
  }

  async addComment(req, res) {
    const { user, recipe, text } = req.body;
    const comment = await recipesRepository.addComment(user, recipe, text);
    res.send({ result: comment });
  }

  // DELETE
  async deleteSave(req, res) {
    const save = await recipesRepository.deleteSave(
      req.body.user,
      req.body.recipe,
    );
    res.send({ result: save });
  }

  async deleteLike(req, res) {
    const like = await recipesRepository.deleteLike(
      req.body.user,
      req.body.recipe,
    );
    res.send({ result: like });
  }
}
