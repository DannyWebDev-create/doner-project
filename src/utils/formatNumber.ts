export const formatNumber = (num: number): string => {
  if (num === undefined || num === null) return '0';
  // For very large numbers, you might want to implement K, M, B, T suffixes later
  // For now, just use toLocaleString for basic formatting with commas
  return num.toLocaleString('de-DE'); // Using German locale for dot as thousands separator
};
