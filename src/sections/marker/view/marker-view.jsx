import React, { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import {
  Card,
  Alert,
  Stack,
  Button,
  Dialog,
  Snackbar,
  Container,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify/iconify';

import TableNoData from '../table-no-data';
import MarkerTableRow from '../marker-table-row';
import TableEmptyRows from '../table-empty-rows';
import NewMarkerDialog from '../add-marker-dialog';
import MarkerTableHead from '../marker-table-head';
import MarkerTableToolbar from '../marker-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function MarkerPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nombre');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  // const [errors, setErrors] = useState({});
  const [newMarkerDialogOpen, setNewMarkerDialogOpen] = useState(false);
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api-proyecto-sena-connect-ar-production.up.railway.app/marker/'
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch markers:', error);
    }
    setLoading(false);
  };

  const handleSort = (event, uid) => {
    const isAsc = orderBy === uid && order === 'asc';
    if (uid !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(uid);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.uid);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, uid) => {
    const selectedIndex = selected.indexOf(uid);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, uid);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.uid === updatedUser.uid ? updatedUser : user))
    );
  };

  const handleDeleteSelected = () => {
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteSelected = async () => {
    const l = localStorage.getItem('token');
    try {
      await Promise.all(
        selected.map((uid) =>
          fetch(`https://api-proyecto-sena-connect-ar-production.up.railway.app/marker/${uid}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${l}`,
            },
          })
        )
      );
      setUsers(users.filter((user) => !selected.includes(user.uid)));
      setSelected([]);
      setDeleteConfirmationOpen(false);

      setSnackbarOpen(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Marker(s) deleted successfully');
    } catch (error) {
      console.error('Failed to delete marker:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error deleting marker(s)');
      setSnackbarOpen(true);
    }
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Markers</Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setNewMarkerDialogOpen(true)}
          >
            New Marker
          </Button>
        </Stack>
        <Card>
          <MarkerTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteSelected={handleDeleteSelected}
          />
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              {loading ? (
                <Stack alignItems="center" justifyContent="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </Stack>
              ) : (
                <Table sx={{ minWidth: 800 }}>
                  <MarkerTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={users.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'nombre', label: 'Name' },
                      { id: 'descripcion', label: 'Description' },
                      { id: '' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <MarkerTableRow
                          key={row.uid}
                          nombre={row.mar_name}
                          descripcion={row.mar_description}
                          uid={row.uid}
                          selected={selected.indexOf(row.uid) !== -1}
                          handleClick={(event) => handleClick(event, row.uid)}
                          onUpdate={handleUpdateUser}
                          reloadUsers={fetchUsers}
                        />
                      ))}

                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, users.length)}
                    />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete the selected user(s)?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDeleteSelected} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <NewMarkerDialog
          open={newMarkerDialogOpen}
          onClose={() => setNewMarkerDialogOpen(false)}
          onCreate={fetchUsers} // Recargar la lista de usuarios al crear uno nuevo
          showSnackbar={(message, severity) => {
            setSnackbarMessage(message);
            setSnackbarSeverity(severity);
            setSnackbarOpen(true);
          }}
        />
      </Container>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
