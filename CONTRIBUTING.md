# AsteriaGL Contribution Guide

## Getting Started

1. Clone the repository locally:

Using SSH (preferred):

```bash
git clone git@github.com:Andamio-Platform/andamio-platform.git
cd andamio-platform
```

Or with HTTPS:

```bash
git clone https://github.com/Andamio-Platform/andamio-platform.git
cd andamio-platform
```

2. Create a new branch from `dev`:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/issue-number-description
```

Name your branch following the pattern: `feature/issue-number-description` or `fix/issue-number-description`

## Development Workflow

### Linking Issues to Commits

1. Reference issues in commit messages using one of these keywords followed by the issue number:

- `closes #123`
- `fixes #123`
- `resolves #123`

Example commit:

```bash
git commit -m "Add user authentication flow
- Implement JWT token validation
- Add refresh token mechanism
fixes #123"
```

2. For commits addressing multiple issues:

```bash
git commit -m "Refactor database queries
- Optimize user lookup
- Add query caching
fixes #123, closes #124"
```

### Creating Pull Requests

1. Before submitting:

```bash
git fetch origin dev
git rebase origin/dev
```

2. Push your branch:

```bash
git push origin feature/issue-number-description
```

3. Create a Pull Request:
   - Base branch: `dev`
   - Title format: `[#Issue-Number] Brief description`
   - Link the issue in PR description using `Closes #123`
   - Fill out the PR template if provided

### PR Requirements

- All commits must reference related issues
- PRs must target the `dev` branch
- Keep commits focused and atomic
- Rebase on `dev` before requesting review
- Confirm that changes build locally with `npm run check`
- Address all review comments before merge

### Project Board Integration

If the issue is part of a project:

1. Move the issue to "In Progress" when you start working
2. PR creation automatically moves it to "In Review"
3. Merging moves it to "Done"

## Help and Support

For questions or issues with the contribution process:

1. Comment on the relevant issue
2. Contact James
