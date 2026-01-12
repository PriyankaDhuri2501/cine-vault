import { Container, Typography } from '@mui/material';

const LoginPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Login
      </Typography>
      <Typography color="text.secondary">
        Login form coming soon...
      </Typography>
    </Container>
  );
};

export default LoginPage;

