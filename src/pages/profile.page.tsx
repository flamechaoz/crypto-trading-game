import { Box, Container, Typography } from '@mui/material';
import { BitcoinIcon } from '../components/CustomIcons/BitcoinIcon';
import { EthereumIcon } from '../components/CustomIcons/EthereumIcon';
import { UsdtIcon } from '../components/CustomIcons/UsdtIcon';
import { useStateContext } from '../context';

const ProfilePage = (): JSX.Element => {
  const stateContext = useStateContext();

  const user = stateContext?.state.authUser;

  return (
    <Container maxWidth={false} sx={{ minHeight: '100%', pt: '1.5rem' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
          Profile
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>
            <strong>Id:</strong> {user?.id}
          </Typography>
          <Typography gutterBottom>
            <strong>Full Name:</strong> {user?.name}
          </Typography>
          <Typography gutterBottom>
            <strong>Email Address:</strong> {user?.email}
          </Typography>
          <Typography gutterBottom>
            <strong>Role:</strong> {user?.role}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;
