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

  // same big family, wrong subfamily
  if (value.includes('(')) {
    const valueFamily = value.substring(0, value.indexOf('(')).trim();
    const targetFamily = target.substring(0, target.indexOf('(')).trim();
    if (valueFamily === targetFamily) return "partial";
  }
  if (value.includes(target) || target.includes(value)) return "partial";
  return "incorrect";
};