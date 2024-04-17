export const codeValidator = (rule, value) => {
  if (value === "") return Promise.resolve(true);

  if (!/^[a-zA-Z0-9_-]*$/.test(value)) {
    return Promise.reject(new Error("支持英文、数字、'_'和'-'"));
  }

  return Promise.resolve(true);
};

export const nameValidator = (rule, value) => {
  if (value === "") return Promise.resolve(true);

  if (!/^[\u4e00-\u9fa5a-zA-Z0-9_-]*$/.test(value)) {
    return Promise.reject(new Error("支持中英文、数字、'_'和'-'"));
  }

  return Promise.resolve(true);
};
