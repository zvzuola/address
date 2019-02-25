export default class BaseMarker {
  traverse(func) {
    if (this.markers) {
      if (this.markers instanceof Array) {
        this.markers.map(func);
      } else {
        func(this.markers, 0);
      }
    }
  }

  destruct() {
    this.traverse((marker) => {
      marker.destruct();
    });
  }
}
