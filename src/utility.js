// 字符串转小数-》保留三位小数的字符串 -》字符串转化为小数
export function formatNumber(value) {
  if (typeof(value) === "number")
    return parseFloat(value).toPrecision(3);
  else 
  return parseFloat(Number(value)).toPrecision(3);
  }


