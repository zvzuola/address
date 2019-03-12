/**
 * Created by AX on 2018/9/18.
 */

// import * as altizure from './altizure';
import boundary from '@/datas/boundary';
import { addProjects } from '@/utils/altizureUtil';
import projects from '@/utils/projects';

const { altizure } = window;

export default function init() {
  let gs;

  // 下城中点 lng: 120.172, lat: 30.309
  // lng: 120.1836688, lat: 30.33083
  // let centerPosition = { lng: 120.1836688, lat: 30.33083, z: 0 }
  // let centerPosition = { lng: 120.1836588, lat: 30.3305158, z: 0 } //原有备份
  // let centerPosition = { lng: 120.1836588, lat: 30.3305247, z: 0 } // ok  section1-2017的中心点位
  const centerPosition = { lng: 120.1766745, lat: 30.3132158, z: 0 }; // altizure ok section2的中心点位
  const basePosition = { lng: 120.172, lat: 30.309, z: 0 };
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

  const sandbox = new altizure.Sandbox('page-content', options);

  return Promise.all(addProjects(sandbox, projects))
    .then(() => {
      // use the first project as the base
      const baseMarker = projects[0].marker;
      const baseCenter = projects[0].center;
      baseMarker.position = centerPosition;
      sandbox.lights.ambient.intensity = 0.01; // ambient light intensity

      gs = new altizure.GeoSystem({
        sandbox,
        base: baseMarker,
        baseCenter,
        EPSG: '4549'
      });

      // align other projects to the base project
      for (let pi = 1; pi < projects.length; pi += 1) {
        gs.align({ marker: projects[pi].marker, markerCenter: projects[pi].center });
      }
      // return sandbox.camera.lookAt(baseMarker, 0, 40, 15000)
      return sandbox.camera.flyTo({
        lng: basePosition.lng,
        lat: basePosition.lat,
        alt: 300000,
        north: 0,
        tilt: 40
      });
    })
    .then(() => {
      projects.forEach((proj) => {
        proj.marker.crop(boundary, false);
      });
      sandbox.camera.flyTo({
        lng: basePosition.lng,
        lat: basePosition.lat,
        alt: 15000,
        north: 0,
        tilt: 40
      });
      return { sandbox, gs };
    });
}
