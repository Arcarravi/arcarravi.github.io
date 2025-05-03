//Carga General del formulario
function cargarformulario(nombre) {
  fetch(`${nombre}.html`)
    .then(res => res.text())
    .then(html => {
      const contenedor = document.getElementById('formulario-dinamico');
      contenedor.innerHTML = html;

      if (nombre === 'biblioteca') {
        iniciarBiblioteca();
      }

      if (nombre === 'comentario') {
        iniciarComentario();
      }
    })
    .catch(() => {
      document.getElementById('formulario-dinamico').innerHTML = '<p>Error al cargar la sección.</p>';
    });
}

// === Comentarios ===
function iniciarComentario() {
  const boton = document.getElementById('enviar-comentario');
  const nombreInput = document.getElementById('nombreComentario');
  const comentarioInput = document.getElementById('comentario');

  if (boton && nombreInput && comentarioInput) {
    boton.addEventListener('click', () => {
      const nombre = nombreInput.value.trim() || "Anónimo";
      const mensaje = comentarioInput.value.trim();

      if (!mensaje) {
        alert("Por favor escribe un comentario.");
        comentarioInput.focus();
        return;
      }

      const nuevoComentario = {
        nombre,
        mensaje,
        fecha: new Date().toLocaleString()
      };

      const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
      comentariosGuardados.push(nuevoComentario);
      localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));

      mostrarComentarios();
      comentarioInput.value = "";
      nombreInput.value = "";
    });

    mostrarComentarios();
  }
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

// === Biblioteca ===
const libros = [
  "1984 - George Orwell",
  "Cien Años de Soledad - Gabriel García Márquez",
  "El Principito - Antoine de Saint-Exupéry"
];

function iniciarBiblioteca() {
  const select = document.getElementById('libros');
  const input = document.getElementById('busqueda');

  function actualizarSelect() {
    select.innerHTML = "";
    libros.forEach((libro, i) => {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = libro;
      select.appendChild(option);
    });
  }

  document.getElementById('btn-agregar').addEventListener('click', () => {
    const texto = input.value.trim();
    const resultado = document.getElementById('resultado-busqueda');
  
    if (!texto) {
      resultado.textContent = '⚠️ Ingresa un nombre de libro.';
      resultado.style.color = 'orange';
      return;
    }
  
    const existe = libros.some(libro => libro.toLowerCase() === texto.toLowerCase());
  
    if (existe) {
      resultado.textContent = '⚠️ El libro ya existe en la biblioteca.';
      resultado.style.color = 'crimson';
    } else {
      libros.push(texto);
      actualizarSelect();
      resultado.textContent = '✅ Libro agregado correctamente.';
      resultado.style.color = 'green';
      input.value = '';
    }
  });

  document.getElementById('btn-eliminar').addEventListener('click', () => {
    const texto = input.value.trim();
    const resultado = document.getElementById('resultado-busqueda');
  
    if (!texto) {
      resultado.textContent = '⚠️ Ingresa un nombre de libro.';
      resultado.style.color = 'orange';
      return;
    }
  
    const indice = libros.findIndex(libro => libro.toLowerCase() === texto.toLowerCase());
  
    if (indice !== -1) {
      libros.splice(indice, 1);
      actualizarSelect();
      resultado.textContent = '🗑️ Libro eliminado correctamente.';
      resultado.style.color = 'blue';
      input.value = '';
    } else {
      resultado.textContent = '❌ No se encontró el libro para eliminar.';
      resultado.style.color = 'crimson';
    }
  });

  document.getElementById('btn-buscar').addEventListener('click', () => {
    const texto = input.value.trim().toLowerCase();
    const encontrado = libros.find(libro => libro.toLowerCase().includes(texto));
  
    const resultado = document.getElementById('resultado-busqueda');
    if (encontrado) {
      resultado.textContent = `✅ Libro encontrado: ${encontrado}`;
      resultado.style.color = 'green';
    } else {
      resultado.textContent = '❌ No se encontró el libro.';
      resultado.style.color = 'crimson';
    }
  });

  actualizarSelect();
}

// === Menú y botones de estilo ===
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('biblioteca').addEventListener('click', e => {
    e.preventDefault();
    cargarformulario('biblioteca');
  });

  document.getElementById('contacto').addEventListener('click', e => {
    e.preventDefault();
    cargarformulario('contacto');
  });

  document.getElementById('comentario').addEventListener('click', e => {
    e.preventDefault();
    cargarformulario('comentario');
  });

  document.getElementById('modo-oscuro').addEventListener('click', () => {
    document.body.classList.toggle('oscuro');
  });

  document.getElementById('color-formulario').addEventListener('click', () => {
    document.getElementById('formulario-dinamico').classList.toggle('cambiocolor');
  });

  document.getElementById('pantalla-completa').addEventListener('click', () => {
    document.getElementById('formulario-dinamico').classList.toggle('cambiopantalla');
  });

  document.getElementById('agregar-bordes').addEventListener('click', () => {
    document.getElementById('formulario-dinamico').classList.toggle('cambiobordes');
  });

  // Carga inicial por defecto
  cargarformulario('biblioteca');
  mostrarComentarios();
});
