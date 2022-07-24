<template>
  <q-card flat bordered class="column col-3 col-grow">
    <q-card-section class="row items-center q-gutter-md q-pb-none card">
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

    <q-card-section class="row q-gutter-md q-py-none">
      <div class="text-grey-6">{{ recipe.kitchen }} кухня</div>
      <div class="text-grey-6">{{ recipe.dish }}</div>
      <div class="text-grey-6">
        <template v-if="cookingTime[0]">{{ cookingTime[0] }} год. </template>
        <template v-if="cookingTime[1]">{{ cookingTime[1] }} хв.</template>
      </div>
    </q-card-section>

    <q-card-actions class="q-px-md">
      <q-btn
        flat
        no-caps
        padding="0"
        :label="recipe.title"
        :to="{
          name: 'recipe',
          params: {
            id: recipe.recipe_id,
            recipe: JSON.stringify(recipe),
          },
        }"
        class="text-h4 text-weight-bold btn-align-left"
        style="text-align: left !important" />
    </q-card-actions>

    <q-space />
    <q-separator />

    <q-card-section class="row items-center q-gutter-md q-py-sm">
      <recipe-footer
        :actions="{ like: true, save: true }"
        :data="{
          likes: recipe.likes,
          views: recipe.views,
          saves: recipe.saves,
          comments: recipe.comments,
        }" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import moment from "moment/min/moment-with-locales.js";
import cookingTimeParser from "../helper/timeParser.js";
import RecipeFooter from "./RecipeFooter.vue";
import AuthorLink from "./AuthorLink.vue";

const props = defineProps(["recipe"]);
const recipe = props.recipe;
const cookingTime = cookingTimeParser(recipe.cooking_time);
const createdTime = moment(recipe.created_at).format("LL");
</script>
