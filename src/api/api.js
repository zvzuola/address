import axios from 'axios';

// const baseUrl = 'http://172.18.22.83:3000';
const baseUrl = 'http://127.0.0.1:3000';

export function getGeojson(polygon, level) {
  return axios
    .get(`${baseUrl}/api/geojson/kjcx`, {
      params: {
        extent: `${JSON.stringify(polygon.geometry)}`,
        level
      }
    })
    .then(res => res.data);
}
