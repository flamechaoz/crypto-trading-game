import { Box, Container, Typography } from '@mui/material';
import { useStateContext } from '../context';

const ProfilePage = (): JSX.Element => {
  const stateContext = useStateContext();

  const user = stateContext?.state.authUser;

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '100%',
        position: 'fixed',
      }}
    >
      <Box
        maxWidth="lg"
        sx={{
          maxHeight: '20rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: '2rem',
          mx: 'auto',
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: 500 }}>
          Profile Page
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
