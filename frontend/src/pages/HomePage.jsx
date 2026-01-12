import { Container, Typography, Box } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', my: 8 }}>
        <Typography variant="h1" sx={{ mb: 2 }}>
          Welcome to Movie App
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Discover and explore thousands of movies
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;

