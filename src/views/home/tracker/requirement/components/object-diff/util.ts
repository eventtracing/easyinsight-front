import { ChangeTypeEnum } from "@/types/object.type";

export function genClasses(paramChangeType: ChangeTypeEnum) {
  return paramChangeType === ChangeTypeEnum.CREATE
    ? "new-item"
    : paramChangeType === ChangeTypeEnum.DELETE
    ? "delete-item"
    : "";
}

export function genTooltip(
  {
    paramChangeType,
    terminalVersionName,
    isNewestTerminalVersion,
    isCurrentTask,
  },
  type = "参数"
) {
  let res = "";
  const operate = paramChangeType === ChangeTypeEnum.CREATE ? "增加" : "删除";

  if (isNewestTerminalVersion) {
    res += `${terminalVersionName}${operate}了该${type}`;
  }

  if (isCurrentTask) {
    res += res ? "，" : "";
    res += `当前需求${operate}了该${type}`;
  }

  return res;
}
