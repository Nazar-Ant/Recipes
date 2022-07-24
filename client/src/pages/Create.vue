<template>
  <q-page class="q-pt-xl container">
    <p v-if="user === null" class="text-body1 text-weight-bold text-center">
      Зареєструйтесь або увійдіть у свій акаунт, щоб створити рецепт.
    </p>

    <q-card v-else flat bordered>
      <q-card-section class="column q-pb-none">
        <q-form ref="editorHeader" greedy>
          <q-input
            v-model="recipe.title"
            filled
            clearable
            label="Назва"
            :rules="[
              (val) => (val !== null && val.length !== 0) || 'Введіть назву',
              (val) =>
                val.length <= 120 ||
                'Довжина назви не має перевищувати 120 символів',
            ]"
            class="row" />

          <div class="row q-gutter-md">
            <q-input
              filled
              v-model="recipe.cookingTime"
              mask="time"
              :rules="['time']"
              error-message="Введіть коректний час"
              label="Час приготування"
              class="col">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale">
                    <q-time v-model="recipe.cookingTime" flat>
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                          filled />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-select
              filled
              clearable
              v-model="recipe.kitchen"
              :options="kitchens"
              label="Кухня"
              error-message="Оберіть кухню"
              :rules="[(val) => val !== null && val.length !== 0]"
              class="col" />

            <q-select
              filled
              clearable
              v-model="recipe.dish"
              :options="dishes"
              label="Страва"
              error-message="Оберіть страву"
              :rules="[(val) => val !== null && val.length !== 0]"
              class="col" />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <q-editor
          v-model="recipe.content"
          min-height="400px"
          max-height="calc(100vh - 4em)"
          paragraph-tag="p"
          toolbar-color="grey-2"
          toolbar-toggle-color="info"
          toolbar-bg="primary"
          :toolbar="editorToolbar"
          class="recipes-editor" />
      </q-card-section>

      <q-card-actions class="q-pa-md">
        <q-btn
          filled
          label="Створити"
          type="submit"
          color="primary"
          text-color="grey-2"
          padding="sm lg"
          class="q-mt-lg"
          @click="createRecipe" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import { useQuasar } from "quasar";
import { onBeforeRouteLeave } from "vue-router";
import RecipesApi from "../api/recipes.js";
import useUserStore from "../stores/user.js";

const $q = useQuasar();
const editorToolbar = [
  [
    {
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      list: "only-icons",
      options: ["left", "center", "right", "justify"],
    },
  ],
  ["bold", "italic", "strike", "underline"],
  ["hr", "link"],
  [
    {
      label: $q.lang.editor.formatting,
      icon: $q.iconSet.editor.formatting,
      list: "no-icons",
      options: ["h2", "h3", "h4", "h5", "h6", "p"],
    },
    {
      label: $q.lang.editor.fontSize,
      icon: $q.iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: "no-icons",
      options: ["size-2", "size-3", "size-4", "size-5"],
    },
    "removeFormat",
  ],
  ["unordered", "ordered", "outdent", "indent"],

  ["undo", "redo"],
];
const recipesApi = new RecipesApi();
const userStore = useUserStore();

const kitchens = inject("kitchenOptions");
const dishes = inject("dishOptions");

const user = userStore.data;

const recipe = ref({
  title: "",
  cookingTime: "",
  kitchen: "",
  dish: "",
  content: "",
});
const editorHeader = ref(null);

async function recipeIsValid() {
  let valid = await editorHeader.value.validate();

  if (recipe.value.content === "") {
    $q.notify({
      type: "negative",
      message: "Введіть текст рецепту",
    });

    valid = false;
  }

  return valid;
}

async function createRecipe() {
  if (!recipeIsValid()) {
    return;
  }

  const { title, cookingTime, kitchen, dish, content } = recipe.value;

  const recipeResult = await recipesApi.createRecipe({
    title,
    cookingTime,
    kitchen,
    dish,
    content,
    author: user.user_id,
  });

  if (recipeResult.recipe_id) {
    const link = "http://localhost:3000/recipes/" + recipeResult.recipe_id;

    for (const key in recipe.value) {
      recipe.value[key] = "";
    }

    $q.dialog({
      title: "Рецепт успішно створено",
      message: `Ви можете залишитись на сторінці створення рецептів, або перейти за посиланням на свій рецепт: <br/> <a href="${link}">${link}</a>`,
      html: true,
    });
  }
}

onBeforeRouteLeave(async () => {
  if (
    !user ||
    (!recipe.value.title &&
      !recipe.value.cookingTime &&
      !recipe.value.kitchen &&
      !recipe.value.dish &&
      !recipe.value.content)
  ) {
    return true;
  }

  const consent = new Promise((resolve, reject) => {
    $q.dialog({
      title: "Ви дійсно хочете покинути сторінку?",
      message: "Дані рецепту не будуть збережені!",
      cancel: true,
      persistent: true,
    })
      .onOk(() => {
        resolve(true);
      })
      .onCancel(() => {
        resolve(false);
      });
  });

  return await consent;
});
</script>
