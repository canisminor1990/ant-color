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
    let h = hsl[0];
    const sGroup = {
      hight: hsl[1],
      center: hsl[1] * 0.2,
      low: hsl[1] * 0,
    };

    let s;
    if (h >= 30 && h < 120) {
      s = sGroup.center + ((h - 30) * (sGroup.low - sGroup.center) / 90);
    } else if (h >= 120 && h < 210) {
      s = sGroup.low + ((h - 120) * (sGroup.hight - sGroup.low) / 90);
    } else if (h >= 210 && h < 300) {
      s = sGroup.hight + ((h - 210) * (sGroup.low - sGroup.hight) / 90);
    } else {
      if (h < 30) h = h + 360;
      s = sGroup.low + ((h - 300) * (sGroup.center - sGroup.low) / 90);
    }

    const newHSL = [hsl[0], s, l];

    const newCst = contrast(convert.hsl.hex(...newHSL));
    // @ts-ignore
    if (newCst >= t && newCst - t <= 0.7) {
      targetHSL = newHSL;
    }
  }
  return [targetHSL[0].toFixed(0),targetHSL[1].toFixed(0),targetHSL[2].toFixed(0)];
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