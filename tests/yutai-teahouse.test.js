// @ts-check
import { test } from "@playwright/test"

// Sleep function
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

// Define the two pages for testing
let page
let page1

test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
    await page.goto("http://localhost:3000/")
    await sleep(1000)
    page1 = await browser.newPage()
    await page1.goto("http://localhost:3000/")
    await sleep(1000)
});

test("language selection", async () => {
    await page.waitForFunction(() => document.getElementById("languageSelect").querySelectorAll('option').length === 26)
    await page.waitForFunction(() => typeof localStorage.language == "string");
    await page1.waitForFunction(() => document.getElementById("languageSelect").querySelectorAll('option').length === 26)
    await page1.waitForFunction(() => typeof localStorage.language == "string");
})

test("message sending", async () => {
    await page.getByTitle("Select a language").selectOption("test")
    await page1.getByTitle("Select a language").selectOption("test")
    await sleep(30000)
    await page1.locator("#messageBox").click()
    await page1.locator("#messageBox").fill("\n 测试！\n\n")
    await page1.locator("#messageBox").press("Control+Enter")
    await sleep(1000)
    await page.waitForFunction(() => document.getElementById("output").textContent != "")
    await page1.waitForFunction(() => document.getElementById("output").textContent != "")
})