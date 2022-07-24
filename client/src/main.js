import { createApp } from "vue";
import { createPinia } from "pinia";
import {
  Quasar,
  Cookies,
  LocalStorage,
  SessionStorage,
  Notify,
  Dialog,
} from "quasar";
import quasarLang from "quasar/lang/uk";
import moment from "moment/min/moment-with-locales.js";

import App from "./App.vue";
import router from "./router";

import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/bootstrap-icons/bootstrap-icons.css";
import "quasar/src/css/index.sass";
import "./assets/style.scss";

const pinia = createPinia();
const app = createApp(App);
moment.locale("uk");

app
  .use(Quasar, {
    plugins: { Cookies, LocalStorage, SessionStorage, Notify, Dialog },

    config: {
      notify: {
        position: "bottom-right",
        textClor: "grey-2",
      },
    },

    lang: quasarLang,
  })
  .use(router)
  .use(pinia);

app.mount("#app");
