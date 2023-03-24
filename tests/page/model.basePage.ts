import { expect, Page } from "@playwright/test";

export type BasePage = {
  openPage: (url: string) => Promise<void>;
  checkTitle: (expectedTitle: string) => Promise<void>;
  checkUrl: (expectedURL: string) => Promise<void>;
};

export const basePage = (page: Page): BasePage => {
  const openPage = async (url: string) => {
    await page.goto(url);
  };
  const checkTitle = async (expectedTitle: string) => {
    expect(await page.title()).toBe(expectedTitle);
  };

  const checkUrl = async (expectedURL: string) => {
    expect(page.url()).toBe(expectedURL);
  };

  return {
    openPage,
    checkTitle,
    checkUrl,
  };
};
