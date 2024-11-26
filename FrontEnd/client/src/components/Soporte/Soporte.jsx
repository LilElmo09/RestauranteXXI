import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./Soporte.css";

export default function Soporte() {
  const [tickets, setTickets] = useState([]);
  const [deletingTicketId, setDeletingTicketId] = useState(null);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);
  const id = localStorage.getItem("id");

  useEffect(() => {
    fetchTickets();
  }, [id]);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`http://localhost:3000/get-tickets/${id}`);
      const data = await response.json();
      const formattedData = data.map((ticket) => ({
        ...ticket,
        asignado: ticket.asignado || "--",
        mensaje_respuesta: ticket.mensaje_respuesta || "--",
        fecha_creacion: ticket.fecha_creacion ? new Date(ticket.fecha_creacion) : "--",
      }));
      setTickets(formattedData);
    } catch (error) {
      console.error("Error al obtener los tickets: ", error);
    }
  };

  const handleDeleteTicket = (ticketId) => {
    Swal.fire({
      title: '<span style="color:#d32f2f;">¿Estás seguro?</span>',
      html: "<p style='color:#4a4a4a; font-size:16px;'>Esta acción eliminará tanto ticket como sus respuestas y no podrá deshacerse.</p>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: '<span style="color:white;">Sí, eliminar</span>',
      cancelButtonText: "<span>Cancelar</span>",
      reverseButtons: true,
      buttonsStyling: false,
      scrollbarPadding: false,
      customClass: {
        popup: "swal-popup-custom",
        confirmButton: "swal-cancel-btn-2",
        cancelButton: "swal-cancel-btn",
      },
      background: "#fefefe",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingTicketId(ticketId);
        try {
          const response = await fetch(`http://localhost:3000/delete-ticket/${ticketId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            // Espera antes de eliminar el ticket para ver la animación
            setTimeout(() => {
              setTickets((prevTickets) =>
                prevTickets.filter((ticket) => ticket.id !== ticketId)
              );
              setDeletingTicketId(null);
            }, 1000); // 1000ms = 1s, coincide con la duración de `fadeOutAnimation`

            Swal.fire({
      text: 'Ticket eliminado',
      icon: 'success',
      toast: true,
      position: 'top',
      timer: 1200,
      timerProgressBar: true,
      showCloseButton: false,
      showConfirmButton: false,
      scrollbarPadding: false,
    });
          } else {
            Swal.fire("Error", "Hubo un problema al eliminar el ticket", "error");
          }
        } catch (error) {
          console.error("Error al eliminar el ticket:", error);
          Swal.fire("Error", "Hubo un problema al eliminar el ticket", "error");
        }
      }
    });
  };

  const handleEditTicket = (ticketId, currentMessage) => {
    Swal.fire({
      title: "Editar Ticket",
      html: `<input id="edit-message" class="swal2-input" placeholder="Asunto" value="${currentMessage}" />`,
      showCancelButton: true,
      confirmButtonText: "Modificar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const updatedMessage = document.getElementById("edit-message").value;
        if (!updatedMessage) {
          Swal.showValidationMessage("El asunto no puede estar vacío");
        }
        return updatedMessage;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setUpdatingTicketId(ticketId);
        try {
          const response = await fetch(`http://localhost:3000/update-ticket/${ticketId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mensaje: result.value }),
          });
          if (response.ok) {
            setTickets((prevTickets) =>
              prevTickets.map((ticket) =>
                ticket.id === ticketId ? { ...ticket, asunto: result.value } : ticket
              )
            );
            Swal.fire({
              icon: 'success',
              text: '¡Actualización exitosa!',
              toast: true,
              position: 'top',
              timer: 2000,
              timerProgressBar: true,
              showCloseButton: false,
              showConfirmButton: false,
            });
          } else {
            Swal.fire("Error", "Hubo un problema al modificar el ticket", "error");
          }
        } catch (error) {
          console.error("Error al modificar el ticket:", error);
          Swal.fire("Error", "Hubo un problema al modificar el ticket", "error");
        } finally {
          // Quitar la clase de actualización después de 1s
          setTimeout(() => {
            setUpdatingTicketId(null);
          }, 1000);
        }
      }
    });
  };

  const handleCreateTicket = () => {
    Swal.fire({
      title: "Crear Ticket",
      html: `<input id="mensaje" class="swal2-input" placeholder="Escribe tu mensaje" required />`,
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const mensaje = document.getElementById("mensaje").value;
        if (!mensaje) {
          Swal.showValidationMessage("El mensaje no puede estar vacío");
        }
        return { usuario_id: id, mensaje };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("http://localhost:3000/add-ticket/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(result.value),
          });

          if (response.ok) {
            fetchTickets();
            Swal.fire("¡Ticket creado!", "Tu ticket ha sido creado exitosamente.", "success");
          } else {
            Swal.fire("Error", "Hubo un problema al crear el ticket", "error");
          }
        } catch (error) {
          console.error("Error al crear el ticket:", error);
          Swal.fire("Error", "Hubo un problema al crear el ticket", "error");
        }
      }
    });
  };

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

  return (
    <div className="container-support">
      
      <h1>Soporte</h1>
      <button onClick={handleCreateTicket} className="crear-cuenta-btn">
        <i className="fas fa-plus"></i>
        <span>Crear Ticket</span>
      </button>

      <div className="table-container">
        <table className="support-table">
          <thead>
            <tr>
              <th>ID</th>
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
              <tr
                key={ticket.id}
                className={`ticket-row ${deletingTicketId === ticket.id ? "fade-out" : ""} ${
                  updatingTicketId === ticket.id ? "updating" : ""
                }`}
              >
                <td>{ticket.id}</td>
                <td>{ticket.asunto}</td>
                <td>{ticket.fecha_creacion !== "--" ? new Date(ticket.fecha_creacion).toLocaleString() : "--"}</td>
                <td>
                  <span id="pos-estado" className={getStatusClass(ticket.estado)}>
                    {ticket.estado}
                  </span>
                </td>
                <td>{ticket.asignado}</td>
                <td>{ticket.mensaje_respuesta}</td>
                <td className="btns-options-ticket flex-center">
                  <button onClick={() => handleEditTicket(ticket.id, ticket.asunto)} className="action-btn edit-btn">
                    Editar
                  </button>
                  <button onClick={() => handleDeleteTicket(ticket.id)} className="action-btn delete-btn">
                    Eliminar
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
