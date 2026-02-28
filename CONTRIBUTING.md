# Contributing

## Commit message policy

We follow [conventional commits](https://www.conventionalcommits.org/) with the
following types:

- feat, fix, chore, docs, style, refactor, test, build, ci, perf, revert

Scopes should be a folder or feature (e.g. `settings`, `theme`, `table`).
Example: `feat(settings): add email notification toggle`.

Breaking changes are indicated with `!` after the type/scope or by adding a
`BREAKING CHANGE:` footer in the body.

## Getting started

Run `pnpm install` to install dependencies and set up Husky hooks.
After that you can create a commit with:

```bash
pnpm run ac   # stages all changes, prompts for a message, and pushes
# or
git ac        # equivalent git alias
```

The commit message is validated by commitlint via a `commit-msg` Husky hook.

If you ever need to reinitialise the hooks run `pnpm run prepare`.

For situations where you don’t want to type or think about a message at
all, we provide a quick auto‑commit helper which generates a unique code.
The message is still a valid conventional commit, using `chore(auto)` as the
header.

```bash
pnpm run ac:auto      # stages everything, creates a timestamp-based message, pushes
```

Each run creates messages such as `chore(auto): 20260226123456789012` so you
can still identify a change if you look at the history.
