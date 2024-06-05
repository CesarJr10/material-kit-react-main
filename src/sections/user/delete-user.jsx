
// import { useState } from 'react';

// const DeleteUser = () =>{
//     const [users, setUsers] = useState ('');
//     // const [uid, setUid] = useState('');

//     const handleDelete = async (uid) => {
//         console.log(uid);
//         const l = localStorage.getItem("token");
    
//         const response = await fetch(
//           `https://api-proyecto-sena-connect-ar-production.up.railway.app/users/${uid}`,
//           {
//             method: "DELETE",
//             headers: {
//               Authorization: `Bearer ${l}`, // Incluir el token en el encabezado Authorization
//             },
//           }
//         );
//         const data = await response.json();
//         console.log("respuesta del server:", data);
    
//         setUsers(users.filter((user) => user.uid !== uid));
        
//     };
// }

// export default DeleteUser;