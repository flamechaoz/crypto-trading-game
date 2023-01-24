import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popover,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
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
        for (let index = data.a.length - 1, counter = 0; counter < 14; index--) {
          if (data.a[index][1] > 0) {
            tempOrders.a.push(data.a[index]);
            counter++;
          }
        }
        for (let index = 0, counter = 0; counter < 14; index++) {
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
          <Table size="small" sx={{ tableLayout: 'fixed', marginTop: '0.5rem' }}>
            <TableHead sx={{ th: { border: 0, padding: 0, paddingBottom: '0.5rem' } }}>
              <TableRow>
                <TableCell width="30%">
                  <Typography variant="subtitle1" color="#848e9c">
                    Price(USDT)
                  </Typography>
                </TableCell>
                <TableCell width="30%" align="right">
                  <Typography variant="subtitle1" color="#848e9c">
                    Amount(BTC)
                  </Typography>
                </TableCell>
                <TableCell width="40%" align="right">
                  <Typography variant="subtitle1" color="#848e9c">
                    Total
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ td: { padding: 0 } }}>
              {orders.a?.map(function (row: number[], index: number) {
                return (
                  <TableRow
                    key={index}
                    sx={{
                      td: { border: 0, width: '300px', paddingBottom: '0' },
                    }}
                  >
                    <TableCell width="24%">
                      <Typography variant="subtitle1" color={COLOR_RED}>
                        {numberFormatter(row[0], 2)}
                      </Typography>
                    </TableCell>
                    <TableCell width="30%" align="right">
                      <Typography variant="subtitle1" color="#b7bdc6">
                        {numberFormatter(row[1], 5)}
                      </Typography>
                    </TableCell>
                    <TableCell width="46%" align="right">
                      <Typography variant="subtitle1" color="#b7bdc6">
                        {numberFormatter(row[0] * row[1], 5)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box sx={{ padding: '0.5rem', paddingLeft: '1rem' }}>
            <Typography variant="h5" color={color}>
              {numberFormatter(price, 2)}
            </Typography>
          </Box>
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
            <TableBody sx={{ td: { padding: 0 } }}>
              {orders.b?.map(function (row: number[], index: number) {
                return (
                  <TableRow
                    key={index}
                    sx={{
                      td: { border: 0, paddingBottom: '0' },
                      '&:last-child td': { paddingBottom: '6px' },
                    }}
                  >
                    <TableCell width="30%">
                      <Typography variant="subtitle1" color={COLOR_GREEN}>
                        {numberFormatter(row[0], 2)}
                      </Typography>
                    </TableCell>
                    <TableCell width="30%" align="right">
                      <Typography variant="subtitle1" color="#b7bdc6">
                        {numberFormatter(row[1], 5)}
                      </Typography>
                    </TableCell>
                    <TableCell width="40%" align="right">
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
  const [orderType, setOrderType] = useState('buy');

  const marks = [
    {
      value: 0,
      label: '0%',
    },
    {
      value: 25,
      label: '25%',
    },
    {
      value: 50,
      label: '50%',
    },
    {
      value: 75,
      label: '75%',
    },
    {
      value: 100,
      label: '100%',
    },
  ];

  const handleChange = (event: React.MouseEvent<HTMLElement>, newOrderType: string): void => {
    if (newOrderType !== null) {
      setOrderType(newOrderType);
    }
  };

  function sliderText(value: number): string {
    return `${value}%`;
  }

  return (
    <Box sx={{ width: '100%', height: '100%', padding: '1rem' }}>
      <Grid container direction="column">
        <Grid item>
          <ToggleButtonGroup fullWidth={true} value={orderType} exclusive onChange={handleChange} aria-label="Platform">
            <ToggleButton color="success" value="buy">
              BUY
            </ToggleButton>
            <ToggleButton color="error" value="sell">
              SELL
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item direction="row" sx={{ marginTop: '1rem' }}>
          <Typography variant="subtitle1" sx={{ display: 'inline', color: '#848e9c', marginRight: '0.5rem' }}>
            Available
          </Typography>
          <Typography variant="subtitle1" sx={{ display: 'inline' }}>
            - USDT
          </Typography>
        </Grid>
        <Grid>
          <FormControl fullWidth sx={{ marginTop: '1rem' }}>
            <OutlinedInput
              id="price"
              value="Market"
              startAdornment={<InputAdornment position="start">Price</InputAdornment>}
              endAdornment={<InputAdornment position="end">USDT</InputAdornment>}
              disabled
              sx={{ backgroundColor: 'black' }}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginTop: '1rem' }}>
            <OutlinedInput
              id="amount"
              color="primary"
              startAdornment={<InputAdornment position="start">Amount</InputAdornment>}
              endAdornment={<InputAdornment position="end">BTC</InputAdornment>}
            />
          </FormControl>
        </Grid>
        <Grid item sx={{ marginTop: '1rem' }}>
          <Slider
            defaultValue={0}
            getAriaValueText={sliderText}
            valueLabelDisplay="auto"
            step={25}
            min={0}
            max={100}
            marks
          ></Slider>
        </Grid>
        <Grid item sx={{ marginTop: '1rem' }}>
          <Button fullWidth variant="contained" color="success" size="large">
            BUY
          </Button>
        </Grid>
      </Grid>
    </Box>
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
