import { Box, Container, Typography } from '@mui/material';

const HomePage = (): JSX.Element => {
  return (
    <Container maxWidth={false} sx={{ backgroundColor: '#2363eb', minHeight: '100%', pt: '5rem', position: 'fixed' }}>
      <Box
        sx={{
          backgroundColor: '#ece9e9',
          height: '15rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
        }}
      >
        <Typography variant="h2" component="h1" sx={{ color: '#1f1e1e', fontWeight: 500 }}>
          Home Page
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
