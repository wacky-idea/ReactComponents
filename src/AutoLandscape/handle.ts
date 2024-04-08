/**
 * 兼容性函数
 *
 * @export
 * @param {HTMLIFrameElement} ele
 */
export function attrCompatible(ele: HTMLIFrameElement) {
  if ('orientation' in screen) {
    handleScreenOrientation(ele)
  } else if ('orientation' in window) {
    handleWindowOrientation(ele)
  } else if ('matchMedia' in window) {
    handleMatchMedia(ele);
  }
}

/**
 * 使用 screen.orientation 横竖屏切换
 *
 * @export
 * @param {HTMLIFrameElement} ele
 */
export function handleScreenOrientation(ele: HTMLIFrameElement) {
  if (screen.orientation.type === 'landscape-primary' || screen.orientation.type === 'landscape-secondary') {
    setEleLandscape(ele)
  } else {
    setElePortrait(ele)
  }
}

/**
 * 使用 window.orientation 横竖屏切换
 *
 * @export
 * @param {HTMLIFrameElement} ele
 */
export function handleWindowOrientation(ele: HTMLIFrameElement) {
  if (window.orientation === 90 || window.orientation === -90) {
    // 横屏
    // 设置容器宽高
    setEleLandscape(ele);
  } else {
    // 竖屏
    // 设置容器宽高
    setElePortrait(ele);
  }
}

/**
 * 使用 matchMedia 横竖屏切换
 *
 * @param {HTMLIFrameElement} ele
 */
function handleMatchMedia(ele: HTMLIFrameElement) {
  // 判断当前设备是否支持 matchMedia
  if (window.matchMedia('(orientation: landscape)').matches) {
    // 横屏
    // 设置容器宽高
    setEleLandscape(ele);
  } else {
    // 竖屏
    // 设置容器宽高
    setElePortrait(ele);
  }
}

/**
 * 设置元素横屏状态下的样式
 *
 * @param {HTMLIFrameElement} ele
 */
function setEleLandscape(ele: HTMLIFrameElement) {
  ele.style.transform = 'none';
  ele.style.transformOrigin = 'center';
  ele.style.width = '100%';
  ele.style.height = '100%';
  if ('contentWindow' in ele) {
    ele.contentWindow?.postMessage('landscape', '*');
  }
}

/**
 * 设置元素竖屏状态下的样式
 *
 * @param {HTMLIFrameElement} ele
 */
function setElePortrait(ele: HTMLIFrameElement) {
  ele.style.width = `${document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight}px`;
  ele.style.height = `${document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth}px`;
  ele.style.transformOrigin = 'left top';
  ele.style.transform = 'rotate(90deg) translateX(0%) translateY(-100%)';
  if ('contentWindow' in ele) {
    ele.contentWindow?.postMessage('portrait', '*');
  }
}
