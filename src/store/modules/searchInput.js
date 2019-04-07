export default {
  state:{
      rows: 1,
      type: 'text',
  },
  mutations:{
    SWITCH_TO_TEXTAREA(state){
      state.type = 'textarea';
    },
    SWITCH_TO_TEXT(state){
      state.type = 'text';
    },
  },
  actions:{
    switchToTextarea({commit}){
      commit('SWITCH_TO_TEXTAREA');
    },
    switchToText({commit}){
      commit('SWITCH_TO_TEXT');
    }
  }
}