import convert from 'color-convert';

export function luminanace(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function contrast(rgb2) {
  const a = convert.hex.rgb('FFFFFF');
  const b = convert.hex.rgb(rgb2.replace('#', ''));

  // @ts-ignore
  const lum1 = luminanace(...a);
  // @ts-ignore
  const lum2 = luminanace(...b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  const result = (brightest + 0.05) / (darkest + 0.05);

  return result.toFixed(2);
}

export function genColor(hsl, t) {
  let targetHSL;
  for (let l = 0; l <= 100; l = l + 1) {
    const newHSL = [hsl[0], hsl[1], l];
    const newCst = contrast(convert.hsl.hex(...newHSL));
    // @ts-ignore
    if (newCst >= t && newCst - t <= 0.7) {
      targetHSL = newHSL;
    }
  }
  return targetHSL;
}

export function formatNumber(string) {
  try {
    const array = [];
    string.replace('，', ',').split(',').forEach(s => {
      array.push(parseFloat(s));
    });
    return array;
  } catch {
    return [];
  }
}