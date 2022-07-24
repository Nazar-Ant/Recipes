<template>
  <q-page v-if="recipe" class="q-pt-xl container">
    <q-card flat bordered>
      <q-card-section class="row items-center q-gutter-lg q-pb-none">
        <author-link
          :author="{
            id: recipe.author_id,
            name: recipe.name,
            avatar: recipe.avatar_url,
          }" />

        <div class="text-weight-bold">
          {{ createdTime }}
        </div>
      </q-card-section>

      <q-card-section class="text-h1 text-weight-bold q-pt-none q-pb-sm">
        {{ recipe.title }}
      </q-card-section>

      <q-card-section class="row q-gutter-md q-py-none">
        <div class="text-grey-6">{{ recipe.kitchen }} кухня</div>
        <div class="text-grey-6">{{ recipe.dish }}</div>
        <div class="text-grey-6">
          <template v-if="cookingTime[0]">{{ cookingTime[0] }} год. </template>
          <template v-if="cookingTime[1]">{{ cookingTime[1] }} хв.</template>
        </div>
      </q-card-section>

      <q-card-section
        v-html="recipe.content"
        class="q-py-none"></q-card-section>

      <q-separator class="q-mt-lg" />

      <q-card-section class="row items-center q-gutter-md">
        <recipe-footer
          :share="true"
          :clickable="true"
          :actions="userActions"
          :data="{
            likes: recipe.likes,
            views: recipe.views,
            saves: recipe.saves,
            comments: recipe.comments,
          }"
          :user-id="user?.user_id"
          :recipe-id="recipeId"
          @like="(state) => (recipe.likes = +recipe.likes + state)"
          @save="(state) => (recipe.saves = +recipe.saves + state)" />
      </q-card-section>
    </q-card>

    <comment-section
      :recipe-id="recipeId"
      :amount-of-comments="recipe.comments"
      class="q-mt-lg" />

    <comment-form
      :user-id="user?.user_id"
      :recipe-id="recipeId"
      class="q-mt-lg" />
  </q-page>

  <div
    v-else
    class="text-center text-h3 text-weight-bold text-negative q-mt-lg">
    Рецепту не існує
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useQuasar, QSpinnerClock, LocalStorage } from "quasar";
import useUserStore from "../stores/user.js";
import RecipesApi from "../api/recipes.js";
import cookingTimeParser from "../helper/timeParser.js";
import CommentSection from "../components/CommentsSection.vue";
import CommentForm from "../components/CommentForm.vue";
import RecipeFooter from "../components/RecipeFooter.vue";
import AuthorLink from "../components/AuthorLink.vue";
import moment from "moment/min/moment-with-locales.js";

const $q = useQuasar();
const userStore = useUserStore();
const props = defineProps(["id", "recipe"]);
const recipesApi = new RecipesApi();

const user = userStore.data;
const userActions = ref({});

const recipeId = useRoute().params.id;
const recipe = ref(null);
const cookingTime = computed(() => {
  return cookingTimeParser(recipe.value?.cooking_time);
});
const createdTime = computed(() => {
  return moment(recipe.value?.created_at).format("LL");
});

// get recipe on page open
(async () => {
  const dialog = $q.dialog({
    progress: {
      spinner: QSpinnerClock,
      color: "primary",
    },
    persistent: true,
    ok: false,
  });

  if (props.recipe) {
    recipe.value = JSON.parse(props.recipe);
    recipe.value.content = await recipesApi.getRecipeContent(props.id);
  } else {
    recipe.value = await recipesApi.getRecipe(recipeId);
  }

  if (user) {
    userActions.value = await recipesApi.getUserActions({
      user: user.user_id,
      recipe: recipe.value.recipe_id,
    });

    await recipesApi.addView({
      user: user.user_id,
      recipe: recipe.value?.recipe_id,
    });
  }

  dialog.hide();
})();
</script>
