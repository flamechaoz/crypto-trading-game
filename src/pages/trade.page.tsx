import { Box, Container, Typography } from '@mui/material';
import { AdvancedChart } from 'react-tradingview-embed';

const TradePage = (): JSX.Element => {
  const tvWidgetProps = {
    interval: '1D',
    theme: 'dark',
    style: '1',
    save_image: false,
    symbol: 'BTCUSD',
    studies: ['TripleEMA@tv-basicstudies'],
  };

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
      <AdvancedChart widgetProps={tvWidgetProps} />
    </Container>
  );
};

export default TradePage;
