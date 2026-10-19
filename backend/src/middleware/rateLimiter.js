import rateLimit from 'express-rate-limit';

/**
 * Global rate limiter: limits each IP to 200 requests per 15 minutes window
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Max 200 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Trop de requêtes effectuées depuis cette adresse IP, veuillez réessayer après 15 minutes.',
  },
});

/**
 * Stricter rate limiter for sensitive operations (creation, auth)
 */
export const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Max 60 write requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Ralentissez la cadence des modifications, réessayez dans quelques secondes.',
  },
});
