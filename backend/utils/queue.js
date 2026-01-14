/**
 * Simple Queue System for Bulk Movie Insertion
 * 
 * This queue processes movie insertions asynchronously to avoid blocking
 * the API response when adding multiple movies at once.
 * 
 * How it works:
 * 1. Movies are added to the queue
 * 2. Queue processes items in batches
 * 3. Returns immediately to user
 * 4. Processes in background
 */

class SimpleQueue {
  constructor(processor, batchSize = 10, delay = 100) {
    this.queue = [];
    this.processing = false;
    this.processor = processor; // Function to process items
    this.batchSize = batchSize; // Process N items at a time
    this.delay = delay; // Delay between batches (ms)
    this.stats = {
      total: 0,
      processed: 0,
      failed: 0,
      errors: [],
    };
  }

  /**
   * Add items to queue
   * @param {Array} items - Items to add to queue
   */
  enqueue(items) {
    if (!Array.isArray(items)) {
      items = [items];
    }
    this.queue.push(...items);
    this.stats.total += items.length;
    this.process();
  }

  /**
   * Process queue items in batches
   */
  async process() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);
      
      try {
        await this.processor(batch);
        this.stats.processed += batch.length;
      } catch (error) {
        this.stats.failed += batch.length;
        this.stats.errors.push({
          batch,
          error: error.message,
        });
        console.error('Queue processing error:', error);
      }

      // Small delay between batches to avoid overwhelming the database
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
    }

    this.processing = false;
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      stats: { ...this.stats },
    };
  }

  /**
   * Clear queue and reset stats
   */
  clear() {
    this.queue = [];
    this.stats = {
      total: 0,
      processed: 0,
      failed: 0,
      errors: [],
    };
  }
}

export default SimpleQueue;
