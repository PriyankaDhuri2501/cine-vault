import mongoose from 'mongoose';

/**
 * Movie Schema
 * Stores movie information
 */
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true, // Index for search
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [600, 'Duration cannot exceed 600 minutes'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0, 'Rating must be between 0 and 10'],
      max: [10, 'Rating must be between 0 and 10'],
    },
    poster: {
      type: String,
      trim: true,
      default: '',
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better query performance
movieSchema.index({ title: 'text', description: 'text' }); // Text search index
movieSchema.index({ releaseDate: 1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ duration: 1 });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;

