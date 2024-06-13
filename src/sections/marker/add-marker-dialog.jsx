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

const NewMarkerDialog = ({ open, onClose, onCreate, showSnackbar }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Limpiar los campos y errores cuando se abre el diálogo
    if (open) {
      setNombre('');
      setDescripcion('');
      setErrors({});
    }
  }, [open]);

  const validateFields = () => {
    const newErrors = {};
    if (!nombre) newErrors.nombre = 'Name is required';
    if (!descripcion) newErrors.descripcion = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      
      const markerData = {
        name: nombre,
        description: descripcion,
      };

      console.log('Datos a enviar:', markerData);

      // Verificar si el marcador ya existe
      const markerListResponse = await fetch(
        'https://api-proyecto-sena-connect-ar-production.up.railway.app/marker/'
      );

      if (!markerListResponse.ok) {
        throw new Error('Error al obtener la lista de marcadores');
      }

      const markerList = await markerListResponse.json();
      const markerExists = markerList.some((marker) => marker.mar_name === nombre);

      if (markerExists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          nombre: 'The marker is already registered',
        }));
        return;
      }

      
      const registerResponse = await fetch(
        'https://api-proyecto-sena-connect-ar-production.up.railway.app/marker',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(markerData),
        }
      );

      console.log('Respuesta del servidor:', registerResponse);

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error al crear el marcador');
      }

      const responseData = await registerResponse.json();
      console.log('Datos recibidos del servidor:', responseData);

      
      setNombre('');
      setDescripcion('');
      setErrors({});

      onCreate();
      showSnackbar('Marker created successfully ', 'success');
      onClose();

    } catch (error) {
      console.error('Error al crear marcador:', error);
      showSnackbar('Error creating the marker', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Register New Marker</DialogTitle>
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
              label="Description"
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
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

NewMarkerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
};

export default NewMarkerDialog;
