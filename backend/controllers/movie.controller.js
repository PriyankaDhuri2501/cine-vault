import { NotFoundError, ValidationError } from '../utils/errors.js';
import { asyncHandler } from '../utils/helpers.js';
import Movie from '../models/Movie.js';

/**
 * @route   GET /api/movies
 * @desc    Get all movies with pagination
 * @access  Public
 */
export const getAllMovies = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const movies = await Movie.find()
    .populate('addedBy', 'username email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Movie.countDocuments();

  res.status(200).json({
    status: 'success',
    results: movies.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: {
      movies,
    },
  });
});

/**
 * @route   GET /api/movies/:id
 * @desc    Get single movie by ID
 * @access  Public
 */
export const getMovieById = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id).populate(
    'addedBy',
    'username email'
  );

  if (!movie) {
    return next(new NotFoundError('Movie not found'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

/**
 * @route   POST /api/movies
 * @desc    Create a new movie (Admin only)
 * @access  Private/Admin
 */
export const createMovie = asyncHandler(async (req, res, next) => {
  // Add the admin user ID to the movie
  req.body.addedBy = req.user._id;

  const movie = await Movie.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Movie created successfully',
    data: {
      movie,
    },
  });
});

/**
 * @route   PUT /api/movies/:id
 * @desc    Update a movie (Admin only)
 * @access  Private/Admin
 */
export const updateMovie = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return next(new NotFoundError('Movie not found'));
  }

  // Update movie fields
  Object.keys(req.body).forEach((key) => {
    movie[key] = req.body[key];
  });

  await movie.save();

  res.status(200).json({
    status: 'success',
    message: 'Movie updated successfully',
    data: {
      movie,
    },
  });
});

/**
 * @route   DELETE /api/movies/:id
 * @desc    Delete a movie (Admin only)
 * @access  Private/Admin
 */
export const deleteMovie = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return next(new NotFoundError('Movie not found'));
  }

  await Movie.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Movie deleted successfully',
    data: null,
  });
});

