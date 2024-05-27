

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function AppView() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={12}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Aquí van las estadisticas de power bi
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
