import { Dialog, QSpinnerClock } from "quasar";

export default function createProgressDialog() {
  return Dialog.create({
    progress: {
      spinner: QSpinnerClock,
      color: "primary",
    },
    persistent: true,
    ok: false,
  });
}
