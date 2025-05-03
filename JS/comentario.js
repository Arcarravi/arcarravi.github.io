function publicarComentario() {
    const nombre = document.getElementById('nombreComentario')?.value.trim() || "Anónimo";
    const mensaje = document.getElementById('comentario')?.value.trim();
  
    if (!mensaje) {
      alert("Por favor escribe un comentario.");
      return;
    }
  
    const nuevoComentario = {
      nombre: nombre,
      mensaje: mensaje,
      fecha: new Date().toLocaleString()
    };
  
    const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
    comentariosGuardados.push(nuevoComentario);
    localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));
  
    mostrarComentarios();
  
    document.getElementById('comentario').value = "";
    document.getElementById('nombreComentario').value = "";
  }
  
  function mostrarComentarios() {
    const contenedor = document.querySelector('.comentarios');
    if (!contenedor) return;
  
    const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
  
    contenedor.innerHTML = comentariosGuardados.map(c => `
      <div class="comentario">
        <strong>${c.nombre}</strong> <em>${c.fecha}</em>
        <p>${c.mensaje}</p>
      </div>
    `).join('');
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('enviar-comentario');
    if (boton) {
      boton.addEventListener('click', publicarComentario);
      mostrarComentarios();
    }
  });
  