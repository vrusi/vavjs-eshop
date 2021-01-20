import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueCookies from "vue-cookies";
import Axios from "axios";

const serverUrl = process.env.SERVER_URL || "http://localhost:8000";

const axios = Axios.create({
  baseURL: serverUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

Vue.prototype.$http = axios;
Vue.use(VueCookies);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
