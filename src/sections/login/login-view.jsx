import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
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

  

  const handleSubmit = async (e) => {
     e.preventDefault();

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
          required
          name="email" 
          label="Email address" 
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <TextField
          required
          name="password"
          label="Password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
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
          <Typography variant="h4">Sign in to Sena ConnectAR</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} href='/register' >
              Get started
            </Link>
          </Typography>

          {renderForm}

        </Card>
      </Stack>
    </Box>
  );
}
