export default {
  mounted(el: HTMLElement, binding: any) {
    const lineCount =
      !isNaN(Number(binding.arg)) && Number(binding.arg) > 1 ? binding.arg : 1;
    if (lineCount === 1) {
      el.style.overflow = "hidden";
      el.style.whiteSpace = "nowrap";
      el.style.textOverflow = "ellipsis";
    } else {
      el.style.overflow = "hidden";
      el.style.textOverflow = "ellipsis";
      el.style.display = `-webkit-box`;
      el.style["-webkit-line-clamp"] = lineCount;
      el.style["-webkit-box-orient"] = "vertical";
    }
    requestAnimationFrame(() => {
      if (
        el.scrollWidth > el.offsetWidth ||
        el.scrollHeight > el.offsetHeight
      ) {
        const title = binding?.value || el.innerText;
        el.setAttribute("title", title);
      } else {
        el.removeAttribute("title");
      }
    });
  },
  update(el: HTMLElement, binding: any) {
    requestAnimationFrame(() => {
      if (
        el.scrollWidth > el.offsetWidth ||
        el.scrollHeight > el.offsetHeight
      ) {
        el.setAttribute("title", binding?.value || el.innerText);
      } else {
        el.removeAttribute("title");
      }
    });
  },
};
