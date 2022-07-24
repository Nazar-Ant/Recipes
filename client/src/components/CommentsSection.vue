<template>
  <q-card flat bordered :class="{ 'q-pb-xl': comments.length }">
    <q-card-section class="text-subtitle1 text-weight-bold">
      Коментарі
    </q-card-section>

    <q-card-section class="column q-gutter-md q-py-none text-body1">
      <p v-if="amountOfComments === '0'">
        Тут поки що нічого немає. Ви можете стати першими!
      </p>

      <comment-card
        v-for="comment in comments"
        :key="comment.created_at"
        :comment="comment" />
    </q-card-section>

    <q-card-actions class="absolute-bottom-right">
      <q-btn flat dense color="primary" icon="refresh" @click="getComments" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import CommentCard from "./CommentCard.vue";
import RecipesApi from "../api/recipes.js";

const props = defineProps(["recipeId", "amountOfComments"]);
const api = new RecipesApi();
const comments = ref([]);

function getComments() {
  api.getComments(props.recipeId).then((data) => {
    comments.value = data;
  });
}
</script>
