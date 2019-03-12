import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sandbox: null,
    gs: null,
  },
  mutations: {
    UPDATE_SANDBOX(state, sandbox) {
      state.sandbox = sandbox;
    },
    UPDATE_GS(state, gs) {
      state.gs = gs;
    }
  },
  actions: {
    updateSandbox({ commit }, sandbox) {
      commit('UPDATE_SANDBOX', sandbox);
    },

    updateGs({ commit }, gs) {
      commit('UPDATE_GS', gs);
    },
  },
});
