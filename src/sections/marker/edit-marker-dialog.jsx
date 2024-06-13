import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import {
  Grid,
  Alert,
  Dialog,
  Button,
  Snackbar,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

const EditMarkerDialog = ({ open, handleClose, marker, onUpdate, reloadUsers }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [uid, setUid] = useState('');
  const [markerExistsError, setMarkerExistsError] = useState(false); 

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
    if (marker) {
      setNombre(marker.mar_name);
      setDescripcion(marker.mar_description);
      setUid(marker.uid);
    }
  }, [marker]);

  const validateFields = () => {
    const newErrors = {};

    if (!nombre) newErrors.nombre = 'Name is required';
    if (!descripcion) newErrors.descripcion = 'Description is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const markerExists = async (nombree) => {
    const response = await fetch(
      'https://api-proyecto-sena-connect-ar-production.up.railway.app/marker'
    );
    const markers = await response.json();
    return markers.some((markerr) => markerr.mar_name === nombree && markerr.uid !== uid);
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      const exists = await markerExists(nombre);
      if (exists) {
        setMarkerExistsError(true);
        return;
      }

      const userData = {
        uid,
        mar_name: nombre,
        mar_description: descripcion,
      };

      const response = await fetch(
        `https://api-proyecto-sena-connect-ar-production.up.railway.app/marker/${uid}`,
        {
          method: 'PUT',
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
      // reloadUsers();
      console.log("Marker actualizado correctamente");
      onUpdate(userData);

      // Muestra el Snackbar después de que se cierra el diálogo
      setSnackbarSeverity('success');
      setSnackbarMessage('Marker updated successfully');
      setSnackbarOpen(true);

      handleClose();

      
    } catch (error) {
      console.error('Error al editar marcador:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error updating marker');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Marker</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt:2}}>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setMarkerExistsError(false); 
                }}
                error={!!errors.nombre || markerExistsError} 
                helperText={errors.nombre || (markerExistsError ? 'The marker name already exists.' : '')} 
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                error={!!errors.descripcion}
                helperText={errors.descripcion}
              />
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

EditMarkerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  marker: PropTypes.shape({
    mar_name: PropTypes.string,
    mar_description: PropTypes.string,
    uid: PropTypes.any,
  }),
  onUpdate: PropTypes.func.isRequired,
  reloadUsers: PropTypes.func.isRequired,
};

export default EditMarkerDialog;
