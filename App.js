import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [editingId, setEditingId] = useState(null); //ziuri ar kuriamas naujas vartotojas ar redaguojamas egzistuojantis

  //duomenu uzklausa is duomenu bazes ir atnaujinama informacija vartotojo ekrane tik gavus duomenis
  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/users');
    setUsers(response.data);
  };
  //fetchUsers funkcija naudojama iskart po svetaines uzkrovimo
  useEffect(() => { fetchUsers(); }, []);

  //neleidzia svetainei perkrauti saves kaip iprastai darytu uzpildzius forma
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      //vartotojo atnaujinimo logika
      await axios.put(`http://localhost:5000/api/users/${editingId}`, formData);
      setEditingId(null);
    } else {
      //vartotojo kurimo logika
      await axios.post('http://localhost:5000/api/users', formData);
    }
    //nunulina forma baigus kurt/redaguot
    setFormData({ firstName: '', lastName: '', email: '' });
    //duomenu uzklausa po kurimo/redagavimo
    fetchUsers();
  };
  //paspaudus edit vartotojo informacija sudedama i forma ir galima keisti tarsi kurdami nauja vartotoja
  const startEdit = (user) => {
    setEditingId(user._id);
    setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email });
  };
  //vartotojo trinimo logika
  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
  //duomenu uzklausa po trinimo
    fetchUsers();
  };

  //html kodas
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>{editingId ? "Edit User" : "Add New User"}</h1>
      
      <form onSubmit={handleSubmit}>
        <input placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
        <input placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
        <input placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <button type="submit">{editingId ? "Update User" : "Add User"}</button>
        {editingId && <button onClick={() => {setEditingId(null); setFormData({firstName:'', lastName:'', email:''})}}>Cancel</button>}
      </form>

      <h2>All Users</h2>
      <ul>
        {users.map(user => (
          <li key={user._id} style={{ marginBottom: '10px' }}>
            {user.firstName} {user.lastName} - {user.email}
            <button onClick={() => startEdit(user)} style={{ marginLeft: '10px' }}>Edit</button>
            <button onClick={() => deleteUser(user._id)} style={{ marginLeft: '5px', color: 'red' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;