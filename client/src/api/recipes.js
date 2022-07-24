export default class RecipesApi {
  async getRecipe(id) {
    try {
      const res = await fetch(`http://localhost:4000/recipes/${id}`);
      return res.json();
    } catch (err) {
      return err;
    }
  }

  async getRecipeContent(id) {
    try {
      const res = await fetch(`http://localhost:4000/recipes/content/${id}`);
      const data = await res.json();
      return data.content;
    } catch (err) {
      return err;
    }
  }

  async getRecipes(limit, offset, query) {
    try {
      const res = await fetch(
        `http://localhost:4000/recipes/all/${limit}-${offset}-${
          query?.title || ""
        }-${query?.kitchen || ""}-${query?.dish || ""}`,
      );
      return res.json();
    } catch (err) {
      return err;
    }
  }

  async getComments(recipe) {
    try {
      const res = await fetch(
        `http://localhost:4000/recipes/comments/${recipe}`,
      );
      return res.json();
    } catch (err) {
      return err;
    }
  }

  async getUserActions(action) {
    try {
      const res = await fetch(
        `http://localhost:4000/recipes/actions/${action.recipe}/${action.user}`,
      );
      return res.json();
    } catch (err) {
      return err;
    }
  }

  async createRecipe(recipe) {
    try {
      const res = await fetch("http://localhost:4000/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });

      return res.json();
    } catch (err) {
      return err;
    }
  }

  async saveRecipe(userHaveSaving, save) {
    try {
      const res = await fetch("http://localhost:4000/recipes/save", {
        method: userHaveSaving ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(save),
      });
      const data = await res.json();

      return data.result;
    } catch (err) {
      return err;
    }
  }

  async likeRecipe(userHaveLike, save) {
    try {
      const res = await fetch("http://localhost:4000/recipes/like", {
        method: userHaveLike ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(save),
      });
      const data = await res.json();

      return data.result;
    } catch (err) {
      return err;
    }
  }

  async addView(view) {
    try {
      const res = await fetch("http://localhost:4000/recipes/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(view),
      });
      const data = await res.json();

      return data.result;
    } catch (err) {
      return err;
    }
  }

  async addComment(comment) {
    try {
      const res = await fetch("http://localhost:4000/recipes/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });
      const data = await res.json();

      return data.result;
    } catch (err) {
      return err;
    }
  }
}
