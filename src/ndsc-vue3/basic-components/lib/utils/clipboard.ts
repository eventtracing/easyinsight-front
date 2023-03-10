/**
 * https://github.com/zenorocha/clipboard.js/blob/master/src/clipboard-action.js
 */
// @ts-nocheck

import select from "select";

const clipboard = {
  fakeElem: undefined,
  container: undefined,
  init() {
    this.container = document.body;
    if (!this.fakeElem) this.initFake();
  },
  initFake() {
    const isRTL = document.documentElement.getAttribute("dir") === "rtl";

    this.removeFake();

    this.fakeElem = document.createElement("textarea");
    this.fakeElem.style.fontSize = "12pt";
    this.fakeElem.style.border = "0";
    this.fakeElem.style.padding = "0";
    this.fakeElem.style.margin = "0";
    this.fakeElem.style.position = "absolute";
    this.fakeElem.style[isRTL ? "right" : "left"] = "-6999px";
    const yPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.fakeElem.style.top = `${yPosition}px`;

    this.container.appendChild(this.fakeElem);
  },
  removeFake() {
    if (this.fakeElem) {
      this.container.removeChild(this.fakeElem);
      this.fakeElem = undefined;
    }
  },
  destroy() {
    this.removeFake();
  },
  copy(text) {
    this.fakeElem.value = text;
    select(this.fakeElem);

    let succeeded;

    try {
      succeeded = document.execCommand("copy");
    } catch (err) {
      succeeded = false;
    }

    return succeeded;
  },
};

/**
 * @param { Element | String } text - target or text
 */
export function copy(text) {
  let target;

  if (text instanceof HTMLElement) {
    target = text;
  } else {
    !clipboard.fakeElem && clipboard.init();

    target = clipboard.fakeElem;
    target.value = text;
  }

  select(target);

  let succeeded;
  try {
    succeeded = document.execCommand("copy");
  } catch (err) {
    succeeded = false;
  }

  return succeeded;
}
