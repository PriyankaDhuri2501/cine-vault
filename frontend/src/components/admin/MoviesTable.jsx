import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Chip,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';

const MoviesTable = ({ movies, onEdit, onDelete, loading = false }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Loading movies...</Typography>
      </Box>
    );
  }

  if (movies.length === 0) {
    return (
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
        <Typography variant="h6" sx={{ mb: 1 }}>
          No Movies Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add your first movie to get started
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Release Date</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Duration</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Rating</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.map((movie) => (
            <TableRow
              key={movie._id}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <TableCell>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {movie.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {movie.description?.substring(0, 60)}...
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{formatDate(movie.releaseDate)}</TableCell>
              <TableCell>{formatDuration(movie.duration)}</TableCell>
              <TableCell>
                <Chip
                  label={movie.rating?.toFixed(1) || 'N/A'}
                  size="small"
                  sx={{
                    backgroundColor:
                      movie.rating >= 7
                        ? 'rgba(70, 211, 105, 0.2)'
                        : movie.rating >= 5
                        ? 'rgba(232, 124, 3, 0.2)'
                        : 'rgba(229, 9, 20, 0.2)',
                    color:
                      movie.rating >= 7
                        ? 'success.main'
                        : movie.rating >= 5
                        ? 'warning.main'
                        : 'error.main',
                    fontWeight: 600,
                  }}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Edit Movie">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(movie)}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'rgba(229, 9, 20, 0.1)',
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Movie">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(movie)}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'rgba(229, 9, 20, 0.1)',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MoviesTable;
