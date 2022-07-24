<template>
  <q-layout>
    <app-header></app-header>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppHeader from "../components/AppHeader.vue";
</script>
