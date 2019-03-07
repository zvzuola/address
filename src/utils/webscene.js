/**
 * Created by AX on 2018/9/18.
 */

// import * as altizure from './altizure';
import boundary from '@/datas/boundary';
import projects from '@/utils/projects';

const { hky } = window;
const basePosition = { lng: 120.172, lat: 30.309, z: 0 };

export function createMap() {
  const options = {
    altizureApi: {
      key: 'qwKCxUxTywiAlenHoNfhVzRuGA76O7EEYPyC4Av',
      altitoken:
        'CMr4tRB3i9f0hBF7Oz9gR5KoNYBtAKjogCh55mPhdXJgnPZNFz1rG1HBtWLdKgDwHLqaD1KCWOJpPxQlCULR5salA4qsPEmQGTo7mtGeZ5o5QCo7y6CjYomE3SKa'
    },
    camera: {
      poseTo: {
        alt: 50000000,
        lat: basePosition.lat,
        lng: basePosition.lng
      }
    },
    renderItems: {
      earth: true,
      earthUseTexture: true,
      featureInView: false,
      orbitRing: true
    }
  };
  const map = new hky.Map('page-content', options);
  map.basePosition = { lng: 120.1766745, lat: 30.3132158, z: 0 };
  return map;
}

export function createIntegratedMeshLayer() {
  return new hky.IntegratedMeshLayer(projects);
}

export default function init() {
  const map = createMap();
  const integratedMeshLayer = createIntegratedMeshLayer();
  return integratedMeshLayer.addTo(map)
    .then(() => map.sandbox.camera.flyTo({
      lng: basePosition.lng,
      lat: basePosition.lat,
      alt: 300000,
      north: 0,
      tilt: 40
    }))
    .then(() => {
      integratedMeshLayer.altizurePMarkers.forEach(item => item.marker.crop(boundary, false));
      return map.sandbox.camera.flyTo({
        lng: basePosition.lng,
        lat: basePosition.lat,
        alt: 15000,
        north: 0,
        tilt: 40
      });
    })
    .then(() => ({ map, gs: integratedMeshLayer.gs, markers: integratedMeshLayer.altizurePMarkers }));
}
