import React, { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { CircularProgress, Container, Stack, Typography, Button, Card, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nombre');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api-proyecto-sena-connect-ar-production.up.railway.app/users/all-users'
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
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

    const updatedIndex = users.findIndex((user) => user.uid === updatedUser.uid);
    if (updatedIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[updatedIndex] = updatedUser;
      setUsers(updatedUsers);
    }
  };

  const handleDeleteSelected = () => {
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteSelected = async () => {
    const l = localStorage.getItem("token");
    try {
      await Promise.all(
        selected.map(uid => fetch(`https://api-proyecto-sena-connect-ar-production.up.railway.app/users/${uid}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${l}`,
          },
        }))
      );
      setUsers(users.filter(user => !selected.includes(user.uid)));
      setSelected([]);
      setDeleteConfirmationOpen(false);
    } catch (error) {
      console.error('Failed to delete users:', error);
    }
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>
        {/* <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Nuevo Usuario
        </Button> */}
      </Stack>
      <Card>
        <UserTableToolbar
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
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={users.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'nombre', label: 'Nombre' },
                    { id: 'apellido', label: 'Apellido' },
                    { id: 'email', label: 'Correo' },
                    { id: 'departamento', label: 'Departamento' },
                    { id: 'ciudad', label: 'Ciudad' },
                    { id: 'barrio', label: 'Barrio' },
                    { id: 'direccion', label: 'Dirección' },
                    { id: 'genero', label: 'Género' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row.uid}
                        nombre={row.nombre}
                        apellido={row.apellido}
                        email={row.email}
                        departamento={row.departamento}
                        ciudad={row.ciudad}
                        barrio={row.barrio}
                        direccion={row.direccion}
                        genero={row.genero}
                        uid={row.uid}
                        selected={selected.indexOf(row.uid) !== -1}
                        handleClick={(event) => handleClick(event, row.uid)}
                        onUpdate={handleUpdateUser}
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
      
      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete the selected users?</p>
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
    </Container>
  );
}
