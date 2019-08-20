type HandlerType = (ev: Event) => void;
interface CustomEventType extends Event {
  target: EventTarget;
}
interface IeElement extends Element {
  attachEvent: (eventName: string, handler: HandlerType) => void;
  detachEvent: (eventName: string, handler: HandlerType) => void;
}

export function addEventListener(
  element: Element | Window | Document | HTMLElement,
  eventName: string,
  handler: HandlerType,
  useCapture?: boolean
) {
  if (window.addEventListener) {
    element.addEventListener(eventName, handler, useCapture);
  } else {
    (element as IeElement).attachEvent(`on${eventName}`, function() {
      const event: CustomEventType = window.event;
      event.target = event.srcElement;
      handler.call(self, event);
    });
  }
}

export function getDocumentInnerHeight(): number {
    return window.innerHeight || document.documentElement.clientHeight;
}
export function getDocumentInnerWidth(): number {
    return window.innerWidth || document.documentElement.clientWidth;
}