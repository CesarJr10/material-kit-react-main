import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import  Alert  from '@mui/material/Alert';
import  Snackbar  from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
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

    
    if (!correo) newErrors.correo = 'El correo electrónico es obligatorio';
    if (!contrasena) newErrors.contrasena = 'La contraseña es obligatoria';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
     e.preventDefault();

     if (!validateFields()) return;

     const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validEmail.test(correo)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          correo: 'Ingrese un correo electrónico válido',
        }));
        return;
      }

    try {
      const response = await fetch(
        "https://api-proyecto-sena-connect-ar-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ correo, contrasena }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      const {token, rolUsuario, nombreUsuario, ApellidoUsuario, correoUsuario} = responseData

      if (rolUsuario === 4) {
        console.log('Usuario tiene rol de admin');
        router.push('/dashboard');
      } else {
        console.log('Usuario no tiene rol de admin');
        router.push('/404');
      }

      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify({
        nombre: nombreUsuario,
        apellido: ApellidoUsuario,
        correo: correoUsuario,
      }));
      
      console.log("Respuesta del servidor:",token);

    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Error al ingresar, credenciales incorrectas');
      setSnackbarOpen(true);
      console.error(
        "Error al iniciar sesión:",
        error.message,
        correo,
        contrasena
      );
      // setError("Credenciales incorrectas. Por favor, inténtalo de nuevo."); 
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField 
          
          name="email" 
          label="Email address" 
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          error={!!errors.correo}
          helperText={errors.correo}
        />

        <TextField
          
          name="password"
          label="Password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          error={!!errors.contrsena}
          helperText={errors.contrasena}
          type={showPassword ? 'text' : 'password'}
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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <>
    <Box component="form" onSubmit={handleSubmit}
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

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" sx={{ mt: 2, mb: 5 }} >Sign in to Sena ConnectAR</Typography>

          {/* <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} href='/register' >
              Get started
            </Link>
          </Typography> */}

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
