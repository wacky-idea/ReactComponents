import { CSSProperties, useEffect, useRef } from "react"

/**
 * outset   等比    裁剪    无黑边
 * inset    等比    不裁剪  有黑边
 * full     不等比  不裁剪  无黑边
 */
export type CanvasPlayerRenderType = "outset" | "inset" | "full"
export type DirectionType = "top" | "right" | "down" | "left"

export interface CanvasPlayerProps {
  /** 视频dom */
  source: HTMLVideoElement
  /** 朝向 */
  direction?: DirectionType
  /** canvas 样式 */
  canvasStyle?: CSSProperties
  /** 渲染类型 */
  renderType?: CanvasPlayerRenderType
}

export const CanvasPlayer = (props: CanvasPlayerProps) => {
  const { source, direction = "top", canvasStyle = {}, renderType = "full" } = props

  const canvasRef = useRef(document.createElement("canvas"))
  const canvasELE = canvasRef.current

  const ctx = canvasELE.getContext("2d")
  const containerRef = useRef<HTMLDivElement>(null)
  const option = useRef({
    sx: 0,
    sy: 0,
    // sWidth: sourceWidth,
    sWidth: 0,
    // sHeight: sourceHeight,
    sHeight: 0,
    dx: 0,
    dy: 0,
    // dWidth: canvasWidth,
    dWidth: 0,
    // dHeight: canvasHeight,
    dHeight: 0
  })

  const handle = () => {
    // option reset
    option.current = {
      sx: 0,
      sy: 0,
      sWidth: 0,
      sHeight: 0,
      dx: 0,
      dy: 0,
      dWidth: 0,
      dHeight: 0
    }

    let sourceWidth = 0
    let sourceHeight = 0
    let canvasWidth = 0
    let canvasHeight = 0
    sourceWidth = source.videoWidth || source.offsetWidth || source.width
    sourceHeight = source.videoHeight || source.offsetHeight || source.height
    option.current.sWidth = sourceWidth
    option.current.sHeight = sourceHeight

    canvasWidth = containerRef.current?.offsetWidth || 0
    canvasHeight = containerRef.current?.offsetHeight || 0
    option.current.dWidth = canvasWidth
    option.current.dHeight = canvasHeight

    canvasELE.width = canvasWidth
    canvasELE.height = canvasHeight
    console.log("info", {
      sourceWidth,
      sourceHeight,
      canvasWidth,
      canvasHeight
    })

    ctx?.restore()
    ctx?.save()
    ctx?.translate(canvasWidth / 2, canvasHeight / 2)
    switch (direction) {
      case "top":
        ctx?.rotate(0)
        break
      case "right":
        ctx?.rotate(Math.PI / 2)
        break
      case "down":
        ctx?.rotate(Math.PI)
        break
      case "left":
        ctx?.rotate(Math.PI + Math.PI / 2)
        break
      default:
        ctx?.rotate(0)
        break
    }
    ctx?.translate(-canvasWidth / 2, -canvasHeight / 2)
    const data = option.current
    if (renderType === "full") {
      if (direction === "top") {
        // 不作处理
      }
      if (direction === "right") {
        data.dx = (canvasWidth - canvasHeight) / 2
        data.dy = -(canvasWidth - canvasHeight) / 2
        data.dWidth = canvasHeight
        data.dHeight = canvasWidth
      }
      if (direction === "down") {
        // 不作处理
      }
      if (direction === "left") {
        data.dx = (canvasWidth - canvasHeight) / 2
        data.dy = -(canvasWidth - canvasHeight) / 2
        data.dWidth = canvasHeight
        data.dHeight = canvasWidth
      }
    }

    if (renderType === "inset") {
      var widthRatio = sourceWidth / canvasWidth
      var heightRatio = sourceHeight / canvasHeight
      var heightDiff = 0
      var widthDiff = 0

      if (direction === "top") {
        if (widthRatio > heightRatio) {
          // 宽比大 宽百分百 高缩放
          heightDiff = (canvasHeight - sourceHeight / widthRatio) / 2

          // data.dx = 0
          data.dy = heightDiff
          // data.dWidth = canvasWidth
          data.dHeight = canvasHeight - heightDiff * 2
        } else {
          // 高比大 高百分百 宽缩放
          widthDiff = (canvasWidth - sourceWidth / heightRatio) / 2

          data.dx = widthDiff
          // data.dy = 0
          data.dWidth = canvasWidth - widthDiff * 2
          // data.dHeight = canvasHeight
        }
      }
      if (direction === "right") {
        widthRatio = sourceWidth / canvasHeight
        heightRatio = sourceHeight / canvasWidth
        var canvasRatio = canvasWidth / canvasHeight

        if (widthRatio > heightRatio) {
          // 宽比大 宽百分百 高缩放
          data.dx = (canvasWidth - canvasHeight) / 2
          data.dy = -(canvasWidth / canvasRatio - canvasHeight) / 2
          data.dWidth = canvasHeight
          data.dHeight = canvasWidth / canvasRatio
        } else {
          // 高比大 高百分百 宽缩放
          data.dx = (canvasWidth - canvasHeight * canvasRatio) / 2
          data.dy = -(canvasWidth - canvasHeight) / 2
          data.dWidth = canvasHeight * canvasRatio
          data.dHeight = canvasWidth
        }
      }
      if (direction === "down") {
        if (widthRatio > heightRatio) {
          // 宽比大 宽百分百 高缩放
          heightDiff = (canvasHeight - sourceHeight / widthRatio) / 2

          // data.dx = 0
          data.dy = heightDiff
          // data.dWidth = canvasWidth
          data.dHeight = canvasHeight - heightDiff * 2
        } else {
          // 高比大 高百分百 宽缩放
          widthDiff = (canvasWidth - sourceWidth / heightRatio) / 2

          data.dx = widthDiff
          // data.dy = 0
          data.dWidth = canvasWidth - widthDiff * 2
          // data.dHeight = canvasHeight
        }
      }
      if (direction === "left") {
        widthRatio = sourceWidth / canvasHeight
        heightRatio = sourceHeight / canvasWidth
        var canvasRatio = canvasWidth / canvasHeight

        if (widthRatio > heightRatio) {
          // 宽比大 宽百分百 高缩放

          data.dx = (canvasWidth - canvasHeight) / 2
          data.dy = -(canvasWidth / canvasRatio - canvasHeight) / 2
          data.dWidth = canvasHeight
          data.dHeight = canvasWidth / canvasRatio
        } else {
          // 高比大 高百分百 宽缩放
          data.dx = (canvasWidth - canvasHeight * canvasRatio) / 2
          data.dy = -(canvasWidth - canvasHeight) / 2
          data.dWidth = canvasHeight * canvasRatio
          data.dHeight = canvasWidth
        }
      }
    }

    if (renderType === "outset") {
      var widthRatio = sourceWidth / canvasWidth
      var heightRatio = sourceHeight / canvasHeight
      var heightDiff = 0
      var widthDiff = 0
      if (direction === "top") {
        if (widthRatio < heightRatio) {
          // 高比大 宽百分百 高裁剪
          heightDiff = (sourceHeight - canvasHeight * widthRatio) / 2
          // data.sx = 0
          data.sy = heightDiff
          // data.sWidth = sourceWidth
          data.sHeight = canvasHeight * widthRatio
        } else {
          // 宽比大 高百分百 宽裁剪
          widthDiff = (sourceWidth - canvasWidth * heightRatio) / 2

          data.sx = widthDiff
          // data.sy = 0
          data.sWidth = canvasWidth * heightRatio
          // data.sHeight = sourceHeight
        }
      }
      if (direction === "right") {
        widthRatio = sourceWidth / canvasHeight
        heightRatio = sourceHeight / canvasWidth
        var canvasRatio = canvasWidth / canvasHeight

        if (widthRatio < heightRatio) {
          // 高比大 宽百分百 高裁剪
          // data.sx = 0
          // data.sy = -heightDiff
          // data.sWidth = sourceWidth
          // data.sHeight = sourceHeight + heightDiff * 2
          data.dx = (canvasWidth - canvasHeight) / 2
          data.dy = -(canvasWidth / canvasRatio - canvasHeight) / 2
          data.dWidth = canvasHeight
          data.dHeight = canvasWidth / canvasRatio
        } else {
          // 宽比大 高百分百 宽裁剪
          // data.sx = 0
          // data.sy = -heightDiff
          // data.sWidth = sourceWidth
          // data.sHeight = sourceHeight + heightDiff * 2
          data.dx = (canvasWidth - canvasHeight * canvasRatio) / 2
          data.dy = -(canvasWidth - canvasHeight) / 2
          data.dWidth = canvasHeight * canvasRatio
          data.dHeight = canvasWidth
        }
      }
      if (direction === "down") {
        if (widthRatio < heightRatio) {
          // 高比大 宽百分百 高裁剪
          heightDiff = (sourceHeight - canvasHeight * widthRatio) / 2
          // data.sx = 0
          data.sy = heightDiff
          // data.sWidth = sourceWidth
          data.sHeight = canvasHeight * widthRatio
        } else {
          // 宽比大 高百分百 宽裁剪
          widthDiff = (sourceWidth - canvasWidth * heightRatio) / 2

          data.sx = widthDiff
          // data.sy = 0
          data.sWidth = canvasWidth * heightRatio
          // data.sHeight = sourceHeight
        }
      }
      if (direction === "left") {
        widthRatio = sourceWidth / canvasHeight
        heightRatio = sourceHeight / canvasWidth
        var canvasRatio = canvasWidth / canvasHeight

        if (widthRatio < heightRatio) {
          // 高比大 宽百分百 高裁剪
          // data.sx = 0
          // data.sy = -heightDiff
          // data.sWidth = sourceWidth
          // data.sHeight = sourceHeight + heightDiff * 2
          data.dx = (canvasWidth - canvasHeight) / 2
          data.dy = -(canvasWidth / canvasRatio - canvasHeight) / 2
          data.dWidth = canvasHeight
          data.dHeight = canvasWidth / canvasRatio
        } else {
          // 宽比大 高百分百 宽裁剪
          // data.sx = 0
          // data.sy = -heightDiff
          // data.sWidth = sourceWidth
          // data.sHeight = sourceHeight + heightDiff * 2
          data.dx = (canvasWidth - canvasHeight * canvasRatio) / 2
          data.dy = -(canvasWidth - canvasHeight) / 2
          data.dWidth = canvasHeight * canvasRatio
          data.dHeight = canvasWidth
        }
      }
    }
    console.log(renderType, direction, JSON.stringify(data))
  }

  useEffect(() => {
    // handle()
    source.addEventListener("loadedmetadata", handle)
    source.addEventListener("loadeddata", handle)
    source.addEventListener("play", handle)
    return () => {
      source.removeEventListener("loadedmetadata", handle)
      source.removeEventListener("loadeddata", handle)
      source.removeEventListener("play", handle)
    }
  }, [direction])

  useEffect(() => {
    containerRef.current?.appendChild(canvasELE)
    canvasELE.style.position = "absolute"
    canvasELE.style.left = "0"
    canvasELE.style.top = "0"

    containerRef.current?.appendChild(source)
    source.style.position = "absolute"
    source.style.left = "0"
    source.style.top = "0"
    source.style.zIndex = "-1"
    source.style.opacity = "0"

    render()
  }, [])

  const render = () => {
    const { sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight } = option.current
    ctx?.clearRect(0, 0, canvasELE.width, canvasELE.height)
    ctx?.drawImage(source, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

    if ("requestVideoFrameCallback" in source) {
      source.requestVideoFrameCallback(render)
    } else {
      requestAnimationFrame(render)
    }
  }

  return <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative", backgroundColor: "#000", overflow: "hidden", ...canvasStyle }}></div>
}
