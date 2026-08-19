import { expect, test } from '@playwright/test'

test.fixme('critical authenticated dashboard journey', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(
    page.getByRole('heading', { name: /sign in to continue/i }),
  ).toBeVisible()

  // Authenticate through the user-facing login flow.
  // Confirm authenticated transaction data is available.
  // Exercise one transaction discovery and detail interaction.
  // Sign out, revisit the protected route, and prove access is gone.
})
