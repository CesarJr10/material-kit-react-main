import { useState } from "react";

const UserList = () => {
    const [users, setUsers] = useState([])
    const [editingUser, setEditingUser] = useState(null);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    // const [telefono, setTelefono] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [direccion, setDireccion] = useState("");
    const [barrio, setBarrio] = useState("");
    const [uid, setUid] = useState("");
   

    const fetchUsers = async () => {

        const response = await fetch(
          "https://api-proyecto-sena-connect-ar-production.up.railway.app/users/all-users"
        );
        const data = await response.json();
    
        setUsers(data);
        console.log(data);
        console.log("si sirve");
    };
    // eslint-disable-next-line no-shadow
    const handleDelete = async (uid) => {
      console.log(uid);
      const l = localStorage.getItem("token");
  
      const response = await fetch(
        `https://api-proyecto-sena-connect-ar-production.up.railway.app/users/${uid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${l}`, // Incluir el token en el encabezado Authorization
          },
        }
      );
      const data = await response.json();
      console.log("respuesta del server:", data);
  
      setUsers(users.filter((user) => user.uid !== uid));
    };
  
    const handleEdit = (user) => {
      setEditingUser(user);
      setNombre(user.nombre || "");
      setApellido(user.apellido || "");
      setUid(user.uid || "");
      setEmail(user.email || "");
      // setTelefono(user.telefono || "");
      setDepartamento(user.departamento || "");
      setCiudad(user.ciudad || "");
      setDireccion(user.direccion || "");
      setBarrio(user.barrio || "");
    };
  
    const handleUpdate = async (event) => {
      event.preventDefault(); // Evitar la recarga automática de la página
      try {
        const updatedUser = {
          ...editingUser,
          nombre,
          apellido,
          email,
          uid,
          // telefono,
          departamento,
          ciudad,
          barrio,
          direccion,
        };
        const response = await fetch(
          "https://api-proyecto-sena-connect-ar-production.up.railway.app/users/update",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          }
        );
  
        setUsers(
          users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setEditingUser(null);
        setNombre("");
        setApellido("");
        setEmail("");
        setUid("");
        // setTelefono("");
        setDepartamento("");
        setCiudad("");
        setDireccion("");
        setBarrio("");
        const data = await response.json();
        console.log("respuesta del server:", data); // Imprimir la respuesta del servidor en la consola
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        // Manejar el error de forma adecuada, por ejemplo, mostrando un mensaje al usuario
      }
    };
};

export default UserList;



