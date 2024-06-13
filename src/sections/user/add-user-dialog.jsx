import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
  Grid,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  IconButton,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import Iconify from 'src/components/iconify';

const NewUserDialog = ({ open, onClose, onCreate, showSnackbar }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [barrio, setBarrio] = useState('');
  const [genero, setGenero] = useState('');
  const [direccion, setDireccion] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      
      setNombre('');
      setApellido('');
      setCorreo('');
      setContrasena('');
      setDepartamento('');
      setCiudad('');
      setBarrio('');
      setGenero('');
      setDireccion('');
      setContrasena('');
      setErrors({});
    }
  }, [open]);

  const validatePassword = (password) => {
    const passwordErrors = [];
    if (password.length < 8) {
      passwordErrors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Za-z]/.test(password)) {
      passwordErrors.push('The password must contain at least one letter');
    }
    if (!/\d/.test(password)) {
      passwordErrors.push('The password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      passwordErrors.push('Password must contain at least one special character');
    }
    return passwordErrors;
  };

  const validateFields = () => {
    const newErrors = {};
    if (!nombre) newErrors.nombre = 'Name is required';
    if (!apellido) newErrors.apellido = 'Second name is required';
    if (!correo) newErrors.correo = 'Email is required';
    if (!departamento) newErrors.departamento = 'Department is required';
    if (!ciudad) newErrors.ciudad = 'City is required';
    if (!barrio) newErrors.barrio = 'Neighborhood is required';
    if (!genero) newErrors.genero = 'Gender is required';
    if (!direccion) newErrors.direccion = 'Address is required';

    const passwordErrors = validatePassword(contrasena);
    if (passwordErrors.length > 0) newErrors.contrasena = passwordErrors;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
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
          correo: 'Enter a valid email',
        }));
        return;
      }

      const emailExists = userList.some((user) => user.email === correo);

      if (emailExists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          correo: 'Email is already registered',
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

      onCreate();
      showSnackbar('User created successfully', 'success');
      onClose();

    } catch (error) {
      console.error('Error al crear usuario:', error);
      showSnackbar('Error creating user', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Register New User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="nombre"
              fullWidth
              label="Name"
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
              label="Second name"
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
              id="correo"
              label="Email"
              name="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={!!errors.correo}
              helperText={errors.correo}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department"
              name="departamento"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              error={!!errors.departamento}
              helperText={errors.departamento}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="ciudad"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              error={!!errors.ciudad}
              helperText={errors.ciudad}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Neighborhood"
              name="barrio"
              value={barrio}
              onChange={(e) => setBarrio(e.target.value)}
              error={!!errors.barrio}
              helperText={errors.barrio}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.genero}>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="genero"
                value={genero}
                label="Gender"
                onChange={(e) => setGenero(e.target.value)}
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
                <MenuItem value="Otro">Other</MenuItem>
              </Select>
              {errors.genero && <p style={{ color: 'red' }}>{errors.genero}</p>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="direccion"
              label="Address"
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
              label="Password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              error={!!errors.contrasena}
              helperText={errors.contrasena && (
                <ul style={{ margin: 0, paddingLeft: '1rem', color: 'red' }}>
                  {errors.contrasena.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              )}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

NewUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
};

export default NewUserDialog;
