import { test, Page } from "@playwright/test";
import { createLoginPage } from "../page/model.loginPage";
import * as loginPageData from "../fixtures/data.loginPage";
import { borderColors } from "../fixtures/data.general";

const BASE_URL = "https://demo-bank.vercel.app/";

test.describe("Login Page validation", () => {
  let page: Page;
  let loginPage: ReturnType<typeof createLoginPage>;

  test.beforeEach(async ({ page }) => {
    loginPage = createLoginPage(page);
    await loginPage.openPage(BASE_URL);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Static elements validation", async () => {
    await loginPage.checkUrl(BASE_URL);
    await loginPage.checkTitle(loginPageData.pageTitle);
  });

  test("Tooltip - login input", async () => {
    await loginPage.assertions.hasLoginTooltipText(
      loginPageData.tooltipText.login
    );
  });

  test("Tooltip - password input", async () => {
    await loginPage.assertions.hasPasswordTooltipText(
      loginPageData.tooltipText.password
    );
  });

  test("Login inputs validation - valid credentials", async () => {
    await loginPage.assertions.isSubmitButtonEnabled(false);
    await loginPage.fillForm(
      loginPageData.validCredentials.userName,
      loginPageData.validCredentials.password
    );
    await loginPage.assertions.hasPasswordValue(
      loginPageData.validCredentials.password
    );
    await loginPage.assertions.hasUsernameValue(
      loginPageData.validCredentials.userName
    );
    await loginPage.assertions.hasLoginInputBorderColor(
      borderColors.validGreen
    );
    await loginPage.assertions.hasPasswordInputBorderColor(
      borderColors.validGreen
    );
    await loginPage.assertions.isSubmitButtonEnabled(true);
  });

  const numberOfIterations = loginPageData.invalidCredentials.length;
  loginPageData.invalidCredentials.forEach((data, index) => {
    test(`Login inputs validation - invalid credentials - ${
      index + 1
    }/${numberOfIterations}`, async () => {
      await loginPage.fillForm(data.userName, data.password);
      await loginPage.assertions.hasLoginInputBorderColor(
        borderColors.invalidRed
      );
      await loginPage.assertions.hasPasswordInputBorderColor(
        borderColors.invalidRed
      );
      await loginPage.assertions.isSubmitButtonEnabled(false); // it will fail due to the small bug on website
    });
  });

  test("Login inputs validation - empty inputs", async () => {
    await loginPage.clearLoginInput();
    await loginPage.clearPasswordInput();
    await loginPage.assertions.hasLoginInputBorderColor(
      borderColors.invalidRed
    );
    await loginPage.assertions.hasPasswordInputBorderColor(
      borderColors.invalidRed
    );
  });

  test("Login with valid credentials", async () => {
    await loginPage.fillForm(
      loginPageData.validCredentials.userName,
      loginPageData.validCredentials.password
    );
    await loginPage.submitForm();
    await loginPage.checkUrl(BASE_URL + "pulpit.html");
    await loginPage.checkTitle("Demobank - Bankowość Internetowa - Pulpit");
  });
});
