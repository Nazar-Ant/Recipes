import pool from "../../db/index.js";

export default class UserRepository {
  async getUserData(userId) {
    try {
      const data = await pool.query(
        "SELECT user_id, name, avatar_url, biography, created_at FROM users WHERE user_id = $1",
        [userId],
      );

      return data.rows[0];
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async getUserRecipes(userId) {
    try {
      const recipes = await pool.query(
        `SELECT recipes.*, users.name, users.avatar_url,
        (SELECT COUNT(likes) AS likes FROM likes WHERE likes.recipe_id = recipes.recipe_id),
        (SELECT COUNT(views) AS views FROM views WHERE views.recipe_id = recipes.recipe_id),
        (SELECT COUNT(saves) AS saves FROM saves WHERE saves.recipe_id = recipes.recipe_id),
        (SELECT COUNT(comments) AS comments FROM comments WHERE comments.recipe_id = recipes.recipe_id)
        FROM recipes
        JOIN users ON users.user_id = recipes.author_id
        WHERE author_id = $1`,
        [userId],
      );

      return recipes.rows;
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async getUserSavedRecipes(userId) {
    try {
      const saved = await pool.query(
        `SELECT saves.recipe_id, recipes.*, users.name, users.avatar_url,
        (SELECT COUNT(likes) AS likes FROM likes WHERE likes.recipe_id = recipes.recipe_id),
        (SELECT COUNT(views) AS views FROM views WHERE views.recipe_id = recipes.recipe_id),
        (SELECT COUNT(saves) AS saves FROM saves WHERE saves.recipe_id = recipes.recipe_id),
        (SELECT COUNT(comments) AS comments FROM comments WHERE comments.recipe_id = recipes.recipe_id)
        FROM saves
        JOIN recipes ON recipes.recipe_id = saves.recipe_id
        JOIN users ON users.user_id = recipes.author_id
        WHERE saves.user_id = $1`,
        [userId],
      );

      return saved.rows;
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async getUser(email) {
    try {
      const user = await pool.query(
        "SELECT user_id, name, avatar_url, biography, created_at FROM users WHERE email = $1",
        [email],
      );

      const credentials = await pool.query(
        "SELECT salt, hash FROM users_passwords WHERE user_id = $1",
        [user.rows[0].user_id],
      );

      return {
        user: user.rows[0],
        password: credentials.rows[0],
      };
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async createUser(name, email, salt, hash) {
    try {
      const user = await pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING user_id, name, biography, avatar_url, created_at",
        [name, email],
      );
      const userData = user.rows[0];

      this.saveUserPasswordHash(userData.user_id, salt, hash);
      return userData;
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async setAvatar(userId, avatarUrl) {
    try {
      await pool.query("UPDATE users SET avatar_url = $2 WHERE user_id = $1", [
        userId,
        avatarUrl,
      ]);
      return true;
    } catch {
      return false;
    }
  }

  async setBiography(userId, bigraphy) {
    try {
      await pool.query("UPDATE users SET biography = $2 WHERE user_id = $1", [
        userId,
        bigraphy,
      ]);
      return true;
    } catch (err) {
      return err;
    }
  }

  async deleteUser(userId) {
    try {
      const res = await pool.query("DELETE FROM users WHERE user_id = $1", [
        userId,
      ]);

      return res;
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }

  async saveUserPasswordHash(id, salt, hash) {
    // await this.connectToDatabase();

    try {
      await pool.query(
        "INSERT INTO users_passwords (user_id, salt, hash) VALUES ($1, $2, $3)",
        [id, salt, hash],
      );
    } catch (err) {
      return err.code;
    }
  }

  async saveSession(session, user) {
    // await this.connectToDatabase();

    try {
      await pool.query(
        "INSERT INTO sessions (session_id, user_id) VALUES ($1, $2)",
        [session, user],
      );
    } catch (err) {
      return err.code;
    }
  }
}
