import { Box, Container, Grid, Typography } from '@mui/material';
import { CryptocurrencyMarket } from 'react-tradingview-embed';
const BASE_URL = import.meta.env.VITE_WEB_BASE_URL;

const HomePage = (): JSX.Element => {
  const cmWidgetProps = {
    colorTheme: 'dark',
    largeChartUrl: `${BASE_URL}/trade/`,
    width: '100%',
  };

  return (
    <Container maxWidth={false} sx={{ minHeight: '100%', pt: '3rem' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid direction="column" container className="text-center" sx={{ px: '5rem' }}>
          <Grid item>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
              Your new partner in Crypto Trading
            </Typography>
          </Grid>
          <Grid item sx={{ p: '3rem' }}>
            <CryptocurrencyMarket widgetProps={cmWidgetProps} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
