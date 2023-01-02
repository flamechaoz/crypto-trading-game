import { Box, Container, Typography } from '@mui/material';

const TradePage = (): JSX.Element => {
  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: '#2363eb',
        minHeight: '100%',
        position: 'fixed',
      }}
    >
      <Box
        maxWidth="lg"
        sx={{
          backgroundColor: '#ece9e9',
          maxHeight: '20rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: '2rem',
          mx: 'auto',
        }}
      >
        <Typography variant="h2" component="h1" sx={{ color: '#1f1e1e', fontWeight: 500 }}>
          Trading Page
        </Typography>
      </Box>
    </Container>
  );
};

export default TradePage;
