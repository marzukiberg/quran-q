const arabicNumberEntities = Array.from({ length: 10 })
  .map((_, i) => i)
  .reduce((a, b) => {
    return {
      ...a,
      [b]: `&#${1632 + b};`,
    };
  }, {});

export const getArabicNumber = (num) => {
  return num
    .toString()
    .split('')
    .map((str) => arabicNumberEntities[str])
    .join('');
};
