import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './styles.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Toast, {
  position: 'bottom-center',
  timeout: 2800,
  closeButton: false,
  hideProgressBar: true,
  maxToasts: 1,
  newestOnTop: true,
});
app.mount('#app');
