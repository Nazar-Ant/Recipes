<template>
  <q-chip
    square
    :clickable="clickable"
    :ripple="false"
    size="md"
    :icon="actions?.like ? 'bi-heart-fill' : 'bi-heart'"
    :label="data?.likes"
    color="white"
    text-color="primary"
    class="text-weight-bold"
    :class="{ 'q-pa-none': !clickable }"
    @click="likeRecipe">
  </q-chip>

  <q-chip
    :ripple="false"
    size="md"
    icon="bi-eye-fill"
    :label="data?.views"
    color="white"
    text-color="primary"
    class="text-weight-bold q-pa-none">
  </q-chip>

  <q-chip
    square
    :clickable="clickable"
    :ripple="false"
    :icon="actions?.save ? 'bi-bookmark-fill' : 'bi-bookmark'"
    :label="data?.saves"
    color="white"
    text-color="primary"
    class="text-weight-bold"
    :class="{ 'q-pa-none': !clickable }"
    @click="saveRecipe">
  </q-chip>

  <q-chip
    :ripple="false"
    size="md"
    icon="bi-chat-text-fill"
    :label="data?.comments"
    color="white"
    text-color="primary"
    class="text-weight-bold q-pa-none">
  </q-chip>

  <q-chip
    v-if="share"
    square
    clickable
    size="md"
    icon="bi-share-fill"
    color="white"
    text-color="primary"
    class="q-pa-none">
  </q-chip>
</template>

<script setup>
import { useQuasar } from "quasar";
import { computed } from "vue";
import RecipesApi from "../api/recipes.js";

const props = defineProps([
  "userId",
  "recipeId",
  "actions",
  "data",
  "share",
  "clickable",
]);
const emits = defineEmits(["like", "save"]);

const $q = useQuasar();
const api = new RecipesApi();
const actions = computed(() => props.actions);

function saveRecipe() {
  if (props.userId === undefined) {
    $q.notify({
      type: "negative",
      message: "Авторизуйтесь, щоб зберегти рецепт",
    });
    return;
  }

  api
    .saveRecipe(actions.value.save, {
      user: props.userId,
      recipe: props.recipeId,
    })
    .then((res) => {
      if (res) {
        actions.value.save = !actions.value.save;
        emits("save", actions.value.save ? 1 : -1);
      }
    });
}

function likeRecipe() {
  if (props.userId === undefined) {
    $q.notify({
      type: "negative",
      message: "Авторизуйтесь, щоб лайкнути рецепт",
    });
    return;
  }

  api
    .likeRecipe(actions.value.like, {
      user: props.userId,
      recipe: props.recipeId,
    })
    .then((res) => {
      if (res) {
        actions.value.like = !actions.value.like;
        emits("like", actions.value.like ? 1 : -1);
      }
    });
}
</script>
