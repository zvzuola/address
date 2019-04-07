import * as turf from '@turf/turf';

const { altizure } = window;

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
  if (!gs) return data;
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

export function convertCoordinateFromFeature(oldFeature, gs) {
  if (!gs) return oldFeature;
  const newFeature = JSON.parse(JSON.stringify(oldFeature));
  // polygon数据转换
  if (newFeature.geometry.type === 'Polygon') {
    oldFeature.geometry.coordinates.forEach((coordinate2, j) => {
      coordinate2.forEach((coordinate3, i) => {
        const position = {
          lng: coordinate3[0],
          lat: coordinate3[1],
          alt: 0,
        };

        const newCoordinate = gs.convert(position);
        newFeature.geometry.coordinates[j][i][0] = newCoordinate.lng;
        newFeature.geometry.coordinates[j][i][1] = newCoordinate.lat;
      });
    });
  }

  // Linestring数据转换
  if (newFeature.geometry.type === 'LineString') {
    // num++;
    newFeature.geometry.coordinates.forEach((coordinate3, i) => {
      const position = {
        lng: coordinate3[0],
        lat: coordinate3[1],
        alt: 0,
      };

      const newCoordinate = gs.convert(position);
      newFeature.geometry.coordinates[i][0] = newCoordinate.lng;
      newFeature.geometry.coordinates[i][1] = newCoordinate.lat;
    });
  }
  // point数据转换
  if (newFeature.geometry.type === 'Point') {
    const position = {
      lng: newFeature.geometry.coordinates[0],
      lat: newFeature.geometry.coordinates[1],
      alt: 0,
    };

    const newCoordinate = gs.convert(position);
    newFeature.geometry.coordinates[0] = newCoordinate.lng;
    newFeature.geometry.coordinates[1] = newCoordinate.lat;
  }

  // Multipoint数据转换
  if (newFeature.geometry.type === 'MultiPoint') {
    newFeature.geometry.coordinates.forEach((coordinate3, i) => {
      const position = {
        lng: coordinate3[0],
        lat: coordinate3[1],
        alt: 0,
      };

      const newCoordinate = gs.convert(position);
      newFeature.geometry.coordinates[i][0] = newCoordinate.lng;
      newFeature.geometry.coordinates[i][1] = newCoordinate.lat;
    });
  }

  // multipolygon数据转换
  if (newFeature.geometry.type === 'MultiPolygon') {
    newFeature.geometry.coordinates.forEach((coordinate2, j) => {
      coordinate2.forEach((coordinate3, i) => {
        coordinate3.forEach((coordinate4, l) => {
          const position = {
            lng: coordinate4[0],
            lat: coordinate4[1],
            alt: 0,
          };

          const newCoordinate = gs.convert(position);
          newFeature.geometry.coordinates[j][i][l][0] = newCoordinate.lng;
          newFeature.geometry.coordinates[j][i][l][1] = newCoordinate.lat;
        });
      });
    });
  }
  return newFeature;
}

export function debounce(fn, time) {
  let timeout = null;
  return function func(...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, time);
  };
}

export function getView(sandbox, startPt, endPt) {
  // const radians = Math.PI * sandbox.camera.pose.tilt / 180;
  const mapDom = sandbox.domElement;

  if (!startPt) startPt = { x: 0, y: 0 };
  if (!endPt) {
    endPt = {
      x: mapDom.clientWidth,
      y: mapDom.clientHeight
    };
  }

  // startPt.y = (mapDom.clientHeight - startPt.x) * Math.sin(radians) * Math.sin(radians);
  let topLeft = sandbox.window.toLngLatAlt(startPt);
  if (topLeft === undefined) {
    startPt = {
      x: startPt.x,
      y: startPt.y + (endPt.y - startPt.y) / 2
    };
    topLeft = sandbox.window.toLngLatAlt(startPt);
  }

  let topRight = sandbox.window.toLngLatAlt({ x: endPt.x, y: startPt.y });
  if (topRight === undefined) {
    startPt = {
      x: endPt.x,
      y: startPt.y + (endPt.y - startPt.y) / 2
    };
    topRight = sandbox.window.toLngLatAlt(startPt);
  }
  const bottomRight = sandbox.window.toLngLatAlt(endPt);
  const bottomLeft = sandbox.window.toLngLatAlt({ x: startPt.x, y: endPt.y });

  return [topLeft, topRight, bottomRight, bottomLeft];
}

export function getLevel(sandbox) {
  // return 1;
  const { alt } = sandbox.camera.pose;
  let level = -1;
  if (alt < 100) {
    level = 0;
  } else if (alt < 200) {
    level = 1;
  } else if (alt < 300) {
    level = 2;
  } else if (alt < 500) {
    level = 3;
  } else {
    level = -1;
  }
  return level;
}

export function getPolygonFromView(view) {
  return turf.polygon([
    [
      [view[0].lng, view[0].lat],
      [view[1].lng, view[1].lat],
      [view[2].lng, view[2].lat],
      [view[3].lng, view[3].lat],
      [view[0].lng, view[0].lat]
    ]
  ]);
}

export function diff(oldData, newData) {
  return newData.filter(a => !oldData.some(b => JSON.stringify(a) === JSON.stringify(b)));
}

export function sleep(time) {
  return new Promise(resolve => {
    resolve();
  }, time);
}

export function getCenterPosition(sandbox, feature) {
  const pt = [0, 0];
  const ptarray = feature.geometry.coordinates[0];
  ptarray.forEach((v) => {
    pt[0] += v[0];
    pt[1] += v[1];
  });
  pt[0] /= ptarray.length;
  pt[1] /= ptarray.length;

  const pos = new altizure.LngLatAlt(pt[0], pt[1], 0.1);
  const alt = sandbox.positionsAltitude([pos]);
  console.log(pos, alt);
  return [];
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
    .get('http://122.224.129.162:11172/addressServer/addressService/getAddressByPolygon', {
      params: {
        extent: `${JSON.stringify(polygon.geometry)}`
      }
    })
    .then(res => {
      console.log(res, 'res')
      return res.data
    });
}
