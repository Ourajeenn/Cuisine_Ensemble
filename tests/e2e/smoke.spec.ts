import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/CuisineEnsemble/i);
});

test("home page stays within mobile viewport width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.locator("body")).toBeVisible();

  const overflow = await page.evaluate(() => {
    return {
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyOverflow: document.body.scrollWidth > window.innerWidth,
    };
  });

  expect(overflow.innerWidth).toBeGreaterThanOrEqual(390);
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth + 2);
  expect(overflow.bodyOverflow).toBe(false);
});
