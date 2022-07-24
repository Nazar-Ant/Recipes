<template>
  <div
    v-if="requestedUser === undefined"
    class="text-center text-h3 text-weight-bold text-negative q-mt-lg">
    Користувач не існує
  </div>

  <q-drawer v-if="requestedUser" show-if-above :width="300" elevated>
    <q-scroll-area class="fit q-pa-md">
      <q-tabs v-model="page" vertical inline-label dense align="left">
        <q-tab
          name="user"
          :icon="
            'img:' + (requestedUser.avatar_url || '../src/assets/avatar.svg')
          "
          :label="requestedUser.name"
          class="text-primary"
          style="justify-content: flex-start; padding-left: 40px" />

        <template v-for="option in userOptions" :key="option.page">
          <q-tab
            v-if="
              option.userIsOwner === true || option.userIsOwner === undefined
            "
            :name="option.name"
            :icon="option.icon"
            :label="option.label"
            padding="md"
            class="text-primary"
            style="justify-content: flex-start; padding-left: 40px" />
        </template>
      </q-tabs>
    </q-scroll-area>
  </q-drawer>

  <q-tab-panels v-if="requestedUser" v-model="page" animated vertical>
    <q-tab-panel name="user">
      <author-link
        :author="{
          id: requestedUser.user_id,
          name: requestedUser.name,
          avatar: requestedUser.avatar_url,
        }"></author-link>

      <q-input
        outlined
        readonly
        label="Про себе"
        v-model="requestedUser.biography"
        class="q-mt-md" />
    </q-tab-panel>

    <q-tab-panel name="recipes">
      <div class="text-h4 q-mb-md">
        Рецепти
        <q-btn
          flat
          dense
          color="primary"
          icon="refresh"
          @click="getRecipes(true)" />
      </div>

      <p v-if="userRecipes.length === 0">
        {{ requestedUser.name }} не має власних рецептів
      </p>

      <recipe-cards-wrapper v-else>
        <recipe-card
          v-for="recipe in userRecipes"
          :key="recipe.recipe_id"
          :recipe="recipe" />
      </recipe-cards-wrapper>
    </q-tab-panel>

    <q-tab-panel
      name="saved"
      v-if="authorizedUser?.user_id === route.params.id">
      <div class="text-h4 q-mb-md">
        Збережені рецепти
        <q-btn
          flat
          dense
          color="primary"
          icon="refresh"
          @click="getSavedRecipes(true)" />
      </div>

      <p v-if="userSaved.length === 0">Ви не зберегли жодного рецепту</p>

      <recipe-cards-wrapper v-else>
        <recipe-card
          v-for="recipe in userSaved"
          :key="recipe.recipe_id"
          :recipe="recipe" />
      </recipe-cards-wrapper>
    </q-tab-panel>

    <q-tab-panel
      name="manage"
      v-if="authorizedUser?.user_id === route.params.id">
      <div class="text-h4 q-mb-lg">Оновити дані</div>

      <div class="q-my-lg">
        <q-uploader
          accept=".jpg"
          label="Фото"
          url="http://localhost:4000/user/avatar"
          method="POST"
          field-name="avatar"
          :form-fields="[{ name: 'user', value: requestedUser.user_id }]"
          @uploaded="(res) => setUserAvatar(res.xhr.response)"
          @failed="
            () =>
              $q.notify({
                type: 'negative',
                message: 'Не вдалося завантажити фото',
              })
          " />

        <div class="q-gutter-sm q-mt-lg">
          <q-input v-model="userBiography" outlined label="Про себе" autogrow />
          <q-btn
            elevated
            color="primary"
            text-color="grey-2"
            label="Змінити опис"
            @click="setUserBiography" />
        </div>
      </div>

      <div class="text-h4 q-my-lg">Дії з профілем:</div>
      <div class="row q-gutter-xl">
        <q-btn
          icon="logout"
          label="Вийти"
          elevated
          color="primary"
          text-color="grey-2"
          @click="signOut" />

        <q-btn
          icon="delete_forever"
          label="Видалити"
          elevated
          color="negative"
          text-color="grey-2"
          @click="deleteCurrentUser" />
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import useUserStore from "../stores/user.js";
import RecipeCardsWrapper from "../components/RecipeCardsWrapper.vue";
import RecipeCard from "../components/RecipeCard.vue";
import createProgressDialog from "../helper/createProgressDialog.js";
import UserApi from "../api/user.js";
import AuthorLink from "../components/AuthorLink.vue";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const userApi = new UserApi();

const authorizedUser = userStore.data;
const userIsOwner = authorizedUser?.user_id === route.params.id;
const requestedUser = ref(userIsOwner ? authorizedUser : null);

const userRecipes = ref(userStore.recipes);
const userSaved = ref(userStore.saved);
const userOptions = computed(() => {
  return [
    {
      label: "Рецепти",
      icon: "bi-journal-text",
      name: "recipes",
    },
    {
      label: "Збережене",
      icon: "bi-bookmarks-fill",
      userIsOwner: userIsOwner,
      name: "saved",
    },
    {
      label: "Керування",
      icon: "manage_accounts",
      userIsOwner: userIsOwner,
      name: "manage",
    },
  ];
});
const page = ref("user");
const userBiography = ref(requestedUser.value.biography);

function getRecipes(force = false) {
  if (userStore.recipes.length && !force) return;
  const dialog = createProgressDialog();

  userApi
    .getRecipes(route.params.id)
    .then((recipes) => {
      if (userIsOwner || force) {
        userStore.recipes = recipes;
      }

      userRecipes.value = recipes;
    })
    .finally(() => {
      dialog.hide();
    });
}

function getSavedRecipes(force = false) {
  if (userStore.saved.length && !force) return;
  const dialog = createProgressDialog();

  userApi
    .getSavedRecipes(route.params.id)
    .then((recipes) => {
      if (userIsOwner || force) {
        userStore.saved = recipes;
      }

      userSaved.value = recipes;
    })
    .finally(() => {
      dialog.hide();
    });
}

// get user on page open
(() => {
  if (requestedUser.value) return;

  const dialog = createProgressDialog();

  userApi
    .getData(route.params.id)
    .then((data) => {
      requestedUser.value = data;
    })
    .finally(() => {
      dialog.hide();
    });
})();

function setUserBiography() {
  userApi
    .setBiography(requestedUser.value.user_id, userBiography.value)
    .then((res) => {
      if (res) {
        $q.notify({
          type: "positive",
          message: "Опис успішно змінено!",
        });

        authorizedUser.biography = userBiography.value;
      }
    });
}

function setUserAvatar(url) {
  userStore.data.avatar_url = url;
  sessionStorage.setItem("user", JSON.stringify(userStore.data));
}

function signOut() {
  userStore.data = null;
  userStore.recipes = userStore.saved = [];
  sessionStorage.removeItem("user");
  router.replace("/");
}

function deleteCurrentUser() {
  const dialog = $q.dialog({
    title: `Ви дійсно хочете видалити користувача ${requestedUser.value.name}?`,
    message:
      "Ваші дані (персональна інформація, лайки, коментарі) будуть назавжди видалені! Залишуться лише рецепти.",
    cancel: true,
    persistent: true,
  });

  dialog.onOk(() => {
    userApi.deleteUser(route.params.id).then(() => {
      signOut();
    });
  });
}

watch(page, (newPage) => {
  switch (newPage) {
    case "recipes":
      getRecipes();
      break;

    case "saved":
      getSavedRecipes();
      break;
  }
});
</script>
