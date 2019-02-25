const { altizure } = window;
let polyLineMarker;

export function clearPolyLineMarker() {
  if (polyLineMarker) {
    polyLineMarker.destruct();
  }
}

export default function addPolyLineMarker(sandbox, poly) {
  clearPolyLineMarker();
  const pnts = poly.boundaryPts;
  pnts.forEach((pnt) => {
    pnt.alt = 40;
  });
  polyLineMarker = new altizure.PolyLineMarker({
    name: 'hightLine',
    sandbox,
    points: pnts,
    color: 0xcffc,
    fenceHeight: 25
  });
  polyLineMarker.style = {
    texture: 'arrow',
    mapping: 'repeat'
  };
  polyLineMarker.speed = 1.0;
  return polyLineMarker;
}
