export const numberChecker = (value: number, target: number) => {
  if (value === target) return "correct";
  if (value / target > 0.8 && value / target < 1.25) return "partial";
  return "incorrect";
};

export const numberArrow = (value: number, target: number) => {
  if (value === target) return "";
  if (value / target > 0.8 && value / target < 1) return "↗";
  if (value / target > 1 && value / target < 1.25) return "↘";
  if (value > target) return "↓";
  if (value < target) return "↑";
  return "";
};

export const scriptChecker = (value: string, target: string) => {
  const normalize = (input: string) =>
    input
      .replace(/\s*\([^)]*\)/g, "")
      .split(/[/|,]/)
      .map(v => v.trim())
      .filter(Boolean);

  const valueList = normalize(value);
  const targetList = normalize(target);

  const sameValues =
    valueList.length === targetList.length &&
    valueList.every(v => targetList.includes(v));

  if (sameValues) return "correct";

  const hasOverlap = valueList.some(v => targetList.includes(v));
  if (hasOverlap) return "partial";

  return "incorrect";
};

export const familyChecker = (value: string, target: string) => {
  // same family and/or subfamily
  if (value === target) return "correct";

  // if either value looks like a path array (e.g. "['a','b']"), parse and compare
  const tryParsePath = (v: string) => {
    try {
      if (v.trim().startsWith("[")) {
        // convert single quotes to double for valid JSON
        return JSON.parse(v.replace(/'/g, '"')) as string[];
      }
    } catch {
      return null;
    }
    return null;
  };

  const vPath = tryParsePath(value);
  const tPath = tryParsePath(target);

  if (vPath && tPath) {
    // exact same terminal node
    if (vPath[vPath.length - 1] === tPath[tPath.length - 1]) return "correct";
    // any overlap means partial
    const overlap = vPath.some((p) => tPath.includes(p));
    if (overlap) return "partial";
    return "incorrect";
  }

  // same big family, wrong subfamily
  if (value.includes('(') && target.includes('(')) {
    const valueFamily = value.substring(0, value.indexOf('(')).trim();
    const targetFamily = target.substring(0, target.indexOf('(')).trim();
    if (valueFamily === targetFamily) return "partial";
  }
  if (value.includes(target) || target.includes(value)) return "partial";
  return "incorrect";
};

export const distanceChecker = (distanceKm: number) => {
  if (distanceKm === 0) return "correct";
  if (distanceKm <= 2000) return "partial";
  return "incorrect";
};