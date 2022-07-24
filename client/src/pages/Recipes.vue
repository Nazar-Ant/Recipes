<template>
  <q-page class="container">
    <recipe-cards-wrapper class="q-mt-xl">
      <recipe-card
        v-for="recipe in recipes"
        :key="recipe.recipe_id"
        :recipe="recipe" />
    </recipe-cards-wrapper>

    <q-btn
      v-if="recipes.length === offset"
      no-caps
      color="primary"
      label="Завантажити ще"
      style="display: block; margin: 20px auto 0"
      @click="getRecipes" />
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import RecipeCardsWrapper from "../components/RecipeCardsWrapper.vue";
import RecipeCard from "../components/RecipeCard.vue";
import RecipesApi from "../api/recipes";
import createProgressDialog from "../helper/createProgressDialog.js";

const props = defineProps(["query"]);
const api = new RecipesApi();

const recipes = ref([]);
const limit = 50;
const offset = ref(0);

watch(props.query, () => {
  getRecipes(true);
});

// get recipe on page open
getRecipes();

function getRecipes(clear = false) {
  const dialog = createProgressDialog();

  if (clear) {
    offset.value = 0;
  }

  api
    .getRecipes(limit, offset.value, props.query)
    .then((data) => {
      recipes.value = clear ? data : recipes.value.concat(data);
    })
    .finally(() => {
      dialog.hide();
      if (recipes.value.length === offset.value) {
        offset.value += limit;
      }
    });
}
</script>
