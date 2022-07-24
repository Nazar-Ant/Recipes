export default function cookingTimeParser(ct) {
  return ct
    .split(":")
    .slice(0, 2)
    .map((time) => +time);
}
