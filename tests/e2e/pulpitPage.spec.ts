import { test, Page } from "@playwright/test";
import { createLoginPage } from "../page/model.loginPage";
import { createPulpitPage } from "../page/model.pulpitPage";
import { validCredentials } from "../fixtures/data.loginPage";
import * as pulpitPageData from "../fixtures/data.pulpitPage";
import { borderColors, activeTextColor } from "../fixtures/data.general";

const BASE_URL = "https://demo-bank.vercel.app/";

test.describe("Pulpit base validation", () => {
  let page: Page;
  let loginPage: ReturnType<typeof createLoginPage>;
  let pulpitPage: ReturnType<typeof createPulpitPage>;

  test.beforeEach(async ({ page }) => {
    loginPage = createLoginPage(page);
    pulpitPage = createPulpitPage(page);
    await loginPage.openPage(BASE_URL);
    await loginPage.fillForm(
      validCredentials.userName,
      validCredentials.password
    );
    await loginPage.submitForm();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Static elements validation after user login", async () => {
    await pulpitPage.assertions.hasAccountName(pulpitPageData.user.name);
    await pulpitPage.assertions.hasAccountNumber(
      pulpitPageData.user.accountNumber
    );
    await pulpitPage.checkUrl(BASE_URL + "pulpit.html");
    await pulpitPage.checkTitle(pulpitPageData.pageTitles.mój_pulpit);
  });

  test("Session time displayed", async () => {
    await pulpitPage.assertions.hasSessionTime();
  });

  test("Balance is displayed", async () => {
    await pulpitPage.assertions.hasBalance();
  });

  test("Side menu is displayed - fast payments", async () => {
    await pulpitPage.clickFastPaymentSideBar();
    await pulpitPage.checkUrl(
      BASE_URL + pulpitPageData.staticPageUrls.szybki_przelew
    );
    await pulpitPage.checkTitle(pulpitPageData.pageTitles.szybki_przelew);
    await pulpitPage.assertions.hasFastPaymentSideBarActiveTextColor(
      activeTextColor
    ); // it will fail due to the small bug on website
  });

  test("Side menu is displayed - main dashboard", async () => {
    await pulpitPage.clickMainDashboardSideBar();
    await pulpitPage.checkUrl(
      BASE_URL + pulpitPageData.staticPageUrls.mój_pulpit
    );
    await pulpitPage.checkTitle(pulpitPageData.pageTitles.mój_pulpit);
    await pulpitPage.assertions.hasMainDashboardSideBarActiveTextColor(
      activeTextColor
    );
  });

  test("Side menu is displayed - personal accounts", async () => {
    await pulpitPage.clickPersonalAccountsSideBar();
    await pulpitPage.checkUrl(
      BASE_URL + pulpitPageData.staticPageUrls.konta_osobiste
    );
    await pulpitPage.checkTitle(pulpitPageData.pageTitles.konta_osobiste);
    await pulpitPage.assertions.hasPersonalAccountsSideBarActiveTextColor(
      activeTextColor
    );
  });
});
