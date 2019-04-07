import axios from 'axios';
import qs from 'qs';

// const base = "https://www.easy-mock.com/mock/5aa88add8ed9a05f24bed948/example";
//  const base = 'http://192.168.43.95:8080/addressService'
const base = 'http://122.224.129.162:11172/addressServer/addressService'

export const getAddressList = params =>{return axios.get(`${base}/address`, {params: params}).then( res => res.data );};
//export const getPositionList = params =>{return axios.get(`${base}/spatial_query`, {params: params}).then( res => res.data );};
export const getAddressMatchList = params =>{return axios.get(`${base}/addressmatch`, {params: params}).then( res => res.data );};
export const getAddressQuery = params =>{return axios.get(`${base}/addressQuery`, {params: params}).then( res => res.data );};


//坐标查询
export const getNearestAddressByLocation = params =>{return axios.get(`${base}/getAddressByBuffer`, {params:params}).then( res => res.data );};