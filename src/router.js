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
      name: 'addressSearch',
      redirect: '/search',
      component: Home,
      children: [
        {
          path: '/search',
          name: 'search',
          component: () => import(/* webpackChunkName: "search" */ './views/Home/AddressSearch.vue'),
        },
        {
          path: '/match',
          name: 'match',
          component: () => import(/* webpackChunkName: "search" */ './views/Home/AddressMatch.vue'),
        },
        {
          path: '/extent',
          name: 'extent',
          component: () => import(/* webpackChunkName: "search" */ './views/Home/ExtentSearch.vue'),
        },
        {
          path: '/space-portrait',
          name: 'spacePortrait',
          component: () => import(/* webpackChunkName: "spacePortrait" */ './views/Home/SpacePortrait.vue'),
        },
      ]
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue'),
    },
    
    // {
    //   path: '/spatial-search',
    //   name: 'spatialSearch',
    //   component: () => import(/* webpackChunkName: "spetialSesrch" */ './views/SpatialSearch.vue'),
    // },
    // {
    //   path: '/address-match',
    //   name: 'addressMatch',
    //   component: () => import(/* webpackChunkName: "addressMatch" */ './views/AddressMatch.vue'),
    // },
    
  ],
});
