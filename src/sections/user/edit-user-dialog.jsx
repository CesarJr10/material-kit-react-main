import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const EditUserDialog = ({ open, handleClose, user, onUpdate }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [barrio, setBarrio] = useState('');
  const [genero, setGenero] = useState('');
  const [direccion, setDireccion] = useState('');
  const [uid, setUid] = useState('');

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

  const handleSave = async () => {
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

    try {
      const response = await fetch("https://api-proyecto-sena-connect-ar-production.up.railway.app/users/update", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),

      });
      console.log("Usuario actualizdo")
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la respuesta:', errorData);
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }
      const updatedUserData = await response.json();

      // Actualizar el usuario en el estado local
      onUpdate(updatedUserData);
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 2, mt:2 }}>
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
              required
              fullWidth
              label="Nombre"
              autoFocus
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Apellido"
              name="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Correo Electronico"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Departamento"
              name="departamento"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Ciudad"
              name="ciudad"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Barrio"
              name="barrio"
              value={barrio}
              onChange={(e) => setBarrio(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
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
          </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="direccion"
              label="Direccion"
              name="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} >Save</Button>
      </DialogActions>
    </Dialog>
  );
};

EditUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
};

export default EditUserDialog;
