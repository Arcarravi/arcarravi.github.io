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

      if (nombre === 'contacto') {
        iniciarValidacionFormulario();
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
  const mensajeInput = document.getElementById('mensajeComentario');

  if (boton && nombreInput && mensajeInput) {
    boton.addEventListener('click', () => {
      const nombre = nombreInput.value.trim() || "Anónimo";
      const mensaje = mensajeInput.value.trim();

      if (!mensaje) {
        alert("Por favor escribe un comentario.");
        mensajeInput.focus();
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
      mensajeInput.value = "";
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

// verificar campos de formulario
function iniciarValidacionFormulario() {
  const boton = document.querySelector('button[type="submit"]');
  if (!boton) return;

  const tooltip = document.getElementById("tooltip-error");

  boton.addEventListener('click', (e) => {
    e.preventDefault(); // Evitar envío por ahora

    const campos = [
      { id: "nombre", mensaje: "Ingresa tu nombre completo." },
      { id: "motivo", mensaje: "Selecciona un motivo válido.", tipo: "select" },
      { id: "direccion", mensaje: "Ingresa ciudad y estado." },
      { id: "telefono", mensaje: "Teléfono inválido (10 dígitos).", regex: /^[0-9]{10}$/ },
      { id: "email", mensaje: "Correo electrónico inválido.", regex: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/ },
      { id: "mensaje", mensaje: "Escribe tu solicitud o mensaje." }
    ];

    for (let campo of campos) {
      const input = document.getElementById(campo.id);
      const valor = input.value.trim();
      const esValido = campo.regex ? campo.regex.test(valor) : valor !== "";

      if ((campo.tipo === "select" && valor === "") || !esValido) {
        mostrarTooltip(input, campo.mensaje, tooltip);
        input.focus();
        return;
      }
    }

    ocultarTooltip(tooltip);
    mostrarGlobo();
  });
}

function mostrarTooltip(campo, mensaje, tooltip) {
  const rect = campo.getBoundingClientRect();
  tooltip.textContent = mensaje;
  tooltip.style.top = `${rect.top + window.scrollY - 35}px`;
  tooltip.style.left = `${rect.left + window.scrollX}px`;
  tooltip.style.display = "block";
}

function ocultarTooltip(tooltip) {
  tooltip.style.display = "none";
}

//mensaje y globo
function mostrarGlobo() {
  const globo = document.getElementById("globo");
  const mensaje = document.getElementById("mensaje-exito");

  if (!globo || !mensaje) return;

  let tamaño = 40;
  let emoji = "🎈";

  globo.style.display = "block";
  globo.style.fontSize = `${tamaño}px`;
  globo.textContent = emoji;

  mensaje.style.display = "block";
  mensaje.textContent = "✅ Envío exitoso";

  // Evita que las teclas ↑ ↓ hagan scroll
  const prevenirScroll = (e) => {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }
  };

  //Aumentar o disminuir tamaño de globo
  const controlarGlobo = (e) => {
    if (!["ArrowUp", "ArrowDown"].includes(e.key)) return;

    if (e.key === "ArrowUp") {
      tamaño *= 1.1;
    } else if (e.key === "ArrowDown" && tamaño > 15) {
      tamaño *= 0.9;
    }

    globo.textContent = tamaño > 120 ? "💥" : "🎈";
    globo.style.fontSize = `${tamaño}px`;
  };

  document.addEventListener("keydown", controlarGlobo);
  document.addEventListener("keydown", prevenirScroll, { passive: false });

  // Ocultar globo y mensaje después de 10 segundos
  setTimeout(() => {
    globo.style.display = "none";
    mensaje.style.display = "none";
    document.removeEventListener("keydown", controlarGlobo);
    document.removeEventListener("keydown", prevenirScroll);
  }, 15000);
}