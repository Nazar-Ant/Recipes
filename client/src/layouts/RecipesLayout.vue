<template>
  <q-layout>
    <app-header></app-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = selectOpen ? false : true"
      bordered
      overlay>
      <q-scroll-area class="fit">
        <q-list>
          <q-item style="min-height: 56px">
            <q-item-section avatar>
              <q-icon name="search" />
            </q-item-section>

            <q-item-section>
              <q-input
                v-model="search.title"
                filled
                clearable
                dense
                hide-bottom-space
                label="Назва" />
            </q-item-section>
          </q-item>

          <q-item style="min-height: 56px">
            <q-item-section avatar>
              <q-icon name="soup_kitchen" />
            </q-item-section>

            <q-item-section>
              <q-select
                filled
                clearable
                dense
                v-model="search.kitchen"
                :options="kitchens"
                label="Кухня"
                @popup-show="selectOpen = true"
                @popup-hide="selectOpen = false" />
            </q-item-section>
          </q-item>

          <q-item style="min-height: 56px">
            <q-item-section avatar>
              <q-icon name="food_bank" />
            </q-item-section>

            <q-item-section>
              <q-select
                filled
                clearable
                dense
                v-model="search.dish"
                :options="dishes"
                label="Страва"
                @popup-show="selectOpen = true"
                @popup-hide="selectOpen = false" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar> </q-item-section>

            <q-item-section>
              <q-btn
                color="primary"
                label="Шукати"
                @click="Object.assign(query, search)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view :query="query"></router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { inject, ref, watch } from "vue";
import AppHeader from "../components/AppHeader.vue";

const drawer = ref(false);
const miniState = ref(true);
const selectOpen = ref(false);
const kitchens = inject("kitchenOptions");
const dishes = inject("dishOptions");

const search = ref({
  title: "",
  kitchen: "",
  dish: "",
});
const query = ref({
  title: "",
  kitchen: "",
  dish: "",
});
</script>
