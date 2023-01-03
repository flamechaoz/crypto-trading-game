import { Box, Container, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { AdvancedChart } from 'react-tradingview-embed';

const TopBar = (): JSX.Element => {
  return (
    <Grid container>
      <Grid item xs={2}>
        <TokenMenu />
      </Grid>
      <Grid item xs={10}>
        <LivePriceTicker />
      </Grid>
    </Grid>
  );
};

const TokenMenu = (): JSX.Element => {
  return <Typography>Menu</Typography>;
};

const LiveChart = (): JSX.Element => {
  const tvWidgetProps = {
    interval: '1D',
    theme: 'dark',
    style: '1',
    save_image: false,
    symbol: 'BTCUSDT',
    studies: [],
  };

  return <AdvancedChart widgetProps={tvWidgetProps} />;
};

const LivePriceTicker = (): JSX.Element => {
  const [price, setPrice] = useState(0);
  const [color, setColor] = useState('black');

  const COLOR_GREEN = 'rgb(14 203 129)';
  const COLOR_RED = 'rgb(246 70 93)';

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    let lastPrice = 0;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      try {
        const newPrice = parseFloat(data.p).toFixed(2);
        setPrice(newPrice);
        const newColor = lastPrice > newPrice ? COLOR_RED : COLOR_GREEN;
        setColor(newColor);
        lastPrice = newPrice;
      } catch (err) {
        console.log(err);
      }
    };
  }, []);

  return <Typography color={color}>{price}</Typography>;
};

const Orders = (): JSX.Element => {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'primary.dark',
          '&:hover': {
            backgroundColor: 'primary.main',
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      >
        Order Book
      </Box>
    </>
  );
};

const BuySellForm = (): JSX.Element => {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'primary.dark',
          '&:hover': {
            backgroundColor: 'primary.main',
          },
        }}
      >
        Buy/Sell
      </Box>
    </>
  );
};

const TradePage = (): JSX.Element => {
  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: '#2363eb',
        minHeight: '100%',
        position: 'fixed',
        padding: '0px 0px !important',
      }}
    >
      <Grid container>
        <Grid item xs={8}>
          <Grid item direction="column">
            <Grid item>
              <TopBar />
            </Grid>
            <Grid item>
              <LiveChart />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Orders />
        </Grid>
        <Grid item xs={2}>
          <BuySellForm />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TradePage;
