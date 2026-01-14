import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
  Avatar,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync search query with URL when on search page
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const q = urlParams.get('q') || '';
    if (location.pathname === '/search' && q !== searchQuery) {
      setSearchQuery(q);
    } else if (location.pathname !== '/search' && searchQuery) {
      // Clear search when navigating away from search page
      setSearchQuery('');
    }
  }, [location.pathname, location.search]);

  // Real-time search: Navigate to search page as user types (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If search is cleared and we're on search page, navigate to home
      if (location.pathname === '/search') {
        navigate('/');
      }
      return;
    }

    // Debounce navigation to search page
    const timeoutId = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }, 300); // 300ms debounce for smoother UX

    return () => clearTimeout(timeoutId);
  }, [searchQuery, navigate, location.pathname]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigation is handled by useEffect, but we can keep this for Enter key
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

        {/* Search Bar - Responsive */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              flexGrow: 1,
            maxWidth: { xs: '100%', md: '600px' },
              position: 'relative',
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.15),
              },
            marginRight: { xs: 1, md: 3 },
            display: { xs: 'none', sm: 'flex' }, // Hide on very small screens, show on sm and up
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
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
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
            {isAuthenticated ? (
              <>
                {isAdmin && (
            <Button
              component={Link}
                    to="/admin/dashboard"
              color="inherit"
                    startIcon={<DashboardIcon />}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                },
              }}
            >
                    Dashboard
            </Button>
                )}
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main',
                      fontSize: '0.875rem',
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </>
            ) : (
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
            )}
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
          {isAuthenticated ? (
            <>
              {isAdmin && (
          <MenuItem
            component={Link}
                  to="/admin/dashboard"
            onClick={handleMenuClose}
          >
                  Dashboard
                </MenuItem>
              )}
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
          </MenuItem>
            </>
          ) : (
          <MenuItem
            component={Link}
            to="/login"
            onClick={handleMenuClose}
          >
            Login
            </MenuItem>
          )}
        </Menu>

        {/* User Menu - Desktop */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minWidth: 200,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={600}>
              {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          {isAdmin && (
            <>
              <MenuItem
                component={Link}
                to="/admin/dashboard"
                onClick={handleUserMenuClose}
              >
                <DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
                Admin Dashboard
              </MenuItem>
              <MenuItem
                component={Link}
                to="/admin/dashboard?tab=users"
                onClick={handleUserMenuClose}
              >
                <PeopleIcon sx={{ mr: 1, fontSize: 20 }} />
                Manage Users
              </MenuItem>
            </>
          )}
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

