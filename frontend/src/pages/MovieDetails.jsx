import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Link,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Star as StarIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import ConfirmationModal from '../components/common/ConfirmationModal';
import TrailerModal from '../components/movies/TrailerModal';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addRecentlyViewed } = useWatchlist();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/movies/${id}`);
        const loadedMovie = response.data.data.movie;
        setMovie(loadedMovie);
        addRecentlyViewed(loadedMovie);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load movie');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/movies/${id}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete movie');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleToggleWatchlist = () => {
    if (!movie?._id) return;
    if (isInWatchlist(movie._id)) {
      removeFromWatchlist(movie._id);
    } else {
      addToWatchlist(movie);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!movie) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Back
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            {movie.poster ? (
              <Box
                component="img"
                src={movie.poster}
                alt={movie.title}
                sx={{ width: '100%', display: 'block' }}
              />
            ) : (
              <Box
                sx={{
                  height: 360,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                No Poster
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {movie.title}
            </Typography>
            <Chip
              icon={<StarIcon sx={{ color: 'secondary.main' }} />}
              label={`${movie.rating?.toFixed(1) ?? 'N/A'}/10`}
              sx={{
                backgroundColor: 'rgba(245, 197, 24, 0.15)',
                color: 'secondary.main',
                fontWeight: 700,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              icon={<AccessTimeIcon sx={{ color: 'text.secondary' }} />}
              label={formatDuration(movie.duration)}
              sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            />
            <Chip
              icon={<EventIcon sx={{ color: 'text.secondary' }} />}
              label={formatDate(movie.releaseDate)}
              sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            />
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            {movie.description}
          </Typography>

          <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

          <Typography variant="caption" color="text.secondary">
            Added on {formatDate(movie.createdAt)}
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {movie.trailerId && (
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={() => setTrailerModalOpen(true)}
                sx={{
                  background: 'linear-gradient(45deg, #e50914, #f40612)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #f40612, #b20710)',
                  },
                }}
              >
                Watch Trailer
              </Button>
            )}
            <Button
              variant={isInWatchlist(movie._id) ? 'outlined' : 'contained'}
              startIcon={<StarIcon />}
              onClick={handleToggleWatchlist}
              sx={{
                background:
                  !isInWatchlist(movie._id) &&
                  'linear-gradient(45deg, #e50914, #f40612)',
                '&:hover': {
                  background:
                    !isInWatchlist(movie._id) &&
                    'linear-gradient(45deg, #f40612, #b20710)',
                },
              }}
            >
              {isInWatchlist(movie._id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Button>
          </Box>

          {/* Where to Watch Section */}
          {movie.streamingLinks && movie.streamingLinks.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <OpenInNewIcon sx={{ fontSize: 24 }} />
                Where to Watch
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {movie.streamingLinks.map((link, index) => (
                  <Chip
                    key={index}
                    component={Link}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    label={link.platform}
                    icon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                    clickable
                    sx={{
                      backgroundColor: 'rgba(229, 9, 20, 0.15)',
                      color: '#e50914',
                      fontWeight: 600,
                      border: '1px solid rgba(229, 9, 20, 0.3)',
                      fontSize: '0.95rem',
                      py: 2.5,
                      '&:hover': {
                        backgroundColor: 'rgba(229, 9, 20, 0.25)',
                        borderColor: '#e50914',
                      },
                      '& .MuiChip-icon': {
                        color: '#e50914',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {isAdmin && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate('/admin/dashboard?tab=0')}
                sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                Edit in Admin
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteModalOpen(true)}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Movie"
        message="Are you sure you want to delete this movie? This action cannot be undone."
        confirmText="Delete"
      />

      {/* Trailer Modal */}
      <TrailerModal
        open={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        trailerId={movie?.trailerId}
        movieTitle={movie?.title}
        streamingLinks={movie?.streamingLinks}
      />
    </Container>
  );
};

export default MovieDetails;
