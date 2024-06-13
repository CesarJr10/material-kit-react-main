import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

// import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();

  // const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [genero, setGenero] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const validateFields = () => {
    const newErrors = {};

    if (!nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!apellido) newErrors.apellido = 'El apellido es obligatorio';
    if (!correo) newErrors.correo = 'El correo electrónico es obligatorio';
    if (!contrasena) newErrors.contrasena = 'La contraseña es obligatoria';
    if (!departamento) newErrors.departamento = 'El departamento es obligatorio';
    if (!ciudad) newErrors.ciudad = 'La ciudad es obligatoria';
    if (!barrio) newErrors.barrio = 'El barrio es obligatorio';
    if (!genero) newErrors.genero = 'El género es obligatorio';
    if (!direccion) newErrors.direccion = 'La dirección es obligatoria';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      const response = await fetch(
        'https://api-proyecto-sena-connect-ar-production.up.railway.app/users/all-users'
      );

      if (!response.ok) {
        throw new Error('Error al obtener la lista de usuarios');
      }

      const userList = await response.json();

      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validEmail.test(correo)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          correo: 'Ingrese un correo electrónico válido',
        }));
        return;
      }

      const emailExists = userList.some((user) => user.email === correo);

      if (emailExists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          correo: 'El correo electrónico ya está registrado',
        }));
        return;
      }

      const registerResponse = await fetch(
        'https://api-proyecto-sena-connect-ar-production.up.railway.app/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre,
            apellido,
            correo,
            contrasena,
            direccion,
            ciudad,
            departamento,
            barrio,
            genero,
            rol: 4,
          }),
        }
      );

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message);
      }

      const responseData = await registerResponse.json();
      console.log('Respuesta del servidor:', responseData);

      setSnackbarOpen(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Usuario registrado exitosamente');

      // setTimeout(() => {
      //   router.push('/');
      // }, 4000);
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Error al registrar usuario');
      setSnackbarOpen(true);
      console.error('Error al registrar', error.message);
    }
  };

  const renderForm = (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="given-name"
            name="nombre"
            fullWidth
            label="Nombre"
            autoFocus
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellido"
            name="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            error={!!errors.apellido}
            helperText={errors.apellido}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            // type="email"
            id="correo"
            label="Correo Electrónico"
            name="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            error={!!errors.correo}
            helperText={errors.correo}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Departamento"
            name="departamento"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            error={!!errors.departamento}
            helperText={errors.departamento}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Ciudad"
            name="ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            error={!!errors.ciudad}
            helperText={errors.ciudad}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Barrio"
            name="barrio"
            value={barrio}
            onChange={(e) => setBarrio(e.target.value)}
            error={!!errors.barrio}
            helperText={errors.barrio}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.genero}>
            <InputLabel id="demo-simple-select-label">Género</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="genero"
              value={genero}
              label="Género"
              onChange={(e) => setGenero(e.target.value)}
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
              <MenuItem value="Otro">Otro</MenuItem>
            </Select>
            {errors.genero && <p style={{ color: 'red' }}>{errors.genero}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="direccion"
            label="Dirección"
            name="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            error={!!errors.direccion}
            helperText={errors.direccion}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="password"
            label="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            error={!!errors.contrasena}
            helperText={errors.contrasena}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
        Register
      </LoadingButton>
    </>
  );

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.background.default, 0.9),
            imgUrl: '/assets/background/overlay_4.jpg',
          }),
          height: 1,
        }}
      >
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, md: 24 },
            left: { xs: 16, md: 24 },
          }}
        />

        <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
          <Card
            sx={{
              p: 3,
              width: 1,
              maxWidth: 420,
            }}
          >
            <Typography variant="h4">Sign up to Sena ConnectAR</Typography>

            <Typography variant="body2" sx={{ mt: 0, mb: 2 }}>
              have an account?
              <Link variant="subtitle2" sx={{ ml: 0.5 }} href="/">
                Log in
              </Link>
            </Typography>

            {renderForm}
          </Card>
        </Stack>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
