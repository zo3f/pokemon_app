# Content Security Policy: unsafe-inline Explanation

## Why `unsafe-inline` is Currently Required

The application currently uses `'unsafe-inline'` in the Content Security Policy (CSP) for `scriptSrc` and `styleSrc`. This document explains why and provides alternatives.

## Current Requirements

### 1. Babel Standalone
- **Purpose**: Compiles JSX syntax in the browser without a build step
- **Requirement**: Needs `'unsafe-inline'` for `scriptSrc` because it dynamically compiles and executes JSX code
- **Location**: Used in `public/index.html` and `public/app.bundle.js`

### 2. EmulatorJS
- **Purpose**: Loads and initializes the GBA emulator
- **Requirement**: May require inline scripts for initialization
- **Location**: Used in `public/emulator.html` and `public/emulator-init.js`

## Security Implications

`'unsafe-inline'` allows inline `<script>` and `<style>` tags, which can be a security risk if:
- User-generated content is rendered without sanitization
- Third-party scripts are injected
- XSS vulnerabilities exist in the application

## Current Mitigations

1. **Input Sanitization**: All user inputs are sanitized before processing
2. **No User-Generated Content**: The app doesn't render user-provided HTML/JS
3. **React Auto-Escaping**: React automatically escapes content, preventing XSS
4. **Strict Validation**: ROM filenames are strictly validated
5. **CSP Other Directives**: Other CSP directives are strict (no `unsafe-eval`, restricted sources)

## Alternatives (Future Improvements)

### Option 1: Use CSP Nonces
```javascript
// Server-side: Generate nonce per request
const nonce = crypto.randomBytes(16).toString('base64');

// In HTML:
<script nonce="${nonce}">
// In CSP:
scriptSrc: ["'self'", `'nonce-${nonce}'`, ...]
```
**Pros**: Strong security, no unsafe-inline  
**Cons**: Requires server-side rendering or template engine

### Option 2: Move to Build Process
- Use Webpack, Vite, or similar to pre-compile JSX
- Bundle all scripts into external files
- Remove Babel Standalone dependency
**Pros**: Better performance, no unsafe-inline needed  
**Cons**: Requires build step, more complex setup

### Option 3: Use Strict Nonce + External Scripts Only
- Move all inline code to external `.js` files
- Use nonces for any remaining inline scripts
- Remove Babel Standalone, use pre-compiled React
**Pros**: Maximum security  
**Cons**: Requires significant refactoring

## Recommendation

For this educational project:
- **Current approach is acceptable** given the constraints
- The security risk is **mitigated** by other security measures
- **Future improvement**: Consider moving to a build process (Option 2) for production

## Testing

To verify CSP is working:
1. Open browser DevTools → Console
2. Check for CSP violation warnings
3. Test that EmulatorJS still loads correctly
4. Verify ROM loading works

## References

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP: Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Babel Standalone Documentation](https://babeljs.io/docs/en/babel-standalone)
