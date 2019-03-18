import axios from 'axios';

const base = "https://www.easy-mock.com/mock/5aa88add8ed9a05f24bed948/example";

export const getAddressList = params =>{return axios.get(`${base}/address`, {params: params}).then( res => res.data );};