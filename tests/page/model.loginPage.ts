import { basePage, BasePage } from "./model.basePage";
import { expect, Page } from "@playwright/test";

const LOGIN_INPUT = '[data-testid="login-input"]';
const PASSWORD_INPUT = '[data-testid="password-input"]';
const LOGIN_SUBMIT_BUTTON = '[data-testid="login-button"]';
const LOGIN_TOOLTIP = "[data-id=login_id] + div .login-tooltip i";
const PASSWORD_TOOLTIP = ".login-tooltip-wrapper  [data-id=login_password] i";
const TOOLTIP_TEXT = ".ui-tooltip-content";

type LoginPage = BasePage & {
  fillForm: (username: string, password: string) => Promise<void>;
  submitForm: () => Promise<void>;
  clearPasswordInput: () => Promise<void>;
  clearLoginInput: () => Promise<void>;
  assertions: {
    hasUsernameValue: (username: string) => Promise<void>;
    hasPasswordValue: (password: string) => Promise<void>;
    isSubmitButtonEnabled: (isEnabled: boolean) => Promise<void>;
    hasLoginInputBorderColor: (expectedColor: string) => Promise<void>;
    hasPasswordInputBorderColor: (expectedColor: string) => Promise<void>;
    hasLoginTooltipText: (expectedColor: string) => Promise<void>;
    hasPasswordTooltipText: (expectedColor: string) => Promise<void>;
  };
};

export const createLoginPage = (page: Page): LoginPage => {
  const base = basePage(page);
  const fillForm = async (username: string, password: string) => {
    await page.fill(LOGIN_INPUT, username);
    await page.fill(PASSWORD_INPUT, password);
  };
  const submitForm = async () => {
    await page.click(LOGIN_SUBMIT_BUTTON);
  };

  const clearPasswordInput = async () => {
    await page.fill(PASSWORD_INPUT, "");
  };
  const clearLoginInput = async () => {
    await page.fill(LOGIN_INPUT, "");
  };

  const assertions = {
    hasUsernameValue: async (username: string) => {
      expect(await page.inputValue(LOGIN_INPUT)).toBe(username);
    },
    hasPasswordValue: async (password: string) => {
      expect(await page.inputValue(PASSWORD_INPUT)).toBe(password);
    },
    isSubmitButtonEnabled: async (isEnabled: boolean) => {
      expect(await page.isEnabled(LOGIN_SUBMIT_BUTTON)).toBe(isEnabled);
    },
    hasLoginInputBorderColor: async (expectedColor: string) => {
      await page.click("body");
      await page.waitForTimeout(200);
      expect(
        await page.$eval(LOGIN_INPUT, (el) =>
          getComputedStyle(el).getPropertyValue("border-color")
        )
      ).toBe(expectedColor);
    },
    hasPasswordInputBorderColor: async (expectedColor: string) => {
      await page.click("body");
      await page.waitForTimeout(200);
      expect(
        await page.$eval(PASSWORD_INPUT, (el) =>
          getComputedStyle(el).getPropertyValue("border-color")
        )
      ).toBe(expectedColor);
    },
    hasLoginTooltipText: async (expectedText: string) => {
      await page.hover(LOGIN_TOOLTIP);
      await page.waitForSelector(TOOLTIP_TEXT, { timeout: 500 });
      const tooltipText = await page.locator(TOOLTIP_TEXT).innerText();
      expect(tooltipText).toBe(expectedText);
    },
    hasPasswordTooltipText: async (expectedText: string) => {
      await page.hover(PASSWORD_TOOLTIP);
      await page.waitForSelector(TOOLTIP_TEXT, { timeout: 500 });
      const tooltipText = await page.locator(TOOLTIP_TEXT).innerText();
      expect(tooltipText).toBe(expectedText);
    },
  };

  return {
    ...base,
    fillForm,
    submitForm,
    clearPasswordInput,
    clearLoginInput,
    assertions,
  };
};
