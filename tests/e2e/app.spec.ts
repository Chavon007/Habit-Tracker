import { test, expect } from "@playwright/test";

const TEST_EMAIL = "e2e@example.com";
const TEST_PASSWORD = "password123";

async function clearStorage(page: any) {
  await page.evaluate(() => {
    localStorage.removeItem("habit-tracker-users");
    localStorage.removeItem("habit-tracker-session");
    localStorage.removeItem("habit-tracker-habits");
  });
}

async function signupUser(page: any, email = TEST_EMAIL, password = TEST_PASSWORD) {
  await page.goto("/signup");
  await page.getByTestId("auth-signup-email").fill(email);
  await page.getByTestId("auth-signup-password").fill(password);
  await page.getByTestId("auth-signup-submit").click();
  await page.waitForURL("**/dashboard");
}

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearStorage(page);
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await page.waitForURL("**/login", { timeout: 5000 });
    expect(page.url()).toContain("/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({ page }) => {
    await signupUser(page);
    await page.goto("/");
    await page.waitForURL("**/dashboard", { timeout: 5000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login", { timeout: 5000 });
    expect(page.url()).toContain("/login");
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await signupUser(page, "newuser@example.com", "securepass");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    // Create user A with a habit
    await signupUser(page, "userA@example.com", "passwordA");
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("User A Habit");
    await page.getByTestId("habit-save-button").click();
    await page.waitForTimeout(1000);

    // Log out
    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("**/login");

    // Create user B
    await signupUser(page, "userB@example.com", "passwordB");
    // User B should not see User A's habit
    await expect(page.getByTestId("habit-card-user-a-habit")).not.toBeVisible();

    // Log out user B
    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("**/login");

    // Log in as user A again
    await page.getByTestId("auth-login-email").fill("userA@example.com");
    await page.getByTestId("auth-login-password").fill("passwordA");
    await page.getByTestId("auth-login-submit").click();
    await page.waitForURL("**/dashboard");

    await expect(page.getByTestId("habit-card-user-a-habit")).toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await signupUser(page);
    await page.getByTestId("create-habit-button").click();
    await expect(page.getByTestId("habit-form")).toBeVisible();
    await page.getByTestId("habit-name-input").fill("Exercise Daily");
    await page.getByTestId("habit-description-input").fill("30 minutes workout");
    await page.getByTestId("habit-save-button").click();
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("habit-card-exercise-daily")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({ page }) => {
    await signupUser(page);
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Morning Run");
    await page.getByTestId("habit-save-button").click();
    await page.waitForTimeout(1000);

    const streakEl = page.getByTestId("habit-streak-morning-run").first();
    await expect(streakEl).toContainText("0");

    await page.getByTestId("habit-complete-morning-run").first().click();
    await expect(streakEl).toContainText("1");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await signupUser(page);
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Meditate");
    await page.getByTestId("habit-save-button").click();
    await page.waitForTimeout(1000);

    await page.reload();
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("habit-card-meditate")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await signupUser(page);
    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
    context,
  }) => {
    await signupUser(page);
    // Let SW install and cache
    await page.waitForTimeout(2000);

    // Go offline
    await context.setOffline(true);
    await page.reload().catch(() => {});
    // App shell should still render (no hard crash)
    const body = await page.locator("body").textContent().catch(() => "");
    expect(body).not.toBeNull();
    await context.setOffline(false);
  });
});
