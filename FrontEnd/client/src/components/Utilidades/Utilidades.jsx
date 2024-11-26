import "./Utilidades.css";
import Swal from "sweetalert2";

export default function Utilidades() {

    const handleCreateUtilites = () => {
        Swal.fire({
            title: 'Añadir Utilidades',
            html: `
                <input id="nombre" class="swal2-input" placeholder="Nombre" required />
                <input id="descripcion" class="swal2-input" placeholder="Descripción" required />
                <input id="costo" class="swal2-input" placeholder="Costo" required/>
                <input id="cantidad" class="swal2-input" placeholder="Cantidad" required/>
                <input id="responsable" class="swal2-input" placeholder="Responsable" required/>
            `,
            showCancelButton: true,
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nombre = document.getElementById('nombre').value;
                const descripcion = document.getElementById('descripcion').value;
                const costo = document.getElementById('costo').value;
                const cantidad = document.getElementById('cantidad').value;
                const responsable = document.getElementById('responsable').value;

                if (!nombre || !descripcion || !costo || !cantidad || !responsable) {
                    Swal.showValidationMessage('Todos los campos son requeridos');
                }
                return { nombre, descripcion, costo, cantidad, responsable };
            },
        }).then(async (result) => {
            // backend
        });
    }

    return (
        <div className="container-utilities">
            <h1>Utilidades</h1>
            <button onClick={handleCreateUtilites} className="create-cuenta-btn">
                <i className="fas fa-plus "> </i>
                <span>Crear Utilidad</span>
            </button>

            <div className="table-container">
                <table className="utilities-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Fecha Creación</th>
                            <th>Costo</th>
                            <th>Cantidad</th>
                            <th>Responsable</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    )
}