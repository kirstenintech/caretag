# Contributing to CareTag

Thank you for your interest in contributing to CareTag! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the behavior
- Expected vs. actual behavior
- Screenshots (if applicable)
- Environment details (browser, OS, etc.)

### Suggesting Enhancements

Feature requests are welcome! Please create an issue that includes:
- A clear description of the proposed feature
- Use cases and benefits
- Any implementation ideas you may have

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following the code style guidelines below
4. **Test your changes**: Ensure `npm run lint` and `npm run build` pass
5. **Commit your changes** with clear, descriptive commit messages
6. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/caretag.git
cd caretag

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Appwrite credentials

# Start development server
npm run dev
```

## Code Style Guidelines

### JavaScript/React

- Use **functional components** with hooks
- Follow **React hooks rules** (no conditional hooks)
- Use **meaningful variable names** (avoid single letters except in loops/maps)
- Add **PropTypes** or TypeScript types for component props
- Keep components **small and focused** (single responsibility)
- Extract **reusable logic** into custom hooks

### Naming Conventions

- **Components**: PascalCase (`SymbolCard.jsx`)
- **Hooks**: camelCase starting with `use` (`useFileValidation`)
- **Utils/Services**: camelCase (`uploadService.js`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

### File Organization

```
src/
├── components/     # Reusable UI components
├── pages/          # Page-level components
├── services/       # API and business logic
├── utils/          # Helper functions
├── theme/          # MUI theme configuration
└── lib/            # Third-party integrations (Appwrite)
```

### Code Quality

- **Run linter**: `npm run lint` (must pass with zero errors/warnings)
- **No console.logs** in production code (use proper error handling)
- **Add comments** for complex logic
- **Handle errors** gracefully with user-friendly messages
- **Accessibility**: Use semantic HTML and ARIA labels

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add symbol filtering by category
fix: resolve upload error for large images
docs: update README with setup instructions
style: format code with Prettier
refactor: extract image validation logic
test: add tests for symbol detection
chore: update dependencies
```

## Testing

Before submitting a PR:

```bash
# Run linter
npm run lint

# Build project
npm run build

# Test locally
npm run dev
```

## Appwrite Setup for Development

1. Create an Appwrite Cloud account at https://cloud.appwrite.io
2. Create a new project
3. Set up Database with `care_symbols` collection
4. Create Storage buckets for uploads and model
5. Deploy the inference function (see `functions/care-symbols-infer/README.md`)
6. Copy IDs to `.env` file

## Questions?

Feel free to open an issue for any questions or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
