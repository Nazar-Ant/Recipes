export default class UserApi {
  async signIn(email, password) {
    try {
      const res = await fetch(
        `http://localhost:4000/user/sign-in/${email}-${password}`,
        {
          credentials: "same-origin",
        },
      );
      return res.json();
    } catch (err) {
      return err;
    }
  }

  async getData(id) {
    try {
      const res = await fetch(`http://localhost:4000/user/${id}`);
      return res.json();
    } catch (err) {
      return err;
    }
  }

  async getRecipes(id) {
    try {
      const res = await fetch(`http://localhost:4000/user/${id}/recipes`);
      return res.json();
    } catch (err) {
      return err;
    }
  }

  async getSavedRecipes(id) {
    try {
      const res = await fetch(`http://localhost:4000/user/${id}/saved`);
      return res.json();
    } catch (err) {
      return err;
    }
  }

  async signUp(name, email, password) {
    try {
      const res = await fetch("http://localhost:4000/user/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
        credentials: "same-origin",
      });

      return res.json();
    } catch (err) {
      return err;
    }
  }

  async setBiography(id, biography) {
    try {
      const res = await fetch("http://localhost:4000/user/biography", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: id, biography }),
      });

      return res.json();
    } catch (err) {
      return err;
    }
  }

  async deleteUser(id) {
    try {
      const res = await fetch(`http://localhost:4000/user/${id}`, {
        method: "DELETE",
      });
      return res.json();
    } catch (err) {
      return err;
    }
  }
}
