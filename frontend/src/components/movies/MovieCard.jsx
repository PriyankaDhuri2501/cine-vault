import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Rating,
  Chip,
} from '@mui/material';
import { Movie as MovieIcon } from '@mui/icons-material';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // Navigate to movie details page (to be implemented)
    // navigate(`/movies/${movie._id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 12px 24px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(229, 9, 20, 0.3)'
          : '0 4px 8px rgba(0, 0, 0, 0.3)',
        '&:hover': {
          '& .movie-poster': {
            transform: 'scale(1.05)',
          },
          '& .movie-title': {
            color: 'primary.main',
          },
        },
      }}
    >
      {/* Poster Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '150%', // 2:3 aspect ratio
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        {movie.poster ? (
          <CardMedia
            component="img"
            image={movie.poster}
            alt={movie.title}
            className="movie-poster"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(229, 9, 20, 0.1)',
            }}
          >
            <MovieIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
          </Box>
        )}

        {/* Rating Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid',
            borderColor: movie.rating >= 7 ? 'success.main' : movie.rating >= 5 ? 'warning.main' : 'error.main',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: 'white',
              fontSize: '0.875rem',
            }}
          >
            {movie.rating?.toFixed(1) || 'N/A'}
          </Typography>
        </Box>

        {/* Release Year Chip */}
        {movie.releaseDate && (
          <Chip
            label={formatDate(movie.releaseDate)}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        )}
      </Box>

      {/* Card Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': {
            pb: 2,
          },
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          component="h3"
          className="movie-title"
          sx={{
            fontWeight: 600,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3.5rem',
            transition: 'color 0.3s ease',
            lineHeight: 1.4,
          }}
        >
          {movie.title}
        </Typography>

        {/* Rating Stars */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Rating
            value={movie.rating ? movie.rating / 2 : 0}
            precision={0.1}
            readOnly
            size="small"
            sx={{
              '& .MuiRating-iconFilled': {
                color: 'secondary.main',
              },
              '& .MuiRating-iconEmpty': {
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          />
          <Typography variant="caption" color="text.secondary">
            ({movie.rating?.toFixed(1) || 'N/A'}/10)
          </Typography>
        </Box>

        {/* Duration */}
        {movie.duration && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto' }}>
            {formatDuration(movie.duration)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MovieCard;
