export function isArrayShallowEqual(a: any[], b: any[]) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;

  return a.every((v) => b.includes(v)) && b.every((v) => a.includes(v));
}

export function removeObjectNullProperty<T>(obj: T): T {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });

  return obj;
}

export const genBackground = (level: number) => {
  if (level > 0) {
    let background = "linear-gradient(to right, #dee2e6 0%, #dee2e6 16px,";
    let color = "#fff";
    let stop: any = 16;

    for (let i = 0; i < level; i++) {
      background += ` ${color} ${stop}px,`;

      if (i === level - 1) {
        background += ` ${color} 100%`;
      } else {
        stop += 16;
        background += ` ${color} ${stop}px,`;
      }

      color = color === "#f6f7fa" ? "#fff" : "#f6f7fa";
    }

    background += ")";
    return background;
  }

  return "#fff;";
};

export function generateExpandKeys(spmList = []) {
  const result = [];

  if (spmList && spmList.length) {
    spmList.forEach((spm) => {
      const list = spm.split("|").reverse();

      list.reduce((prev, cur) => {
        prev.unshift(cur);
        result.push(prev.join("|"));

        return prev;
      }, []);
    });
  }

  return result;
}
