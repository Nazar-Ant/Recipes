import { defineStore } from "pinia";

const user = sessionStorage.getItem("user");

const useUserStore = defineStore("userStore", {
  state: () => {
    return {
      data: user ? JSON.parse(user) : null,
      recipes: [],
      saved: [],
    };
  },
});

export default useUserStore;
