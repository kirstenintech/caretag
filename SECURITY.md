# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of CareTag seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via:
- **GitHub Security Advisories**: Use the "Security" tab on this repository to create a private security advisory
- **Alternative**: Contact me via LinkedIn at https://www.linkedin.com/in/kirstenintech/

You should receive a response within 48 hours.

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Preferred Languages

We prefer all communications to be in English.

## Policy

We follow the principle of [Responsible Disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure).

## Security Best Practices for Users

When using CareTag:

1. **Environment Variables**: Never commit your `.env` file or expose your Appwrite credentials
2. **API Keys**: Use Appwrite's security features to restrict API key permissions
3. **File Uploads**: The app validates file types and sizes, but always verify uploaded content
4. **HTTPS**: Always access the application over HTTPS in production
5. **Updates**: Keep dependencies up to date using Dependabot

## Secure Appwrite Configuration

1. Set appropriate permissions on your Appwrite Database collections
2. Use separate API keys for development and production
3. Enable rate limiting on your Appwrite Function
4. Restrict Storage bucket permissions appropriately
5. Use Appwrite's built-in security features (CORS, rate limiting, etc.)

## Third-Party Dependencies

We use Dependabot to automatically check for vulnerable dependencies. Security updates are prioritized and applied promptly.

## Acknowledgments

We appreciate the security research community's efforts in responsibly disclosing vulnerabilities.
