import rateLimit from 'express-rate-limit';

// 5 requests per 10 minutes per IP
export const signupLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many signup attempts. Please try again later.',
  },
});


