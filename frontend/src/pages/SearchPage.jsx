import { Container, Typography } from '@mui/material';

const SearchPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Search Movies
      </Typography>
      <Typography color="text.secondary">
        Search functionality coming soon...
      </Typography>
    </Container>
  );
};

export default SearchPage;

