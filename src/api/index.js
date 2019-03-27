import axios from 'axios';

//const base = "https://www.easy-mock.com/mock/5aa88add8ed9a05f24bed948/example";
const base = 'http://172.16.8.111:8080/addressService'

export const getAddressList = params =>{return axios.get(`${base}/getAddressByQuery`, {params: params}).then( res => res.data );};
//export const getPositionList = params =>{return axios.get(`${base}/spatial_query`, {params: params}).then( res => res.data );};


//坐标查询
export const getNearestAddressByLocation = params =>{return axios.get(`${base}/getAddressByBuffer`, {params:params}).then( res => res.data );};