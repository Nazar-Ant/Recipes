import pool from "../../db/index.js";

export default class EnumsRepository {
  async getEnums() {
    try {
      const kitchen = await pool.query(
        "SELECT unnest(enum_range(NULL::kitchen))::text",
      );
      const dish = await pool.query(
        "SELECT unnest(enum_range(NULL::dish))::text",
      );

      return { kitchens: kitchen.rows, dishes: dish.rows };
    } catch (err) {
      return {
        error: true,
        message: err.code,
      };
    }
  }
}
