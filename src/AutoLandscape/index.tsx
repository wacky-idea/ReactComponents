import { CSSProperties, useCallback, useEffect, useRef } from 'react';
import { attrCompatible } from './handle';
import './index.less';

export interface AutoLandscapeProps {
  src: string;
  style?: CSSProperties
}

/**
 * 网页自动横屏
 *
 * @param props
 * @returns
 */
export const AutoLandscape = (props: AutoLandscapeProps) => {
  const { style = {} } = props
  const iframeRef = useRef(null)

  const resize = useCallback(() => {
    if (iframeRef.current) {
      attrCompatible(iframeRef.current);
    }
  }, [])

  const orientationchange = useCallback(() => {
    // console.log({
    //   width: document.body.offsetHeight,
    //   height: document.body.offsetWidth
    // })
    // orientationchange 获取的是切换前的宽高
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        attrCompatible(iframeRef.current);
      }
      clearTimeout(timer);
    }, 0)
  }, [])

  useEffect(() => {
    if (iframeRef.current) {

      const win = window
      attrCompatible(iframeRef.current);

      if ('onresize' in window) {
        win.addEventListener('resize', resize)
      } else if ('onorientationchange' in window) {
        // 判断当前设备是否支持orientationchange事件
        win.addEventListener('orientationchange', orientationchange);
      }
    }

    return () => {
      window.removeEventListener('orientationchange', orientationchange);
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (<iframe className="rotating-container" src={props.src} ref={iframeRef} style={{ ...style }}></iframe>)
}
