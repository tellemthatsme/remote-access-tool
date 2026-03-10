# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to the maintainer. All security vulnerabilities will be promptly addressed.

## Security Recommendations

1. **Change Default Password**: The default password is `karma123`. Change this immediately in production.

2. **Use HTTPS**: Configure SSL/TLS certificates for production use.

3. **Network Isolation**: Only expose the dashboard through Cloudflare Tunnel with proper access controls.

4. **Keep Dependencies Updated**: Regularly update Node.js and npm packages.

5. **Firewall Rules**: Configure Windows Firewall to only allow necessary connections.

6. **Monitor Access**: Review logs regularly for suspicious activity.

## Known Security Considerations

- Simple password authentication (no encryption)
- No HTTPS by default
- Runs with user-level permissions

For questions about security, please open an issue.
