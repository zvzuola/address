export default {
  namespaced: true,
  state:{
    visible: false,
    data: {},
    totalNum: 0,
    addr:'',    //输入框数据
    extent:'null',  //请求范围
    scale:0,  //请求尺度
  },
  mutations:{
    SET_VISIBLE(state, visible){
      state.visible = visible;
    },
    SET_DATA(state, data){
      state.data = data;
    },
    SET_TOTALNUM(state, totalnum){
      state.totalNum = totalnum;
    },
    SET_ADDR(state, addr){
      state.addr = addr;
    },
    SET_EXTENT(state, extent){
      state.extent = extent;
    },
    SET_SCALE(state, scale){
      state.scale = scale;
    }
  },
  actions:{
    setVisible({commit}, visible){
      commit('SET_VISIBLE', visible);
    },
    setData({commit}, data){
      commit('SET_DATA', data);
    },
    setTotalNum({commit}, totalnum){
      commit('SET_TOTALNUM', totalnum);
    },
    setAddr({commit}, addr){
      commit('SET_ADDR', addr);
    },
    setExtent({commit}, extent){
      commit('SET_EXTENT', extent);
    },
    setScale({commit}, scale){
      commit('SET_SCALE',scale);
    }
  }
}