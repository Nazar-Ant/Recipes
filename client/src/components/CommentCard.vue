<template>
  <q-card flat bordered>
    <q-card-section class="row items-center q-gutter-md q-pb-none">
      <author-link
        :author="{
          id: comment.author_id,
          name: comment.name,
          avatar: comment.avatar_url,
        }" />

      <div class="text-body2">
        {{ createdTime() }}
      </div>
    </q-card-section>

    <q-separator class="q-mt-sm" />

    <q-card-section class="text-body2 q-pl-lg">
      {{ comment.content }}
    </q-card-section>
  </q-card>
</template>

<script setup>
import AuthorLink from "./AuthorLink.vue";
import moment from "moment/min/moment-with-locales.js";

const props = defineProps(["comment", "author"]);
const comment = props.comment;
const createdTime = () => {
  if (moment().diff(moment(comment.created_at), "days") < 7) {
    return moment(comment.created_at).fromNow();
  }

  return moment(comment.created_at).format("LLL");
};
</script>
