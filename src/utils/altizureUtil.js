import axios from 'axios';
import * as turf from '@turf/turf';

axios.defaults.withCredentials = true;

export function addProjects(sandbox, pList) {
  const tList = pList.map((project) => sandbox
    .add('AltizureProjectMarker', { pid: project.pid })
    .then((marker) => {
      project.marker = marker;
      marker.dim(); // hide the blue square around the marker
      return marker.initialized;
    })
    .catch((err) => {
      console.error(err);
      return `ERROR:${err}`;
    }));

  return tList;
}

// 如果point、polygon按wgs84坐标直接导入发生偏移，则使用本函数做局部坐标转换
export function convertCoordinateFromGeoJSON(data, gs) {
  const newObjs = JSON.parse(JSON.stringify(data));
  newObjs.features.forEach((coordinate1, k) => {
    // polygon数据转换
    if (newObjs.features[0].geometry.type === 'Polygon') {
      coordinate1.geometry.coordinates.forEach((coordinate2, j) => {
        coordinate2.forEach((coordinate3, i) => {
          const position = {
            lng: coordinate3[0],
            lat: coordinate3[1],
            alt: 0
          };
          const newCoordinate = gs.convert(position);
          newObjs.features[k].geometry.coordinates[j][i][0] = newCoordinate.lng;
          newObjs.features[k].geometry.coordinates[j][i][1] = newCoordinate.lat;
        });
      });
    }

    // Linestring数据转换
    if (newObjs.features[0].geometry.type === 'LineString') {
      coordinate1.geometry.coordinates.forEach((coordinate3, i) => {
        const position = {
          lng: coordinate3[0],
          lat: coordinate3[1],
          alt: 0
        };
        const newCoordinate = gs.convert(position);
        newObjs.features[k].geometry.coordinates[i][0] = newCoordinate.lng;
        newObjs.features[k].geometry.coordinates[i][1] = newCoordinate.lat;
      });
    }
    // point数据转换
    if (newObjs.features[0].geometry.type === 'Point') {
      const position = {
        lng: coordinate1.geometry.coordinates[0],
        lat: coordinate1.geometry.coordinates[1],
        alt: 0
      };
      const newCoordinate = gs.convert(position);
      newObjs.features[k].geometry.coordinates[0] = newCoordinate.lng;
      newObjs.features[k].geometry.coordinates[1] = newCoordinate.lat;
    }

    // Multipoint数据转换
    if (newObjs.features[0].geometry.type === 'MultiPoint') {
      console.log(coordinate1);
      coordinate1.geometry.coordinates.forEach((coordinate3, i) => {
        const position = {
          lng: coordinate3[0],
          lat: coordinate3[1],
          alt: 0
        };
        const newCoordinate = gs.convert(position);
        newObjs.features[k].geometry.coordinates[i][0] = newCoordinate.lng;
        newObjs.features[k].geometry.coordinates[i][1] = newCoordinate.lat;
      });
    }

    // multiline数据转换
    // if (newObjs.features[0].geometry.type == 'MultiLineString') {
    //   // console.log(data.features[0].geometry.coordinates[0])
    //   coordinate1.geometry.coordinates.map((coordinate2, j) => {
    //     console.log(coordinate2)
    //     coordinate2.map((coordinate3, i) => {
    //       let position = {
    //         lng: coordinate3[0],
    //         lat: coordinate3[1],
    //         alt: 0
    //       }
    //       //console.log(coordinate)
    //       //console.log(position)
    //       let new_coordinate
    //       new_coordinate = gs.convert(position)
    //       //console.log(newObjs.features[0].geometry.coordinates[0][i][0])
    //       newObjs.features[k].geometry.coordinates[j][i][0] =
    //         new_coordinate.lng
    //       newObjs.features[k].geometry.coordinates[j][i][1] =
    //         new_coordinate.lat
    //       //console.log(new_coordinate)
    //     })
    //     //console.log(data.features[0].geometry.coordinates)
    //     //console.log(newObjs.features[0].geometry.coordinates)
    //   })
    // }

    // multipolygon数据转换
    if (newObjs.features[0].geometry.type === 'MultiPolygon') {
      coordinate1.geometry.coordinates.forEach((coordinate2, j) => {
        coordinate2.forEach((coordinate3, i) => {
          coordinate3.forEach((coordinate4, l) => {
            const position = {
              lng: coordinate4[0],
              lat: coordinate4[1],
              alt: 0
            };
            const newCoordinate = gs.convert(position);
            newObjs.features[k].geometry.coordinates[j][i][l][0] = newCoordinate.lng;
            newObjs.features[k].geometry.coordinates[j][i][l][1] = newCoordinate.lat;
          });
        });
      });
    }
  });
  return newObjs;
}

export function getView(sandbox, startPt, endPt) {
  if (!startPt) startPt = { x: 0, y: 0 };
  if (!endPt) {
    const mapDom = sandbox.domElement;
    endPt = {
      x: mapDom.clientWidth,
      y: mapDom.clientHeight
    };
  }

  const topLeft = sandbox.window.toLngLatAlt(startPt);
  const bottomLeft = sandbox.window.toLngLatAlt({ x: startPt.x, y: endPt.y });
  const topRight = sandbox.window.toLngLatAlt({ x: endPt.x, y: startPt.y });
  const bottomRight = sandbox.window.toLngLatAlt(endPt);
  return [topLeft, topRight, bottomRight, bottomLeft];
}

export function asyncGetGeojsonByView(view) {
  const polygon = turf.polygon([
    [
      [view[0].lng, view[0].lat],
      [view[1].lng, view[1].lat],
      [view[2].lng, view[2].lat],
      [view[3].lng, view[3].lat],
      [view[0].lng, view[0].lat]
    ]
  ]);

  return axios
    .get('http://192.168.43.95:8080/addressService/getAddressByPolygon', {
      params: {
        extent: `${JSON.stringify(polygon.geometry)}`
      }
    })
    .then(res => {
      console.log(res, 'res')
      return res.data
    });
}
