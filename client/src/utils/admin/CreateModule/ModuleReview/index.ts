const getRandomColor = (
  existingColors: string[],
  minDistance = 100,
): string => {
  const letters = '0123456789ABCDEF';
  let color;

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const colorDistance = (color1: string, color2: string) => {
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  };

  const isDistinct = (newColor: string) =>
    existingColors.every(
      (existingColor) => colorDistance(newColor, existingColor) >= minDistance,
    );

  do {
    color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (!isDistinct(color));

  return color;
};

export { getRandomColor };
