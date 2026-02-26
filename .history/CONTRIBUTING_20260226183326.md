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
