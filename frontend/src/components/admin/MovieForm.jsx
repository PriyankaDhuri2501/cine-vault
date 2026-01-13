import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  InputAdornment,
} from '@mui/material';
import { Movie as MovieIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';

const MovieForm = ({ movie = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    duration: '',
    rating: '',
    poster: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (movie) {
      // Format date for input (YYYY-MM-DD)
      const releaseDate = movie.releaseDate
        ? new Date(movie.releaseDate).toISOString().split('T')[0]
        : '';
      
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        releaseDate: releaseDate,
        duration: movie.duration?.toString() || '',
        rating: movie.rating?.toString() || '',
        poster: movie.poster || '',
      });
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }

    if (!formData.releaseDate) {
      newErrors.releaseDate = 'Release date is required';
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    } else {
      const duration = parseInt(formData.duration);
      if (isNaN(duration) || duration < 1 || duration > 600) {
        newErrors.duration = 'Duration must be between 1 and 600 minutes';
      }
    }

    if (!formData.rating) {
      newErrors.rating = 'Rating is required';
    } else {
      const rating = parseFloat(formData.rating);
      if (isNaN(rating) || rating < 0 || rating > 10) {
        newErrors.rating = 'Rating must be between 0 and 10';
      }
    }

    if (formData.poster && !isValidUrl(formData.poster)) {
      newErrors.poster = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (validate()) {
      onSubmit({
        ...formData,
        duration: parseInt(formData.duration),
        rating: parseFloat(formData.rating),
      });
    } else {
      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Movie Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            required
            multiline
            rows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Release Date"
            name="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={handleChange}
            error={!!errors.releaseDate}
            helperText={errors.releaseDate}
            required
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            error={!!errors.duration}
            helperText={errors.duration}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Rating (0-10)"
            name="rating"
            type="number"
            value={formData.rating}
            onChange={handleChange}
            error={!!errors.rating}
            helperText={errors.rating}
            required
            inputProps={{ min: 0, max: 10, step: 0.1 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Poster URL (optional)"
            name="poster"
            value={formData.poster}
            onChange={handleChange}
            error={!!errors.poster}
            helperText={errors.poster || 'Enter a valid image URL'}
            placeholder="https://example.com/poster.jpg"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            {onCancel && (
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'text.primary',
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={<MovieIcon />}
              sx={{
                background: 'linear-gradient(45deg, #e50914, #f40612)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #f40612, #b20710)',
                },
                '&:disabled': {
                  background: 'rgba(229, 9, 20, 0.5)',
                },
              }}
            >
              {loading ? 'Saving...' : movie ? 'Update Movie' : 'Add Movie'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieForm;
