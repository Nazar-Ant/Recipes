import crypto from "crypto";
import fs from "fs";
import UserRepository from "./user.repository.js";
import cloudinary from "cloudinary";

const userRepository = new UserRepository();

export default class UserService {
  async getUserData(userId) {
    const data = await userRepository.getUserData(userId);
    return data;
  }

  async getUserRecipes(userId) {
    const recipes = await userRepository.getUserRecipes(userId);
    return recipes;
  }

  async getUserSavedRecipes(userId) {
    const saved = await userRepository.getUserSavedRecipes(userId);
    return saved;
  }

  async getUser(email, password) {
    const userData = await userRepository.getUser(email);
    const { salt, hash } = userData.password;
    const passwordEntered = this.hashingPassword(password, salt, true);

    if (passwordEntered === hash) {
      return userData.user;
    } else {
      return { error: true, message: "Неправильний пароль" };
    }
  }

  async createUser(name, email, password) {
    const passwordValues = this.hashingPassword(password);
    const user = await userRepository.createUser(
      name,
      email,
      ...passwordValues,
    );

    // const session = this.createSession(user.user_id);
    // await userRepository.saveSession(session, user.user_id);

    return user;
  }

  async createAvatar(fileData) {
    const avatarBuffer = await fileData.toBuffer();
    const userId = fileData.fields.user.value;
    // На сервері створити окрему папку поза src для завантажених файлів
    const path = `${process.env.UPLOADS_PATH}/${userId}.jpg`;

    try {
      await fs.promises.writeFile(path, avatarBuffer);
      const res = await cloudinary.v2.uploader.upload(path, {
        folder: process.env.CLOUDINARY_AVATARS_FOLDER,
        width: 200,
        height: 200,
      });
      const avatarSaved = await userRepository.setAvatar(userId, res.url);
      if (!avatarSaved) throw new Error();

      return res.url;
    } finally {
      await fs.promises.rm(path);
    }
  }

  async setBiography(userId, bigraphy) {
    const res = await userRepository.setBiography(userId, bigraphy);
    return res;
  }

  async deleteUser(userId) {
    const res = await userRepository.deleteUser(userId);
    return res;
  }

  hashingPassword(
    password,
    salt = crypto.randomBytes(16).toString("hex").slice(0, 16),
    returnOnlyPwd = false,
  ) {
    const keys = [process.env.SECRET_KEY, salt];
    let hash = password;

    keys.forEach((key) => {
      hash = crypto.scryptSync(hash, key, 16).toString("hex");
    });

    if (returnOnlyPwd) return hash;
    else return [salt, hash];
  }

  createSession(user) {
    const session = crypto
      .scryptSync(user, process.env.SECRET_KEY, 25)
      .toString("hex");
    return [session, Date.now()].join(".");
  }
}
