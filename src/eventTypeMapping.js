
const clipboard =
  "onCopy onCut onPaste"

const keyboard =
  "onKeyDown onKeyPress onKeyUp"

const focus =
  "onFocus onBlur"

const form =
  "onChange onInput onSubmit"

const mouse =
  "onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit" +
  "onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave" +
  "onMouseMove onMouseOut onMouseOver onMouseUp"

const touch =
  "onTouchCancel onTouchEnd onTouchMove onTouchStart"

const selection =
  "onSelect"

const ui =
  "onScroll"

const wheel =
  "onWheel"

const media =
  "onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted onEnded" +
  "onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay onPlaying onProgress" +
  "onRateChange onSeeked onSeeking onStalled onSuspend onTimeUpdate onVolumeChange onWaiting"

const image =
  "onLoad onError"


const ALL =
  [clipboard, keyboard, focus, form, mouse, touch, selection, ui, wheel, media, image]
    .map(list => list.split(" ").map(e => e.trim()))
    .reduce((acc, list) => [...acc, ...list], [])

const BY_NAME = {}
ALL.forEach(eventType => {
  const name = eventType.replace(/^on/, "").toLowerCase()
  BY_NAME[name] = eventType
})


export const typeByName = name => {
  const type = BY_NAME[name]
  if (!type) {
    throw new Error("Unsupported react.reactive event type '" + name + "' :(")
  }
  return type
}
