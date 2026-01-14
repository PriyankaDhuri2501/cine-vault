import { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Link,
  Chip,
} from '@mui/material';
import { Close as CloseIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';

const TrailerModal = ({ open, onClose, trailerId, movieTitle, streamingLinks = [] }) => {
  const iframeRef = useRef(null);

  // Stop video when modal closes
  useEffect(() => {
    if (!open && iframeRef.current) {
      // Reset iframe src to stop video playback
      const iframe = iframeRef.current;
      const src = iframe.src;
      iframe.src = '';
      // Small delay to ensure cleanup, then restore src for next open
      setTimeout(() => {
        iframe.src = src;
      }, 100);
    }
  }, [open]);

  if (!trailerId) return null;

  const youtubeEmbedUrl = `https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#0a0a0a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Video Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 aspect ratio
            backgroundColor: '#000',
          }}
        >
          <Box
            component="iframe"
            ref={iframeRef}
            src={youtubeEmbedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </Box>

        {/* Movie Title & Streaming Links */}
        <Box sx={{ p: 3, backgroundColor: '#0a0a0a' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'white',
            }}
          >
            {movieTitle}
          </Typography>

          {/* Where to Watch Section */}
          {streamingLinks && streamingLinks.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'text.secondary',
                }}
              >
                Where to Watch
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {streamingLinks.map((link, index) => (
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;
