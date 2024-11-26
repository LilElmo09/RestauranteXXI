import './SoporteAdmin.css';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function SoporteAdmin() {
  const [tickets, setTickets] = useState([]);
  const adminId = localStorage.getItem('id'); 
    const adminName = localStorage.getItem('nombre'); 

  useEffect(() => {
    fetch("http://localhost:3000/get-tickets-admin")
      .then((response) => response.json())
      .then((data) => setTickets(data))
      .catch((error) => console.error("Error al cargar tickets:", error));
  }, []);

  const getStatusClass = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "status pendiente";
      case "En curso":
        return "status enCurso";
      case "Resuelto":
        return "status resuelto";
      default:
        return "status";
    }
  };

  const handleTakeTicket = (ticketId) => {
    fetch(`http://localhost:3000/take-ticket-admin/${ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ administrador_id: adminId })
    })
      .then(response => response.json())
      .then(() => {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === ticketId
              ? { ...ticket, estado: "En curso", administrador_id: adminId, asignado: adminName } // Asignar id y nombre
              : ticket
          )
        );
      })
      .catch(error => console.error("Error al tomar el ticket:", error));
  };

  const handleResolveTicket = (ticketId) => {
    Swal.fire({
      title: 'Resolver Ticket',
      input: 'textarea',
      inputLabel: 'Respuesta',
      showCancelButton: true,
      confirmButtonText: 'Resolver',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/close-ticket-admin/${ticketId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mensaje_respuesta: result.value })
        })
          .then(response => response.json())
          .then(() => {
            setTickets((prevTickets) =>
              prevTickets.map((ticket) =>
                ticket.id === ticketId
                  ? { ...ticket, estado: "Resuelto", mensaje_respuesta: result.value }
                  : ticket
              )
            );
          })
          .catch(error => console.error("Error al resolver el ticket:", error));
      }
    });
  };

  return (
    <div className="container-support">
      <h1>Soporte</h1>

      <div className="table-container">
        <table className="support-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Solicitante</th>
              <th>Asunto</th>
              <th>Fecha Creación</th>
              <th>Estado</th>
              <th>Asignado</th>
              <th>Respuesta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="ticket-row">
                <td>{ticket.id}</td>
                <td>{ticket.email}</td>
                <td>{ticket.asunto}</td>
                <td>
                  {ticket.fecha_creacion !== "--"
                    ? new Date(ticket.fecha_creacion).toLocaleString()
                    : "--"}
                </td>
                <td>
                  <span id="pos-estado" className={getStatusClass(ticket.estado)}>
                    {ticket.estado}
                  </span>
                </td>
                <td>{ticket.asignado || "--"}</td>
                <td>{ticket.mensaje_respuesta || "--"}</td>
                <td className="btns-options-ticket flex-center">
                  <button
                    className={`action-btn edit-btn ${ticket.asignado ? "disabled" : ""}`}
                    onClick={() => handleTakeTicket(ticket.id)}
                    disabled={Boolean(ticket.asignado)}
                  >
                    Tomar ticket
                  </button>
                  <button
                    className={`action-btn delete-btn ${ticket.estado === "Resuelto" || ticket.administrador_id !== adminId ? "disabled" : ""}`}
                    onClick={() => handleResolveTicket(ticket.id)}
                    disabled={ticket.estado === "Resuelto" || ticket.administrador_id !== adminId}
                  >
                    Resolver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
