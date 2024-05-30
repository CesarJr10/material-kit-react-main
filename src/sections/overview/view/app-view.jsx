

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
       {/* Aquí se hace la integración con PowerBi */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <iframe
            title="metricasconnect-ar"
            width="100%"
            height="800"
            src="https://app.powerbi.com/reportEmbed?reportId=b8df35c8-30d3-4593-9c35-a315c903221c&autoAuth=true&ctid=2bac32fd-d9a2-40d9-a272-3a35920f5607"
            allowFullScreen
          />
        </Grid>
      </Grid>
    </Container>
  );
}
