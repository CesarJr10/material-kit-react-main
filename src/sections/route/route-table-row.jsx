import { useState } from 'react';
import PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import Iconify from 'src/components/iconify';

import EditRouteDialog from './edit-route-dialog';

// ----------------------------------------------------------------------

export default function RouteTableRow({
  selected,
  handleClick,
  nombre,
  mar_id,
  uid,
  onUpdate,
  reloadUsers,
}) {
  const [open, setOpen] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEditClick = () => {
    setSelectedRoute({
      rout_name: nombre,
      mar_idfk:mar_id,
      uid,
    });
    setDialogOpen(true);
    handleCloseMenu();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    const l = localStorage.getItem("token");

    try{
      const response = await fetch(
        `https://api-proyecto-sena-connect-ar-production.up.railway.app/route/${uid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${l}`,
          },
        }
      );
      const data = await response.json();
      console.log("respuesta del server:", data);
      onUpdate(uid);
      setSnackbarOpen(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Route deleted successfully');

      reloadUsers();
    }catch(error){
      console.error('Error al eliminar ruta:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error deleting the route');
      setSnackbarOpen(true);
    }
    
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{nombre}</TableCell>
        <TableCell>{mar_id}</TableCell>
        
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <EditRouteDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        route={selectedRoute} 
        onUpdate={onUpdate}
        reloadUsers={reloadUsers}
      />
      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this route?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
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

RouteTableRow.propTypes = {
  handleClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  nombre: PropTypes.string.isRequired,
  mar_id: PropTypes.any.isRequired,
  uid: PropTypes.any.isRequired,
  onUpdate: PropTypes.func.isRequired,
  reloadUsers: PropTypes.func.isRequired,
};
