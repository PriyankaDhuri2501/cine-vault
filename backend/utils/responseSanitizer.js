/**
 * Response Sanitizer
 * Removes sensitive data and ensures secure API responses
 */

/**
 * Sanitize movie data
 * Removes internal fields and ensures safe response
 */
export const sanitizeMovie = (movie) => {
  if (!movie) return null;

  const movieObj = movie.toObject ? movie.toObject() : movie;

  // Remove sensitive/internal fields
  const {
    __v,
    // Keep other fields as they're safe
    ...sanitized
  } = movieObj;

  return sanitized;
};

/**
 * Sanitize array of movies
 */
export const sanitizeMovies = (movies) => {
  if (!Array.isArray(movies)) return [];
  return movies.map(movie => sanitizeMovie(movie));
};

/**
 * Sanitize user data
 * Removes password and sensitive fields
 */
export const sanitizeUser = (user) => {
  if (!user) return null;

  const userObj = user.toObject ? user.toObject() : user;

  const {
    password,
    __v,
    ...sanitized
  } = userObj;

  return sanitized;
};

/**
 * Sanitize error response
 * Don't expose stack traces or internal errors in production
 */
export const sanitizeError = (error, isDevelopment = false) => {
  const sanitized = {
    message: error.message || 'An error occurred',
    status: error.status || 'error',
    statusCode: error.statusCode || 500,
  };

  // Only include stack trace in development
  if (isDevelopment && error.stack) {
    sanitized.stack = error.stack;
  }

  return sanitized;
};
