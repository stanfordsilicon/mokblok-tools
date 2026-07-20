## Submitting Changes

Rather than directly making changes, please submit a pull request (PR) to the `main` branch. This allows for code review, tests to run, and discussion before changes are merged.

### Pull Requests

There is a pull request template in `.github/pull_request_template.md` that will be automatically applied to new PRs. You don't need to write long prose, just summarize the changes and demonstrate how you tested them.

Screenshots are especially helpful for UI changes. To help the reviewer, you can also include URLs (to localhost is fine) so they can open what you were looking at in their own browser.

## Visual Screenshot Tests

MokBlok uses Playwright screenshot tests to detect unintended UI regressions.

When a pull request changes the appearance of the application, the screenshot tests may fail. This does **not** necessarily indicate a bug—it may simply mean the expected screenshots need to be updated.

### Running locally

You can generate screenshots locally to check how they look on your computer.

```bash
npm run screenshots:update
```

If you make changes locally and want to see how the screenshots change, you can run the tests locally (`npm run screenshots:test`) and check the generated screenshots


Please don't commit the generated screenshots directly (your device may have different render options than the CI environment).

### Updating screenshots

To update the expected screenshots, instead of using the command, have the automation workflow update them for you. This ensures that the screenshots are generated in a consistent environment.

Upload your PR and tag it with `run-auto-updates` to run the automation workflow to update screenshots, some translations, and lint style.

Review the updates to ensure they reflect the intended design, then commit the changed screenshot files as part of your pull request.
