import { Box, Container, Typography } from '@mui/material';

const HomePage = (): JSX.Element => {
  return (
    <Container maxWidth={false} sx={{ minHeight: '100%', pt: '5rem', position: 'fixed' }}>
      <Box
        sx={{
          height: '15rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: 500 }}>
          Home Page
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
