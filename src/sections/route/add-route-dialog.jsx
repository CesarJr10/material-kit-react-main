import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
  Grid,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const NewRouteDialog = ({ open, onClose, onCreate, showSnackbar }) => {
  const [nombre, setNombre] = useState('');

  const [mar_id, setMar_id] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Limpiar los campos y errores cuando se abre el diálogo
    if (open) {
      setNombre('');
      setMar_id('');
      setErrors({});
    }
  }, [open]);

  const validateFields = () => {
    const newErrors = {};
    if (!nombre) newErrors.nombre = 'Name is required';
    if (!mar_id) newErrors.mar_id = 'Marker id es required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      
      const routeData = {
        name: nombre,
        mar_id
      };

      console.log('Datos a enviar:', routeData);

      // Verificar si el marcador ya existe
      const routeListResponse = await fetch(
        'https://api-proyecto-sena-connect-ar-production.up.railway.app/route/'
      );

      if (!routeListResponse.ok) {
        throw new Error('Error al obtener la lista de rutas');
      }

      const routeList = await routeListResponse.json();
      const routeExists = routeList.some((route) => route.rout_name === nombre);

      if (routeExists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          nombre: 'the route is already registered',
        }));
        return;
      }

      
      const registerResponse = await fetch(
        'https://api-proyecto-sena-connect-ar-production.up.railway.app/route',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(routeData),
        }
      );

      console.log('Respuesta del servidor:', registerResponse);

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error al crear la ruta');
      }

      const responseData = await registerResponse.json();
      console.log('Datos recibidos del servidor:', responseData);

      
      setNombre('');
      setMar_id('');
      setErrors({});

      onCreate();
      showSnackbar('Route created successfully', 'success');
      onClose();

    } catch (error) {
      console.error('Error al crear marcador:', error);
      showSnackbar('Error creating route', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Register New Route</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              type='number'
              label="Maker Id"
              name="marker Id"
              value={mar_id}
              onChange={(e) => setMar_id(e.target.value)}
              error={!!errors.mar_id}
              helperText={errors.mar_id}
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

NewRouteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
};

export default NewRouteDialog;
