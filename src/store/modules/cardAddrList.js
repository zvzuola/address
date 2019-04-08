export default {
  namespaced: true,
  state:{
    visible: false,
    data: {},
    totalNum: 0,
    requestParam:{
      wd:'',
      extent:'null',
      curPage: 1,
      pageSize: 10,
    }
  },
  mutations:{
    SET_VISIBLE(state, visible){
      state.visible = visible;
    },
    SET_DATA(state, data){
      state.data = data;
    }
  },
  actions:{
    setVisible({commit}, visible){
      commit('SET_VISIBLE', visible);
    },
    setData({commit}, data){
      commit('SET_DATA', data);
    }
  }
}