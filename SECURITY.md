# Security Documentation

This document outlines the security measures implemented in the Pokémon Bulbasaur Fan Site application.

## Security Features

### 1. HTTP Security Headers (Helmet.js)

- **Content Security Policy (CSP)**: Restricts resource loading to prevent XSS attacks
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Strict-Transport-Security (HSTS)**: Enforces HTTPS in production
- **X-XSS-Protection**: Browser XSS filter
- **Referrer-Policy**: Controls referrer information
- **DNS Prefetch Control**: Prevents DNS prefetching

### 2. Input Validation & Sanitization

- **ROM Name Validation**: 
  - Type checking (string)
  - Length validation (0-255 characters)
  - Path traversal prevention (`..`, `/`, `\`)
  - Character whitelist (alphanumeric, spaces, hyphens, underscores, dots)
  - File extension validation (`.gba` only)

- **Request Body Validation**:
  - Object depth limiting (max 5 levels)
  - Array rejection for POST bodies
  - String sanitization (removes script tags, javascript: protocol, event handlers)

### 3. Rate Limiting

- **API Routes**: 100 requests per 15 minutes per IP
- **POST Endpoints**: 20 requests per 15 minutes per IP (stricter)
- **IP-based tracking**: Uses request IP for rate limit keys

### 4. CORS Configuration

- **Restricted Origins**: Only allows localhost and 127.0.0.1 in development
- **Allowed Methods**: GET and POST only
- **Configurable**: Can be set via environment variables

### 5. Path Traversal Prevention

- **Filename Sanitization**: Uses `path.basename()` to remove directory components
- **Path Resolution**: Validates resolved paths against base directory
- **URL Validation**: Ensures ROM URLs start with `/roms/`

### 6. XSS Prevention

- **React Auto-escaping**: React automatically escapes content
- **Explicit Sanitization**: Additional sanitization in components
- **URL Sanitization**: Removes `javascript:`, event handlers from URLs
- **Iframe Sandbox**: Uses `sandbox` attribute for iframe security

### 7. Request Size Limits

- **Body Parser Limits**: 10MB maximum request size
- **Parameter Limits**: Maximum 100 parameters per request
- **Content-Length Validation**: Checks Content-Length header before processing

### 8. Error Handling

- **Error Sanitization**: Error messages don't leak internal details in production
- **Structured Logging**: Security events logged to database
- **Graceful Degradation**: Failures don't expose system information

### 9. Database Security

- **Parameterized Queries**: SQLite uses parameterized queries (prevents SQL injection)
- **Input Validation**: All inputs validated before database operations
- **Error Handling**: Database errors don't expose schema information

### 10. File System Security

- **Directory Validation**: Validates ROM directory paths
- **File Type Filtering**: Only `.gba` files are served
- **Path Resolution**: Uses `path.resolve()` to prevent directory traversal

## Security Best Practices Applied

1. **OWASP Top 10 Compliance**:
   - ✅ Injection Prevention (SQL, XSS, Path Traversal)
   - ✅ Broken Authentication (N/A - no auth required)
   - ✅ Sensitive Data Exposure (No sensitive data stored)
   - ✅ XML External Entities (N/A)
   - ✅ Broken Access Control (Path validation)
   - ✅ Security Misconfiguration (Helmet, secure headers)
   - ✅ XSS Prevention (Multiple layers)
   - ✅ Insecure Deserialization (JSON validation)
   - ✅ Using Components with Known Vulnerabilities (Regular updates)
   - ✅ Insufficient Logging (Security event logging)

2. **Defense in Depth**: Multiple layers of security
3. **Principle of Least Privilege**: Minimal required permissions
4. **Fail Secure**: Errors don't expose information
5. **Input Validation**: All inputs validated and sanitized
6. **Output Encoding**: React auto-escaping + explicit sanitization

## Security Headers Checklist

- ✅ Content-Security-Policy
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Strict-Transport-Security (production)
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Permissions-Policy
- ✅ Cross-Origin-Embedder-Policy
- ✅ Cross-Origin-Resource-Policy
- ✅ Cross-Origin-Opener-Policy

## Recommendations for Production

1. **Use HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Store sensitive config in environment variables
3. **Regular Updates**: Keep dependencies updated
4. **Security Audits**: Regular security audits and penetration testing
5. **Monitoring**: Implement security monitoring and alerting
6. **CSP Nonces**: Consider using CSP nonces instead of `unsafe-inline`
7. **Rate Limiting**: Adjust rate limits based on usage patterns
8. **Logging**: Implement comprehensive security logging

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:
1. Do not open a public issue
2. Contact the maintainer privately
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before disclosure

