export function between(value: number, min: number, max: number): boolean {
  if (value <= min) {
    return false;
  } else if (value >= max) {
    return false;
  }

  return true;
}

export function ensureArrayLength<T>(array: T[], len: number): T[] {
  if (array.length < len) {
    array.length = len;
  }

  return array;
}

export function sortNumbers(a: number, b: number): number {
  return a - b;
}
