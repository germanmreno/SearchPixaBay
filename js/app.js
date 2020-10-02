const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

const registrosPagina = 30;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector("#termino").value;

    if (terminoBusqueda === "") {
        mostrarAlerta("Agrega un término a la búsqueda");
        return;
    }

    paginaActual = 1;
    buscarImagenes();
}

function mostrarAlerta(msj) {
    const msjAlerta = document.querySelector(".bg-red-100");

    if (!msjAlerta) {
        const alerta = document.createElement("p");
        alerta.classList.add(
            "bg-red-100",
            "border-red-400",
            "text-red-700",
            "px-4",
            "py-3",
            "rounded",
            "max-w-lg",
            "mx-auto",
            "mt-6",
            "text-center"
        );

        alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block sm:inline">${msj}</span>`;

        formulario.appendChild(alerta);

        setInterval(() => {
            alerta.remove();
        }, 3000);
    }
}

async function buscarImagenes() {
    const termino = document.querySelector("#termino").value;

    const apiKEY = "18538825-0d5cdd688c52a5593aad45554";
    const URL = `https://pixabay.com/api/?key=${apiKEY}&q=${termino}&per_page=${registrosPagina}&page=${paginaActual}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();
        totalPaginas = calcularPaginas(data.totalHits);
        mostrarImagenes(data.hits);
    } catch (error) {
        console.log(error);
    }
}

function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPagina));
}

function mostrarImagenes(imagenes) {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    imagenes.forEach((imagen) => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}" />

                <div class="p-4">
                    <p class="font-bold">${likes}</p> <span class="font-light">Me gusta</span>
                    <p class="font-bold">${views}</p> <span class="font-light">Veces vista</span>

                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                    href="${largeImageURL}" target="_blank">
                        Ver Imagen
                    </a>
                </div>
            </div>
        </div> `;
    });

    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    imprimirPaginador();
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (true) {
        const { value, done } = iterador.next();
        if (done) return;

        const boton = document.createElement("a");
        boton.href = "#";
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add(
            "siguiente",
            "bg-yellow-400",
            "px-4",
            "py-1",
            "mr-2",
            "font-bold",
            "mb-10",
            "rounded"
        );
        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        };

        paginacionDiv.appendChild(boton);
    }
}
