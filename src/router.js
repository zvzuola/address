import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/spatial-search',
      name: 'spatialSearch',
      component: () => import(/* webpackChunkName: "spetialSesrch" */ './views/SpatialSearch.vue'),
    },
    {
      path: '/address-match',
      name: 'addressMatch',
      component: () => import(/* webpackChunkName: "spetialSesrch" */ './views/AddressMatch.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "spetialSesrch" */ './views/Dashboard.vue'),
    },
  ],
});
