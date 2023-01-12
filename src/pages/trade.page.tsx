import { Box, Container, Grid, Popover, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { AdvancedChart } from 'react-tradingview-embed';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { currencyFormatter, numberFormatter } from '../utils/formatter';

const COLOR_GREEN = 'rgb(14 203 129)';
const COLOR_RED = 'rgb(246 70 93)';

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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Box sx={{ textAlign: 'center', paddingY: '1rem' }}>
        <Typography variant="h5" sx={{ cursor: 'pointer', display: 'inline' }} onClick={handleClick} aria-describedby={id}>
          BTC/USDT
          <ArrowDropDownIcon />
        </Typography>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Typography sx={{ p: '0.6rem' }}>Token list here.</Typography>
        </Popover>
      </Box>
    </>
  );
};

const LiveChart = (): JSX.Element => {
  const tvWidgetProps = {
    interval: '5',
    theme: 'dark',
    style: '1',
    save_image: false,
    symbol: 'BTCUSDT',
    studies: [],
  };

  return <AdvancedChart widgetProps={tvWidgetProps} />;
};

const Token1Ticker = (): JSX.Element => {
  return (
    <>
      <Grid container item xs={2} direction="column" alignItems="center" justifyContent="center">
        <Typography variant="subtitle1" color="#848e9c">
          24h Change
        </Typography>
        <Typography variant="subtitle1" color={COLOR_GREEN}>
          264.71 +1.59%
        </Typography>
      </Grid>

      <Grid container item xs={2} direction="column" alignItems="center" justifyContent="center">
        <Typography variant="subtitle1" color="#848e9c">
          24h High
        </Typography>
        <Typography variant="subtitle1">264.71 +1.59%</Typography>
      </Grid>

      <Grid container item xs={2} direction="column" alignItems="center" justifyContent="center">
        <Typography variant="subtitle1" color="#848e9c">
          24h Low
        </Typography>
        <Typography variant="subtitle1">264.71 +1.59%</Typography>
      </Grid>

      <Grid container item xs={2} direction="column" alignItems="center" justifyContent="center">
        <Typography variant="subtitle1" color="#848e9c">
          24h Volume(BTC)
        </Typography>
        <Typography variant="subtitle1">264.71 +1.59%</Typography>
      </Grid>
    </>
  );
};

const LivePriceTicker = (): JSX.Element => {
  const [price, setPrice] = useState(0);
  const [color, setColor] = useState();

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    let lastPrice = 0;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      try {
        const newPrice = data.p;
        setPrice(newPrice);
        const newColor = lastPrice > newPrice ? COLOR_RED : COLOR_GREEN;
        setColor(newColor);
        lastPrice = newPrice;
      } catch (err) {
        console.log(err);
      }
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', paddingRight: '1rem' }}>
      <Grid direction="row" container alignItems="center">
        <Grid container item xs={2} direction="column" alignItems="center" justifyContent="center">
          <Typography color={color}>{numberFormatter(price, 2)}</Typography>
          <Typography variant="subtitle1">{currencyFormatter.format(price)}</Typography>
        </Grid>

        <Token1Ticker />

        <Grid container item xs={2} direction="column" alignItems="center" justifyContent="center">
          <Typography variant="subtitle1" color="#848e9c">
            24h Volume(USDT)
          </Typography>
          <Typography variant="subtitle1">264.71 +1.59%</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

const Orders = (): JSX.Element => {
  const [orders, setOrders] = useState({ a: [], b: [] });
  const [price, setPrice] = useState(0);
  const [color, setColor] = useState();

  useEffect(() => {
    const wsOrders = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth');
    const wsPrice = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    let lastPrice = 0;

    wsOrders.onmessage = (event) => {
      const data = JSON.parse(event.data);
      try {
        const tempOrders = {
          a: [],
          b: [],
        };
        for (let index = data.a.length - 1, counter = 0; counter < 10; index--) {
          if (data.a[index][1] > 0) {
            tempOrders.a.push(data.a[index]);
            counter++;
          }
        }
        for (let index = 0, counter = 0; counter < 10; index++) {
          if (data.b[index][1] > 0) {
            tempOrders.b.push(data.b[index]);
            counter++;
          }
        }
        setOrders(tempOrders);
      } catch (err) {
        console.log(err);
      }
    };

    wsPrice.onmessage = (event) => {
      const data = JSON.parse(event.data);
      try {
        const newPrice = data.p;
        setPrice(newPrice);
        const newColor = lastPrice > newPrice ? COLOR_RED : COLOR_GREEN;
        setColor(newColor);
        lastPrice = newPrice;
      } catch (err) {
        console.log(err);
      }
    };
  }, []);

  return (
    <Box sx={{ width: '100%', height: '100%', padding: '1rem' }}>
      <Grid container direction="column">
        <Grid item>
          <Typography>Order Book</Typography>
        </Grid>
        <Grid item>
          <Table size="small" sx={{ width: '100%' }}>
            <TableHead sx={{ th: { border: 0 } }}>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" color="#848e9c">
                    Price(USDT)
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle1" color="#848e9c">
                    Amount(BTC)
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle1" color="#848e9c">
                    Total
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.a?.map(function (row: number[], index: number) {
                return (
                  <TableRow
                    key={index}
                    sx={{
                      td: { border: 0, width: '300px', paddingBottom: '0' },
                      '&:last-child td': { paddingBottom: '6px' },
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" color={COLOR_RED}>
                        {numberFormatter(row[0], 2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" color="#b7bdc6">
                        {numberFormatter(row[1], 5)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" color="#b7bdc6">
                        {numberFormatter(row[0] * row[1], 5)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box sx={{ paddingLeft: '1rem' }}>
            <Typography variant="h5" color={color}>
              {numberFormatter(price, 2)}
            </Typography>
          </Box>
          <Table size="small">
            <TableBody>
              {orders.b?.map(function (row: number[], index: number) {
                return (
                  <TableRow
                    key={index}
                    sx={{
                      td: { border: 0, width: '300px', paddingBottom: '0' },
                      '&:last-child td': { paddingBottom: '6px' },
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" color={COLOR_GREEN}>
                        {numberFormatter(row[0], 2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" color="#b7bdc6">
                        {numberFormatter(row[1], 5)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" color="#b7bdc6">
                        {numberFormatter(row[0] * row[1], 5)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Box>
  );
};

const BuySellForm = (): JSX.Element => {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
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
        minHeight: '100%',
        position: 'fixed',
        padding: '0px 0px !important',
      }}
    >
      <Grid container>
        <Grid item xs={8}>
          <Grid container item direction="column">
            <Grid item container>
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
