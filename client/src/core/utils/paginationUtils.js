export const getPagination = (current, total, siblingCount = 1) => {
  const pages = [];

  const left = Math.max(current - siblingCount, 1);
  const right = Math.min(current + siblingCount, total);

  if (left > 1) {
    pages.push(1);
    if (left > 2) pages.push("...");
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < total) {
    if (right < total - 1) pages.push("...");
    pages.push(total);
  }

  return pages;
};
