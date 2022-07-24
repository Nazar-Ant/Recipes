import UserService from "./user.service.js";
const userService = new UserService();

export default class UserController {
  async getUserData(req, res) {
    const userData = await userService.getUserData(req.params.id);
    res.send(userData);
  }

  async getUserRecipes(req, res) {
    const recipes = await userService.getUserRecipes(req.params.id);
    res.send(recipes);
  }

  async getUserSavedRecipes(req, res) {
    const saved = await userService.getUserSavedRecipes(req.params.id);
    res.send(saved);
  }

  async signIn(req, res) {
    const { email, password } = req.params;
    const user = await userService.getUser(email, password);
    res.send(user);
  }

  async signUp(req, res) {
    const { name, email, password } = req.body;
    const user = await userService.createUser(name, email, password);
    res.send(user);
  }

  async setAvatar(req, res) {
    const file = await req.file();
    const avatarUrl = await userService.createAvatar(file);
    res.send(avatarUrl);
  }

  async setBiography(req, res) {
    const biography = await userService.setBiography(
      req.body.user,
      req.body.biography,
    );
    res.send({ result: biography });
  }

  async deleteUser(req, res) {
    const result = await userService.deleteUser(req.params.id);
    res.send({ result });
  }
}
