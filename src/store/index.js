import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import searchInput from './modules/searchInput';
import searchBtn from './modules/searchBtn';
import cardResult from './modules/cardResult';
import cardAddrList from './modules/cardAddrList';
import cardAddrDetails from './modules/cardAddrDetails';
import cardExtent from './modules/cardExtent';
import cardMatchList from './modules/cardMatchList';

export default new Vuex.Store({
  modules: {
    searchInput: searchInput,
    searchBtn: searchBtn,
    cardResult: cardResult,
    cardAddrList: cardAddrList,
    cardAddrDetails: cardAddrDetails,
    cardExtent: cardExtent,
    cardMatchList: cardMatchList,
  }

});
