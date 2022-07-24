<template>
  <q-btn
    flat
    dense
    no-caps
    :icon="'img:' + (author.avatar || '/src/assets/avatar.svg')"
    :label="author.name"
    :to="'/user/' + author.id"
    class="text-primary text-weight-bold" />
</template>

<script setup>
const props = defineProps(["author"]);
</script>
