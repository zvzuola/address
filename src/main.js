import Vue from 'vue';
import ElementUI from 'element-ui';
import 'normalize.css/normalize.css';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/global.scss';
import '@/icons';
import websense from '@/utils/webscene';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(ElementUI);

websense().then(({ sandbox, gs }) => {
  window.sandbox = sandbox;
  window.gs = gs;
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
});