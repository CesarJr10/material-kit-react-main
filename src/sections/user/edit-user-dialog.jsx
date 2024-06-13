import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import {
  Grid,
  Alert,
  Dialog,
  Select,
  Button,
  MenuItem,
  Snackbar,
  TextField,
  InputLabel,
  FormControl,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

const EditUserDialog = ({ open, handleClose, user, onUpdate, reloadUsers }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [barrio, setBarrio] = useState('');
  const [genero, setGenero] = useState('');
  const [direccion, setDireccion] = useState('');
  const [uid, setUid] = useState('');
  const [emailExistsError, setEmailExistsError] = useState(false); 

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

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setApellido(user.apellido);
      setEmail(user.email);
      setDepartamento(user.departamento);
      setCiudad(user.ciudad);
      setBarrio(user.barrio);
      setGenero(user.genero);
      setDireccion(user.direccion);
      setUid(user.uid);
    }
  }, [user]);

  const validateFields = () => {
    const newErrors = {};

    if (!nombre) newErrors.nombre = 'Name is required';
    if (!apellido) newErrors.apellido = 'Second name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!departamento) newErrors.departamento = 'Department is required';
    if (!ciudad) newErrors.ciudad = 'City is required';
    if (!barrio) newErrors.barrio = 'Neighborhood is required';
    if (!genero) newErrors.genero = 'Gender is required';
    if (!direccion) newErrors.direccion = 'Address is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const emailExists = async (emaill) => {
    const response = await fetch(
      'https://api-proyecto-sena-connect-ar-production.up.railway.app/users/all-users'
    );
    const users = await response.json();
    return users.some((userr) => userr.email === emaill && userr.uid !== uid);
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmail.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Enter a valid email address',
      }));
      return;
    }

    try {
      const exists = await emailExists(email);
      if (exists) {
        setEmailExistsError(true);
        return;
      }

      const userData = {
        uid,
        nombre,
        apellido,
        email,
        departamento,
        ciudad,
        barrio,
        genero,
        direccion,
      };

      const response = await fetch(
        'https://api-proyecto-sena-connect-ar-production.up.railway.app/users/update',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la respuesta:', errorData);
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      console.log("Usuario actualizado correctamente");
      
      handleClose();
      onUpdate(userData)

      setSnackbarOpen(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('User updated successfully');

      // reloadUsers();
    } catch (error) {
      console.error('Error al editar usuario:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error updating user');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                hidden
                label="TextField"
                style={{ display: 'none' }}
                fullWidth
                id="uid"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
              />
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
                required
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
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailExistsError(false); 
                }}
                error={!!errors.email || emailExistsError}
                helperText={
                  errors.email || (emailExistsError && 'El correo electrónico ya está en uso')
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
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
                required
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
                required
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
                <InputLabel id="genero-label">Gender</InputLabel>
                <Select
                  labelId="genero-label"
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
                required
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

EditUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  reloadUsers: PropTypes.func.isRequired,
};

export default EditUserDialog;
