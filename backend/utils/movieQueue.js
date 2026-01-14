/**
 * Movie Queue Instance
 * Processes bulk movie insertions asynchronously
 */

import SimpleQueue from './queue.js';
import Movie from '../models/Movie.js';

// Create queue instance
const movieQueue = new SimpleQueue(
  async (batch) => {
    // Process batch of movies
    // Add addedBy field to each movie
    const moviesToInsert = batch.map(movie => ({
      ...movie,
      addedBy: movie.addedBy, // Should be set before adding to queue
    }));

    // Use insertMany for better performance
    await Movie.insertMany(moviesToInsert, {
      ordered: false, // Continue inserting even if some fail
    });
  },
  10, // Batch size: process 10 movies at a time
  50  // Delay: 50ms between batches
);

export default movieQueue;
