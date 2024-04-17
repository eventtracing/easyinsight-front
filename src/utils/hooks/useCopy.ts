import { message } from "ant-design-vue";

export default function useCopy(param): void {
  const input = document.createElement("textarea");

  document.body.appendChild(input);

  input.value = param;
  input.select();

  const status = document.execCommand("copy");
  const text = status ? "成功" : "失败";

  message.success(`复制${text}~`);

  document.body.removeChild(input);
}
