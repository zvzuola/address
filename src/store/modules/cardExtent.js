export default {
  namespaced: true,
  state:{
    visible: false,
  },
  mutations:{
    SET_VISIBLE(state, visible){
      state.visible = visible;
    }
  },
  actions:{
    setVisible({commit}, visible){
      commit('SET_VISIBLE', visible);
    }
  }
}