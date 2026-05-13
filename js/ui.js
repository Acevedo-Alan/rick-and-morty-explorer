function renderCharacters(results){
    const contenedor = document.getElementById('contenedor-personajes') //Obtenemos el contenedor donde se mostrarán los personajes

    contenedor.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos personajes


    results.forEach(personaje => {  //Recorremos el array de personajes y por cada uno de ellos creamos una tarjeta con su información
        contenedor.innerHTML += `
            <div class='card'>
                <h3>${personaje.name}</h3>
                <img src="${personaje.image}" alt="${personaje.name}">
                <p>Status: ${personaje.status}</p>
                <p>Species: ${personaje.species}</p>
                <p>Origin: ${personaje.origin.name}</p>
            </div>
        `;
    });
};