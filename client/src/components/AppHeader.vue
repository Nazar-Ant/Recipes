<template>
  <q-header elevated>
    <q-toolbar class="container" style="padding: 0">
      <q-btn flat to="/" label="Головна" />
      <q-btn flat to="/recipes" label="Всі рецепти" />

      <q-space />

      <q-btn
        v-if="user"
        flat
        rounded
        to="/recipes/create"
        icon="bi-pencil-fill"
        padding="8px" />

      <q-btn
        flat
        rounded
        :to="user ? `/user/${user.user_id}` : '/auth'"
        padding="8px">
        <q-avatar rounded :size="user ? 'sm' : 'md'">
          <img v-if="user" :src="user.avatar_url || '/src/assets/avatar.svg'" />
          <q-icon v-else name="account_circle" />
        </q-avatar>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { storeToRefs } from "pinia";
import useUserStore from "../stores/user.js";

const userStore = useUserStore();
const { data } = storeToRefs(userStore);
const user = data;
</script>
