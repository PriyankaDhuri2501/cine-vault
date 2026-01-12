import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  InputBase,
  alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#0a0a0a',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Logo */}
        <Typography
          component={Link}
          to="/"
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            textDecoration: 'none',
            mr: 4,
            letterSpacing: '-0.5px',
            '&:hover': {
              color: 'primary.light',
            },
          }}
        >
          MOVIE
          <Box component="span" sx={{ color: 'secondary.main' }}>
            APP
          </Box>
        </Typography>

        {/* Search Bar - Desktop */}
        {!isMobile && (
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              flexGrow: 1,
              maxWidth: '600px',
              position: 'relative',
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.15),
              },
              marginRight: 3,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                padding: '0 16px',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </Box>
            <InputBase
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: '10px 10px 10px 45px',
                  width: '100%',
                },
              }}
            />
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Links */}
        {!isMobile ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                },
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/search"
              color="inherit"
              startIcon={<SearchIcon />}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                },
              }}
            >
              Search
            </Button>
            <Button
              component={Link}
              to="/login"
              color="inherit"
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                },
              }}
            >
              Login
            </Button>
          </Box>
        ) : (
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            component={Link}
            to="/"
            onClick={handleMenuClose}
          >
            Home
          </MenuItem>
          <MenuItem
            component={Link}
            to="/search"
            onClick={handleMenuClose}
          >
            Search
          </MenuItem>
          <MenuItem
            component={Link}
            to="/login"
            onClick={handleMenuClose}
          >
            Login
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

