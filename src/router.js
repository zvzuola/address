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
      path: '/spatial-search',
      name: 'spatialSearch',
      component: () => import(/* webpackChunkName: "spetialSesrch" */ './views/SpatialSearch.vue'),
    },
    {
      path: '/address-match',
      name: 'addressMatch',
      component: () => import(/* webpackChunkName: "addressMatch" */ './views/AddressMatch.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue'),
    },
    {
      path: '/space-portrait',
      name: 'spacePortrait',
      component: () => import(/* webpackChunkName: "spacePortrait" */ './views/SpacePortrait.vue'),
    },
  ],
});
