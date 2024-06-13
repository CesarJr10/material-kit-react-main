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
import RouteTableRow from '../route-table-row';
import TableEmptyRows from '../table-empty-rows';
import NewRouteDialog from '../add-route-dialog';
import RouteTableHead from '../route-table-head';
import RouteTableToolbar from '../route-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function RoutePage() {
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
  const [newRouteDialogOpen, setNewRouteDialogOpen] = useState(false);
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
        'https://api-proyecto-sena-connect-ar-production.up.railway.app/route/'
      );
      const data = await response.json();
      
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch routes:', error);
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
          fetch(`https://api-proyecto-sena-connect-ar-production.up.railway.app/route/${uid}`, {
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
      setSnackbarMessage('Route(s) deleted successfully');
    } catch (error) {
      console.error('Failed to delete route:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error deleting route(s)');
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
          <Typography variant="h4">Routes</Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setNewRouteDialogOpen(true)}
          >
            New Route
          </Button>
        </Stack>
        <Card>
          <RouteTableToolbar
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
                  <RouteTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={users.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'nombre', label: 'Name' },
                      { id: 'mar_id', label: 'Marker id' },
                      { id: '' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <RouteTableRow
                          key={row.uid}
                          nombre={row.rout_name}
                          mar_id={row.mar_idfk}
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
        <NewRouteDialog
          open={newRouteDialogOpen}
          onClose={() => setNewRouteDialogOpen(false)}
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
