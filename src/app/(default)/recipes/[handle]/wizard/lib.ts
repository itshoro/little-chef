function toNumber(value: string | null, fallback: number = 0) {
  if (value === null) return fallback;

  const num = parseInt(value, 10);
  return isNaN(num) ? fallback : num;
}

export { toNumber };
