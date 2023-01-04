import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import routes from './router';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#161a1e',
    },
    primary: {
      main: '#FBA719',
      dark: '#FBA719',
    },
    secondary: {
      main: '#FBA719',
      dark: '#FBA719',
    },
  },
  typography: {
    subtitle1: {
      fontSize: 12,
    },
  },
});

function App(): JSX.Element {
  const content = useRoutes(routes);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ToastContainer />
      {content}
    </ThemeProvider>
  );
}

export default App;
