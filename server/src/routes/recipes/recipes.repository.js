import pool from "../../db/index.js";

export default class RecipesRepository {
  // GET
  async getRecipe(recipeId) {
    try {
      const recipe = await pool.query(
        `SELECT recipes.*, users.name, users.avatar_url,
        (SELECT COUNT(likes) AS likes FROM likes WHERE likes.recipe_id = $1),
        (SELECT COUNT(views) AS views FROM views WHERE views.recipe_id = $1),
        (SELECT COUNT(saves) AS saves FROM saves WHERE saves.recipe_id = $1),
        (SELECT COUNT(comments) AS comments FROM comments WHERE comments.recipe_id = $1)
        FROM recipes
        JOIN users ON users.user_id = recipes.author_id
        WHERE recipes.recipe_id = $1`,
        [recipeId],
      );

      return recipe.rows[0];
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async getRecipeContent(recipeId) {
    try {
      const content = await pool.query(
        "SELECT content FROM recipes WHERE recipe_id = $1",
        [recipeId],
      );

      return content.rows[0].content;
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async getRecipes(query) {
    try {
      let condition = `WHERE recipes.title ILIKE '%${query.title}%'`;

      if (query.kitchen) {
        condition += `AND recipes.kitchen = '${query.kitchen}'`;
      }

      if (query.dish) {
        condition += `AND recipes.dish = '${query.dish}'`;
      }

      const recipes = await pool.query(
        `SELECT recipes.recipe_id, recipes.title, recipes.kitchen, recipes.dish, recipes.cooking_time, recipes.created_at, users.name, users.avatar_url,
        (SELECT COUNT(likes) AS likes FROM likes WHERE likes.recipe_id = recipes.recipe_id),
        (SELECT COUNT(views) AS views FROM views WHERE views.recipe_id = recipes.recipe_id),
        (SELECT COUNT(saves) AS saves FROM saves WHERE saves.recipe_id = recipes.recipe_id),
        (SELECT COUNT(comments) AS comments FROM comments WHERE comments.recipe_id = recipes.recipe_id)
        FROM recipes
        JOIN users ON users.user_id = recipes.author_id
        ${condition}
        LIMIT $1
        OFFSET $2`,
        [query.limit, query.offset],
      );

      return recipes.rows;
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async getComments(recipeId) {
    try {
      const comments = await pool.query(
        `SELECT comments.*, users.name, users.avatar_url
        FROM comments
        JOIN users ON user_id = author_id
        WHERE comments.recipe_id = $1`,
        [recipeId],
      );

      return comments.rows;
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async getUserActions(userId, recipeId) {
    try {
      const save = await pool.query(
        "SELECT * FROM saves WHERE user_id = $1 AND recipe_id = $2",
        [userId, recipeId],
      );
      const like = await pool.query(
        "SELECT * FROM likes WHERE user_id = $1 AND recipe_id = $2",
        [userId, recipeId],
      );

      return { save: !!save.rowCount, like: !!like.rowCount };
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  // POST
  async createRecipe(recipe) {
    try {
      const res = await pool.query(
        "INSERT INTO recipes (title, content, kitchen, dish, cooking_time, author_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING recipe_id",
        [
          recipe.title,
          recipe.content,
          recipe.kitchen,
          recipe.dish,
          recipe.cookingTime,
          recipe.author,
        ],
      );

      return res.rows[0];
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async saveRecipe(userId, recipeId) {
    try {
      await pool.query(
        "INSERT INTO saves (user_id, recipe_id) VALUES ($1, $2)",
        [userId, recipeId],
      );

      return true;
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async likeRecipe(userId, recipeId) {
    try {
      await pool.query(
        "INSERT INTO likes (user_id, recipe_id) VALUES ($1, $2)",
        [userId, recipeId],
      );

      return true;
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async addView(userId, recipeId) {
    try {
      const viewAlreadyExists = await pool.query(
        "SELECT * FROM views WHERE user_id = $1 AND recipe_id = $2",
        [userId, recipeId],
      );

      if (viewAlreadyExists.rowCount) {
        return true;
      } else {
        await pool.query(
          "INSERT INTO views (user_id, recipe_id) VALUES ($1, $2)",
          [userId, recipeId],
        );
        return true;
      }
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async addComment(userId, recipeId, text) {
    try {
      await pool.query(
        "INSERT INTO comments (author_id, recipe_id, content) VALUES ($1, $2, $3)",
        [userId, recipeId, text],
      );

      return true;
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  // DELETE
  async deleteSave(userId, recipeId) {
    try {
      await pool.query(
        "DELETE FROM saves WHERE user_id = $1 AND recipe_id = $2",
        [userId, recipeId],
      );

      return true;
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async deleteLike(userId, recipeId) {
    try {
      await pool.query(
        "DELETE FROM likes WHERE user_id = $1 AND recipe_id = $2",
        [userId, recipeId],
      );

      return true;
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }
}
