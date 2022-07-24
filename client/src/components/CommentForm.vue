<template>
  <q-card flat bordered class="q-mt-lg">
    <q-form greedy ref="form">
      <q-card-section class="q-pb-none">
        <q-input
          v-model="userComment"
          filled
          autogrow
          counter
          label="Ваш коментар"
          :rules="[
            (val) => (val !== null && val.length > 0) || 'Напишіть що-небудь',
            (val) =>
              val.length <= 300 || 'Кількість символів не має перевищувати 300',
          ]" />
      </q-card-section>

      <q-card-actions class="q-pa-md">
        <q-btn
          color="primary"
          padding="sm lg"
          label="Відправити"
          @click="addComment" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import RecipesApi from "../api/recipes.js";

const $q = useQuasar();
const props = defineProps(["userId", "recipeId"]);
const api = new RecipesApi();
const userComment = ref("");

function addComment() {
  if (!props.userId) {
    $q.notify({
      type: "negative",
      message: "Авторизуйтесь, щоб коментувати рецепт",
    });
    return;
  }

  api
    .addComment({
      user: props.userId,
      recipe: props.recipeId,
      text: userComment.value,
    })
    .then(() => {
      userComment.value = "";
    });
}
</script>
