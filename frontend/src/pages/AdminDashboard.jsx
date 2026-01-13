import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back, {user?.username}!
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={logout}
          sx={{
            borderColor: 'error.main',
            color: 'error.main',
            '&:hover': {
              borderColor: 'error.dark',
              backgroundColor: 'rgba(229, 9, 20, 0.1)',
            },
          }}
        >
          Logout
        </Button>
      </Box>

      <Box
        sx={{
          p: 4,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Admin Panel
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Admin functionality coming soon...
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/admin/add-movie')}
          sx={{
            background: 'linear-gradient(45deg, #e50914, #f40612)',
            '&:hover': {
              background: 'linear-gradient(45deg, #f40612, #b20710)',
            },
          }}
        >
          Add Movie
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard;

