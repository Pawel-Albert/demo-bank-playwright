import { basePage, BasePage } from "./model.basePage";
import { expect, Page } from "@playwright/test";

const ACCOUNT_NAME = '[data-testid="user-name"]';
const ACCOUNT_NUMBER = "#account_number";
const SESSION_TIME = "#session_time";
const MAIN_NAV_BAR = '".nav-main > ul"';
const BALANCE_INT_PART = "#money_value";
const SIDE_BAR_ELEMENTS = {
  mój_pulptit: "#pulpit_btn",
  szybki_przelew: '.nav-main [href="quick_payment.html"]',
  konta_osobiste: '.nav-main [href="konta.html"]',
};

type PulpitPage = BasePage & {
  clickFastPaymentSideBar: () => Promise<void>;
  clickMainDashboardSideBar: () => Promise<void>;
  clickPersonalAccountsSideBar: () => Promise<void>;
  assertions: {
    hasAccountName: (account_name: string) => Promise<void>;
    hasAccountNumber: (account_number: string) => Promise<void>;
    hasMainNavBar: () => Promise<void>;
    hasSessionTime: () => Promise<void>;
    hasBalance: () => Promise<void>;
    hasFastPaymentSideBarActiveTextColor: (color: string) => Promise<void>;
    hasMainDashboardSideBarActiveTextColor: (color: string) => Promise<void>;
    hasPersonalAccountsSideBarActiveTextColor: (color: string) => Promise<void>;
  };
};

export const createPulpitPage = (page: Page): PulpitPage => {
  const base = basePage(page);

  const clickFastPaymentSideBar = async () => {
    await page.click(SIDE_BAR_ELEMENTS.szybki_przelew);
  };

  const clickMainDashboardSideBar = async () => {
    await page.click(SIDE_BAR_ELEMENTS.mój_pulptit);
  };

  const clickPersonalAccountsSideBar = async () => {
    await page.click(SIDE_BAR_ELEMENTS.konta_osobiste);
  };

  const assertions = {
    hasAccountName: async (account_name: string) => {
      expect(await page.textContent(ACCOUNT_NAME)).toBe(account_name);
    },
    hasAccountNumber: async (account_number: string) => {
      expect(await page.textContent(ACCOUNT_NUMBER)).toBe(account_number);
    },
    hasMainNavBar: async () => {
      expect(await page.isVisible(MAIN_NAV_BAR)).toBeTruthy();
    },
    hasSessionTime: async () => {
      await page.waitForSelector(SESSION_TIME, { state: "visible" });
      expect(await page.isVisible(SESSION_TIME)).toBeTruthy();
    },
    hasBalance: async () => {
      const balanceText = (await page.textContent(BALANCE_INT_PART)) || "";
      const parsedValue = parseFloat(balanceText.replace(/[^0-9.-]+/g, ""));
      expect(typeof parsedValue).toBe("number");
    },
    hasFastPaymentSideBarActiveTextColor: async (color: string) => {
      await page.waitForSelector(SIDE_BAR_ELEMENTS.szybki_przelew, {
        state: "visible",
      });
      expect(
        await page.$eval(SIDE_BAR_ELEMENTS.szybki_przelew, (el) =>
          getComputedStyle(el).getPropertyValue("color")
        )
      ).toBe(color);
    },
    hasMainDashboardSideBarActiveTextColor: async (color: string) => {
      await page.waitForSelector(SIDE_BAR_ELEMENTS.mój_pulptit, {
        state: "visible",
      });
      expect(
        await page.$eval(SIDE_BAR_ELEMENTS.mój_pulptit, (el) =>
          getComputedStyle(el).getPropertyValue("color")
        )
      ).toBe(color);
    },
    hasPersonalAccountsSideBarActiveTextColor: async (color: string) => {
      await page.waitForSelector(SIDE_BAR_ELEMENTS.konta_osobiste, {
        state: "visible",
      });
      expect(
        await page.$eval(SIDE_BAR_ELEMENTS.konta_osobiste, (el) =>
          getComputedStyle(el).getPropertyValue("color")
        )
      ).toBe(color);
    },
  };

  return {
    ...base,
    clickFastPaymentSideBar,
    clickMainDashboardSideBar,
    clickPersonalAccountsSideBar,
    assertions,
  };
};
