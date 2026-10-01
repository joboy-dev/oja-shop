import type { Option } from "@/lib/interfaces/general";

export function capitalizeFirstLetter(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * characters.length);
    result += characters[randIndex];
  }

  return result;
}

export function getOptionByValue(options: Option[], value: string) {
  return options.find(option => option.value === value);
}

export function formatNumberWithCommas(number: number) {
  return Number(number).toLocaleString();
}

export function renderWithLineBreaks(text: string, className?: string) {
  return text.split('\n').map((line, index) => (
    <span key={index} className={className}>
      {line}
      <br />
    </span>
  ));
}

export function isStringifiedJSON(str: string): boolean {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null;
  } catch (e) {
    return false;
  }
}