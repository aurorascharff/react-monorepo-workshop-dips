import { expect, test } from '@playwright/test'

test('dashboard renders with seeded patient stats', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: /good morning/i }),
  ).toBeVisible()
  await expect(page.getByText(/total patients/i)).toBeVisible()
  await expect(page.getByText(/mary smith/i)).toBeVisible()
})

test('navigates to the patient list and filters patients', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /go to patient list/i }).click()

  await expect(page.getByRole('heading', { name: /^patients$/i })).toBeVisible()

  await page.getByPlaceholder(/search/i).fill('hansen')

  await expect(page.getByText(/robert hansen/i)).toBeVisible()
  await expect(page.getByText(/mary smith/i)).not.toBeVisible()
})
