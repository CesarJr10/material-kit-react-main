import { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import Iconify from 'src/components/iconify';

import EditUserDialog from './edit-user-dialog';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  handleClick,
  nombre,
  apellido,
  email,
  ciudad,
  departamento,
  barrio,
  direccion,
  genero,
  uid,
  onUpdate,
}) {
  const [open, setOpen] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEditClick = () => {
    setSelectedUser({
      nombre,
      apellido,
      email,
      ciudad,
      departamento,
      barrio,
      direccion,
      genero,
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
    const response = await fetch(
      `https://api-proyecto-sena-connect-ar-production.up.railway.app/users/${uid}`,
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
    window.location.reload();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{nombre}</TableCell>
        <TableCell>{apellido}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{departamento}</TableCell>
        <TableCell>{ciudad}</TableCell>
        <TableCell>{barrio}</TableCell>
        <TableCell>{direccion}</TableCell>
        <TableCell>{genero}</TableCell>
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

      <EditUserDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        user={selectedUser}
        onUpdate={onUpdate}
      />
      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this user?</p>
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
    </>
  );
}

UserTableRow.propTypes = {
  handleClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  ciudad: PropTypes.string.isRequired,
  departamento: PropTypes.string.isRequired,
  barrio: PropTypes.string.isRequired,
  direccion: PropTypes.string.isRequired,
  genero: PropTypes.string.isRequired,
  uid: PropTypes.any.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
