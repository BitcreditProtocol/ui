export type AmountToWordsLabels = {
  ones: string[];
  tens: string[];
  orders: string[];
  hundred: string;
  bitcoin: string;
  point: string;
};

const numbersToWords = (num: number, labels: AmountToWordsLabels): string => {
  if (num <= 19) {
    return labels.ones[num];
  }
  if (num <= 99) {
    const upper = Math.floor(num / 10);
    const lower = num % 10;
    return lower === 0 ? labels.tens[upper] : `${labels.tens[upper]}-${numbersToWords(lower, labels)}`;
  }
  if (num <= 999) {
    return formatNum(num, 100, labels.hundred, labels);
  }

  for (let orderIndex = labels.orders.length - 1; orderIndex >= 1; orderIndex -= 1) {
    const div = 1000 ** orderIndex;
    if (num >= div) {
      return formatNum(num, div, labels.orders[orderIndex], labels);
    }
  }

  return num.toString();
};

const formatNum = (num: number, div: number, order: string, labels: AmountToWordsLabels): string => {
  const upper = Math.floor(num / div);
  const lower = num % div;
  return lower === 0
    ? `${numbersToWords(upper, labels)} ${order}`
    : `${numbersToWords(upper, labels)} ${order} ${numbersToWords(lower, labels)}`;
};

const digitsToWords = (digits: string, labels: AmountToWordsLabels): string =>
  digits
    .split("")
    .map((digit) => labels.ones[Number(digit)])
    .join(" ");

export const btcAmountToWords = (btcAmount: string, labels: AmountToWordsLabels): string => {
  const [integerPartRaw, fractionalPartRaw = ""] = btcAmount.split(".");
  const integerPart = Number(integerPartRaw);
  if (!Number.isFinite(integerPart)) {
    return btcAmount;
  }

  const integerWords = numbersToWords(integerPart, labels);
  const fractionalDigits = fractionalPartRaw.padEnd(8, "0");
  if (!fractionalDigits || /^0+$/.test(fractionalDigits)) {
    return `${labels.bitcoin} ${integerWords}`;
  }

  return `${labels.bitcoin} ${integerWords} ${labels.point} ${digitsToWords(fractionalDigits, labels)}`;
};
