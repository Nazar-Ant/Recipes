export default [
  {
    path: "/",
    component: () => import("../layouts/Basic.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/Home.vue"),
      },
    ],
  },

  {
    path: "/recipes",
    component: () => import("../layouts/RecipesLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/Recipes.vue"),
        props: true,
      },
    ],
  },

  {
    path: "/recipes",
    component: () => import("../layouts/Basic.vue"),
    children: [
      {
        path: "create",
        component: () => import("../pages/Create.vue"),
      },
      {
        path: ":id",
        name: "recipe",
        props: true,
        component: () => import("../pages/Recipe.vue"),
      },
    ],
  },

  {
    path: "/auth",
    component: () => import("../layouts/Empty.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/Auth.vue"),
      },
    ],
  },

  {
    path: "/user/:id",
    component: () => import("../layouts/Basic.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/User.vue"),
      },
    ],
  },
];
