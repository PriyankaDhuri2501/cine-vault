import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  Button,
  IconButton,
} from '@mui/material';
import {
  Clear as ClearIcon,
  Movie as MovieIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import MovieCard from '../components/movies/MovieCard';
import api from '../utils/api';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get('q') || '';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(12);

  // Fetch search results
  const fetchSearchResults = useCallback(async (query, currentPage = 1) => {
    if (!query || !query.trim()) {
      setMovies([]);
      setTotal(0);
      setTotalPages(0);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await api.get('/movies/search', {
        params: {
          q: query.trim(),
          page: currentPage,
          limit,
        },
      });

      setMovies(response.data.data.movies);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to search movies. Please try again.'
      );
      setMovies([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Effect to fetch results when query param changes
  useEffect(() => {
    if (queryParam.trim()) {
      setPage(1);
      fetchSearchResults(queryParam, 1);
    } else {
      setMovies([]);
      setTotal(0);
      setTotalPages(0);
    }
  }, [queryParam, fetchSearchResults]);

  // Effect to fetch results when page changes
  useEffect(() => {
    if (queryParam.trim() && page > 1) {
      fetchSearchResults(queryParam, page);
    }
  }, [page, queryParam, fetchSearchResults]);

  const handleClearSearch = () => {
    setSearchParams({});
    navigate('/');
  };

  const handleNewSearch = () => {
    setSearchParams({});
    // Scroll to top and let user use navbar search
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      {queryParam.trim() ? (
        <Box sx={{ mb: 4 }}>
          {/* Search Query Display */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Search Results
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Results for "
                  <Box component="span" sx={{ color: 'primary.main' }}>
                    {queryParam}
                  </Box>
                  "
                </Typography>
                <Chip
                  label={`${total} result${total !== 1 ? 's' : ''}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(229, 9, 20, 0.2)',
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}
              >
                Sorted by relevance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleNewSearch}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(229, 9, 20, 0.1)',
                  },
                }}
              >
                New Search
              </Button>
              <IconButton
                onClick={handleClearSearch}
                sx={{
                  color: 'text.secondary',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'text.primary',
                  },
                }}
                aria-label="clear search"
              >
                <ClearIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      ) : (
        /* Empty State - No Search Query */
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
        Search Movies
      </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Use the search bar in the navigation to find movies by title or description
          </Typography>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      ) : !queryParam.trim() ? (
        /* Empty State - No Search Query */
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <MovieIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" sx={{ mb: 1 }}>
            Start Your Search
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter a movie title or description in the search bar above to find what you're looking
            for
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(45deg, #e50914, #f40612)',
              '&:hover': {
                background: 'linear-gradient(45deg, #f40612, #b20710)',
              },
            }}
          >
            Browse All Movies
          </Button>
        </Box>
      ) : movies.length === 0 ? (
        /* No Results State */
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <MovieIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" sx={{ mb: 1 }}>
            No Movies Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            We couldn't find any movies matching "{queryParam}". Try adjusting your search terms.
          </Typography>
          <Button
            variant="outlined"
            onClick={handleNewSearch}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(229, 9, 20, 0.1)',
              },
            }}
          >
            Try a New Search
          </Button>
        </Box>
      ) : (
        <>
          {/* Movies Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
                xl: 'repeat(6, 1fr)',
              },
              gap: 3,
              mb: 4,
            }}
          >
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                mt: 4,
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Page {page} of {totalPages}
      </Typography>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'text.primary',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchPage;
