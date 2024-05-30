export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    const filterNameLowerCase = filterName.toLowerCase();
    inputData = inputData.filter((user) => {
      // aquí me aseguro de que las propiedas existan:)
      const name         = user.nombre ? user.nombre.toLowerCase() : '';
      const apellido     = user.apellido ? user.apellido.toLowerCase() : '';
      const correo       = user.email ? user.email.toLowerCase() : '';
      const ciudad       = user.ciudad ? user.ciudad.toLowerCase() : '';
      const departamento = user.departamento ? user.departamento.toLowerCase() : '';
      const barrio       = user.barrio ? user.barrio.toLowerCase() : '';
      const direccion    = user.direccion ? user.direccion.toLowerCase() : '';
      const genero       = user.genero ? user.genero.toLowerCase() : '';

      return (
        name.includes(filterNameLowerCase) ||
        apellido.includes(filterNameLowerCase) ||
        correo.includes(filterNameLowerCase) ||
        ciudad.includes(filterNameLowerCase) ||
        departamento.includes(filterNameLowerCase) ||
        barrio.includes(filterNameLowerCase) ||
        direccion.includes(filterNameLowerCase) ||
        genero.includes(filterNameLowerCase) 
      );
    });
  }

  return inputData;
}
