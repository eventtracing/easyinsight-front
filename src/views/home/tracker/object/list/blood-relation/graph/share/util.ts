import G6 from "@antv/g6";

interface Point {
  x: number;
  y: number;
}

type Path = (string | number)[][];

export const fittingString = (str, maxWidth, fontSize) => {
  const ellipsis = "...";
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
  // distinguish the Chinese charactargetrs and letters
  const pattern = new RegExp("[\u4E00-\u9FA5]+");

  let currentWidth = 0;
  let res = str;

  str.split("").forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return;

    currentWidth += pattern.test(letter)
      ? fontSize
      : G6.Util.getLetterWidth(letter, fontSize);
    currentWidth > maxWidth - ellipsisLength &&
      (res = `${str.substr(0, i)}${ellipsis}`);
  });

  return res;
};

function getLetterWidth(letter, fontSize) {
  const pattern = new RegExp("[\u4E00-\u9FA5]+");

  return pattern.test(letter)
    ? fontSize
    : G6.Util.getLetterWidth(letter, fontSize);
}

export const fittingWrapString = (str, maxWidth, fontSize) => {
  const splitIdx = [0];
  let currentWidth = 0;
  let res = "";

  str.split("").forEach((letter, i) => {
    currentWidth += getLetterWidth(letter, fontSize);

    if (currentWidth > maxWidth) {
      splitIdx.push(i);
      currentWidth = getLetterWidth(letter, fontSize);
    }
  });

  splitIdx.forEach((idx, i) => {
    i > 0 && (res += `${str.substring(splitIdx[i - 1], idx)}\n`);
  });

  res += `${str.substring(splitIdx[splitIdx.length - 1])}`;

  return res;
};

export function getTopSemiCirclePath(point: Point): Path {
  // 不压线
  point = { x: point.x, y: point.y };
  const path = [
    ["M", point.x, point.y + 8],
    ["A", 8, 8, 0, 1, 0, point.x, point.y - 8],
    ["Z"],
  ];

  return path;
}

export function getBottomSemiCirclePath(point: Point): Path {
  // 不压线
  point = { x: point.x, y: point.y };
  const path = [
    ["M", point.x, point.y + 8],
    ["A", 8, 8, 0, 1, 1, point.x, point.y - 8],
    ["Z"],
  ];

  return path;
}

export function getTopPlusPath(point: Point): Path {
  return [
    ["M", point.x + 2, point.y - 2],
    ["L", point.x + 4, point.y - 2],
    ["L", point.x + 4, point.y],
    ["L", point.x + 6, point.y],
    ["L", point.x + 6, point.y + 2],
    ["L", point.x + 4, point.y + 2],
    ["L", point.x + 4, point.y + 4],
    ["L", point.x + 2, point.y + 4],
    ["L", point.x + 2, point.y + 2],
    ["L", point.x, point.y + 2],
    ["L", point.x, point.y],
    ["L", point.x + 2, point.y],
    ["L", point.x + 2, point.y - 2],
    ["Z"],
  ];
}

export function getBottomPlusPath(point: Point): Path {
  return [
    ["M", point.x - 0.8, point.y + 1],
    ["L", point.x + 0.8, point.y + 1],
    ["L", point.x + 0.8, point.y + 3.2],
    ["L", point.x + 3, point.y + 3.2],
    ["L", point.x + 3, point.y + 4.8],
    ["L", point.x + 0.8, point.y + 4.8],
    ["L", point.x + 0.8, point.y + 7],
    ["L", point.x - 0.8, point.y + 7],
    ["L", point.x - 0.8, point.y + 4.8],
    ["L", point.x - 3, point.y + 4.8],
    ["L", point.x - 3, point.y + 3.2],
    ["L", point.x - 0.8, point.y + 3.2],
    ["L", point.x - 0.8, point.y + 1],
    ["Z"],
  ];
}

export function getBottomMinusPath(point: Point): Path {
  return [
    ["M", point.x - 4, point.y - 3.2],
    ["L", point.x - 1.5, point.y - 3.2],
    ["L", point.x - 1.5, point.y + 3.2],
    ["L", point.x - 4, point.y + 3.2],
    ["L", point.x - 4, point.y - 3.2],
    ["Z"],
  ];
}

// 拓扑排序 https://zhuanlan.zhihu.com/p/214747022 https://segmentfault.com/a/1190000020241908
export function hasLoop(source, target, paths, nodes) {
  const pathData = paths.slice(0);
  const nodeCount = nodes.length;
  const nodeMap = {};
  let outNodeNum = 0;

  pathData.push({ source: source, target: target });

  for (let i = 0; i < nodeCount; i++) {
    const id = nodes[i].id;
    nodeMap[id] = {};
    nodeMap[id].indegree = 0; // 节点的度表示以该节点为起点的边的条数
    nodeMap[id].nodeState = true;
    nodeMap[id].outPath = [];
  }

  for (let i = 0; i < pathData.length; i++) {
    nodeMap[pathData[i].target].indegree++;
    nodeMap[pathData[i].source].outPath.push(i);
  }

  // 循环剔除没有出边的节点，如果无环，所有节点都会被遍历剔除
  while (true) {
    let findNode = false;

    for (const i in nodeMap) {
      // nodeMap[i].nodeState && nodeMap[i].indegree === 0 没有出边的节点
      if (nodeMap[i].nodeState && nodeMap[i].indegree === 0) {
        findNode = true;
        nodeMap[i].nodeState = false;
        outNodeNum++;

        for (let j = 0; j < nodeMap[i].outPath.length; j++) {
          nodeMap[pathData[nodeMap[i].outPath[j]].target].indegree--;
        }

        break;
      }
    }

    if (!findNode) break;
  }

  return !(outNodeNum === nodeCount);
}
