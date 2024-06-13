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

const EditRouteDialog = ({ open, handleClose, route, onUpdate, reloadUsers }) => {
  const [nombre, setNombre] = useState('');
  const [mar_id, setMar_id] = useState('');
  const [uid, setUid] = useState('');
  const [routeExistsError, setRouteExistsError] = useState(false); 

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
    if (route) {
      setNombre(route.rout_name);
      setMar_id(route.mar_idfk);
      setUid(route.uid);
    }
  }, [route]);

  const validateFields = () => {
    const newErrors = {};

    if (!nombre) newErrors.nombre = 'Name is required';
    if (!mar_id) newErrors.mar_id = 'Marker id is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const routeExists = async (nombree) => {
    const response = await fetch(
      'https://api-proyecto-sena-connect-ar-production.up.railway.app/route'
    );
    const routes = await response.json();
    return routes.some((routee) => routee.rout_name === nombree && routee.uid !== uid);
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      const exists = await routeExists(nombre);
      if (exists) {
        setRouteExistsError(true);
        return;
      }

      const userData = {
        uid,
        rout_name: nombre,
        mar_idfk: mar_id
      };

      const response = await fetch(
        `https://api-proyecto-sena-connect-ar-production.up.railway.app/route/${uid}`,
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
      console.log("ruta actualizada correctamente");
      onUpdate(userData);

      // Muestra el Snackbar después de que se cierra el diálogo
      setSnackbarSeverity('success');
      setSnackbarMessage('Route updated successfully');
      setSnackbarOpen(true);

      handleClose();

      
    } catch (error) {
      console.error('Error al editar ruta:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error updating route');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Route</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt:2}}>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setRouteExistsError(false); 
                }}
                error={!!errors.nombre || routeExistsError} 
                helperText={errors.nombre || (routeExistsError ? 'The name of this route already exists' : '')} 
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Marker id"
                value={mar_id}
                onChange={(e) => setMar_id(e.target.value)}
                error={!!errors.mar_id}
                helperText={errors.mar_id}
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
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

EditRouteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  route: PropTypes.shape({
    rout_name: PropTypes.string,
    mar_idfk: PropTypes.number,
    uid: PropTypes.any,
  }),
  onUpdate: PropTypes.func.isRequired,
  reloadUsers: PropTypes.func.isRequired,
};

export default EditRouteDialog;
