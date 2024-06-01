export const objectToCssVars = (obj: Record<string, any>, parentKey = '') => {
  let vars: Record<string, string> = {};

  const getKey = (key: string) =>
    parentKey === '' ? key : `${parentKey}-${key}`;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object') {
      vars = {
        ...vars,
        ...objectToCssVars(value, getKey(key)),
      };
    } else {
      vars[`--${getKey(key)}`] = value;
    }
  }

  return vars;
};

export const colorsToCssVars = (obj: Record<string, any>) => {
  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(objectToCssVars(obj))) {
    vars[key.replace('--', '--colors-')] = value;
  }

  return vars;
};
