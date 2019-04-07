import {SEARCH_STATUS} from '@/const'

export default {
  state:{
    status: SEARCH_STATUS.SEARCH,
    icon: 'el-icon-search',
  },
  mutations:{
    SWITCH_TO_SEARCH(state){
      state.status = SEARCH_STATUS.SEARCH;
    },
    SWITCH_TO_EXTENT(state){
      state.status = SEARCH_STATUS.EXTENT;
    },
    SWITCH_TO_MATCH(state){
      state.status = SEARCH_STATUS.MATCH;
    },
    SET_ICON_LOADING(state, isloading){
      if(isloading){
        state.icon = 'el-icon-loading';
      }else{
        state.icon = 'el-icon-search';
      }
    }
  },
  actions:{
    switchToSearch({commit}){
      commit('SWITCH_TO_SEARCH');
    },
    switchToExtent({commit}){
      commit('SWITCH_TO_EXTENT');
    },
    switchToMatch({commit}){
      commit('SWITCH_TO_MATCH');
    },
    setSearchIconLoading({commit}, isloading){
      commit('SET_ICON_LOADING', isloading);
    }
  }
}