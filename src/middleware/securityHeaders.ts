import { getSecurityHeadersForEnvironment } from '../config/securityHeaders';

/**
 * Express middleware to apply security headers using helmet.js
 * This integrates the security headers configuration with the existing Express architecture
 */

export const securityHeadersMiddleware = getSecurityHeadersForEnvironment();

export default securityHeadersMiddleware;
