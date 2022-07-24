<template>
  <q-page class="q-pt-xl column">
    <q-card
      flat
      bordered
      class="q-pa-xl"
      style="width: min(400px, 90%); margin: 0 auto">
      <q-form autofocus greedy ref="form">
        <q-btn-toggle
          spread
          unelevated
          v-model="formData.mode"
          toggle-color="primary"
          color="grey-3"
          text-color="dark"
          :options="[
            { label: 'Вхід', value: 'sign-in' },
            { label: 'Реєстрація', value: 'sign-up' },
          ]"
          class="q-mb-lg" />

        <q-input
          type="email"
          :rules="['email']"
          error-message="Введіть коректний адрес скриньки"
          label="Електронна скринька"
          v-model="formData.email">
          <template v-slot:prepend>
            <q-icon name="alternate_email" color="primary" />
          </template>
        </q-input>

        <q-input
          v-if="formData.mode === 'sign-up'"
          :rules="[(val) => val.length >= 2]"
          error-message="Введіть ім'я (мінімум 2 символи)"
          label="Ім'я"
          v-model="formData.name">
          <template v-slot:prepend>
            <q-icon name="drive_file_rename_outline" color="primary" />
          </template>
        </q-input>

        <q-input
          counter
          type="password"
          :rules="[(val) => val.length >= 8]"
          error-message="Пароль має містити мінімум 8 символів"
          label="Пароль"
          v-model="formData.password">
          <template v-slot:prepend>
            <q-icon name="password" color="primary" />
          </template>
        </q-input>

        <q-input
          v-if="formData.mode === 'sign-up'"
          counter
          type="password"
          :rules="[(val) => val === formData.password]"
          v-model="formData.repeatPassword"
          error-message="Паролі не співпадають"
          label="Повторний пароль">
          <template v-slot:prepend>
            <q-icon name="password" color="primary" />
          </template>
        </q-input>

        <q-field
          v-if="formData.mode === 'sign-up'"
          borderless
          dense
          v-model="formData.policy"
          :rules="[(val) => val === true && formData.mode === 'sign-up']"
          class="q-pa-none q-mt-sm">
          <template v-slot:control>
            <q-checkbox v-model="formData.policy" color="primary" keep-color>
              Погоджуюсь з Угодою користувача
            </q-checkbox>
          </template>
        </q-field>

        <q-btn
          unelevated
          padding="sm xl"
          color="primary"
          :label="formData.mode === 'sign-in' ? 'Увійти' : 'Зареєструватися'"
          class="q-mt-md"
          style="width: 100%"
          @click="submitAuthForm" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { inject, ref } from "vue";
import { useQuasar, QSpinnerClock } from "quasar";
import { useRouter } from "vue-router";
import useUserStore from "../stores/user.js";
import UserApi from "../api/user.js";

const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();
const userApi = new UserApi();
const errorCodes = inject("errorCodes");
const user = userStore.data;

const formData = ref({
  mode: "sign-in",
  name: "",
  email: "",
  password: "",
  repeatPassword: "",
  policy: false,
});
const form = ref(null);

if (user) {
  router.replace(`/user/${user.user_id}`);
}

function rememberUser(user) {
  userStore.data = user;
  sessionStorage.setItem("user", JSON.stringify(user));
}

async function submitAuthForm() {
  const formIsValid = await form.value.validate();

  if (!formIsValid) {
    $q.notify({
      type: "negative",
      message: "Ви ввели некоректні дані",
    });

    return;
  }

  const dialog = $q.dialog({
    title: formData.value.mode === "sign-in" ? "Вхід..." : "Реєстрація...",
    progress: {
      spinner: QSpinnerClock,
      color: "primary",
    },
    persistent: true,
    ok: false,
  });

  if (formData.value.mode === "sign-up") {
    userApi
      .signUp(
        formData.value.name,
        formData.value.email,
        formData.value.password,
      )
      .then((data) => {
        if (data.error) {
          dialog.update({
            title: "Помилка",
            message: errorCodes.get(data.message) || data.message,
            persistent: false,
            progress: false,
            ok: true,
          });
          return;
        }

        rememberUser(data);
        dialog.hide();
        router.replace(`/user/${data.user_id}`);
      });
  }

  if (formData.value.mode === "sign-in") {
    userApi
      .signIn(formData.value.email, formData.value.password)
      .then((data) => {
        if (data.error) {
          dialog.update({
            title: "Помилка",
            message: errorCodes.get(data.message) || data.message,
            persistent: false,
            progress: false,
            ok: true,
          });

          return;
        }

        rememberUser(data);
        dialog.hide();
        router.replace(`/user/${data.user_id}`);
      });
  }
}
</script>
