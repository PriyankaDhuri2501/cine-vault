import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Movie as MovieIcon,
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

const MovieForm = ({ movie = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    duration: '',
    rating: '',
    poster: '',
    trailerId: '',
    streamingLinks: [],
  });
  const [errors, setErrors] = useState({});
  const [streamingLinkErrors, setStreamingLinkErrors] = useState({});

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
        trailerId: movie.trailerId || '',
        streamingLinks: movie.streamingLinks || [],
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

    // Validate trailer ID (must be 11 characters if provided)
    if (formData.trailerId && !/^[a-zA-Z0-9_-]{11}$/.test(formData.trailerId)) {
      newErrors.trailerId = 'Trailer ID must be a valid YouTube video ID (11 characters)';
    }

    // Validate streaming links
    const linkErrors = {};
    formData.streamingLinks.forEach((link, index) => {
      if (!link.platform?.trim()) {
        linkErrors[`platform_${index}`] = 'Platform name is required';
      }
      if (!link.url?.trim()) {
        linkErrors[`url_${index}`] = 'URL is required';
      } else if (!isValidUrl(link.url)) {
        linkErrors[`url_${index}`] = 'Please enter a valid URL';
      }
    });
    setStreamingLinkErrors(linkErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(linkErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAddStreamingLink = () => {
    setFormData((prev) => ({
      ...prev,
      streamingLinks: [...prev.streamingLinks, { platform: '', url: '' }],
    }));
  };

  const handleRemoveStreamingLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      streamingLinks: prev.streamingLinks.filter((_, i) => i !== index),
    }));
    // Clear errors for removed link
    const newErrors = { ...streamingLinkErrors };
    delete newErrors[`platform_${index}`];
    delete newErrors[`url_${index}`];
    // Reindex remaining errors
    const reindexedErrors = {};
    Object.keys(newErrors).forEach((key) => {
      const [type, idx] = key.split('_');
      const idxNum = parseInt(idx);
      if (idxNum > index) {
        reindexedErrors[`${type}_${idxNum - 1}`] = newErrors[key];
      } else if (idxNum < index) {
        reindexedErrors[key] = newErrors[key];
      }
    });
    setStreamingLinkErrors(reindexedErrors);
  };

  const handleStreamingLinkChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      streamingLinks: prev.streamingLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
    // Clear error for this field
    const errorKey = `${field}_${index}`;
    if (streamingLinkErrors[errorKey]) {
      setStreamingLinkErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
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
        streamingLinks: formData.streamingLinks.filter(
          (link) => link.platform?.trim() && link.url?.trim()
        ),
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="YouTube Trailer ID (optional)"
            name="trailerId"
            value={formData.trailerId}
            onChange={handleChange}
            error={!!errors.trailerId}
            helperText={errors.trailerId || 'Enter YouTube video ID only (11 characters, e.g., dQw4w9WgXcQ)'}
            placeholder="dQw4w9WgXcQ"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlayArrowIcon sx={{ color: 'text.secondary' }} />
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

        <Grid item xs={12}>
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkIcon sx={{ fontSize: 20 }} />
              Streaming Links (optional)
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddStreamingLink}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(229, 9, 20, 0.1)',
                },
              }}
            >
              Add Link
            </Button>
          </Box>

          {formData.streamingLinks.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
              No streaming links added. Click "Add Link" to add platforms like Netflix, Amazon Prime, etc.
            </Typography>
          )}

          {formData.streamingLinks.map((link, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Platform Name"
                  value={link.platform}
                  onChange={(e) => handleStreamingLinkChange(index, 'platform', e.target.value)}
                  error={!!streamingLinkErrors[`platform_${index}`]}
                  helperText={streamingLinkErrors[`platform_${index}`]}
                  placeholder="e.g., Netflix, Amazon Prime"
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
                  label="Streaming URL"
                  value={link.url}
                  onChange={(e) => handleStreamingLinkChange(index, 'url', e.target.value)}
                  error={!!streamingLinkErrors[`url_${index}`]}
                  helperText={streamingLinkErrors[`url_${index}`] || 'Enter full URL'}
                  placeholder="https://www.netflix.com/title/..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveStreamingLink(index)}
                    sx={{
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.2)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ))}
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
