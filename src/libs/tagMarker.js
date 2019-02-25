import BaseMarker from './baseMarker';

const { altizure } = window;

/**
 * 标记标记始终朝向相机并保持其屏幕空间大小
 * options: {
    // 图标地址 img url
    imgUrl: iconMap[project.name],
    // 图标位置 icon position
    position: {
      lng: project.geometry.coordinates[0],
      lat: project.geometry.coordinates[1],
      alt: 0 // 虽然高程都赋值为0，但是不知为何 有的高有的低。
    },
    sandbox,
    // 指针[tagmarker指向地面点的指针]
    pinLength: 30,
    // 图标尺寸 如果设置了图标尺寸，则大小固定，再设置mouse的enter和leave的放大缩小设置fixedSize属性。 liuxiaoyan
    fixedSize: 30
    // 图标比例：设置之后图标的大小相对模型调整。鼠标相应事件设置scale属性。
    scale: 1
  }
 */
export default class TagMarker extends BaseMarker {
  constructor(options) {
    super();
    if (options instanceof Array) {
      this.markers = options.map(v => new altizure.TagMarker(v));
    } else {
      this.markers = new altizure.TagMarker(options);
    }

    this.traverse(marker => {
      marker.interactable = true;
      marker.on('mouseenter', () => {
        marker.fixedSize = 40;
      });
      marker.on('mouseleave', () => {
        marker.fixedSize = 30;
      });
    });
  }
}
