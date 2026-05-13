const BASE_URL = 'https://rickandmortyapi.com/api/character';

async function getCharacters({page, name, status}){

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (name) params.append('name', name);
    if (status) params.append('status', status);

    //console.log(params.toString());

    try {
        const response = await fetch(`${BASE_URL}?${params.toString()}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al buscar personajes: ', error);
    }
};