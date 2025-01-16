document.getElementById('buscarPokemon').addEventListener('click', () => {
    const pokeNombre = document.getElementById('pokeNombre').value.toLowerCase();
    if (pokeNombre) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokeNombre}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ese Pokémon No Existe');
                }
                return response.json();
            })
            .then(data => {
                displayPokeData(data);
            })
            .catch(error => {
                document.getElementById('pokeData').innerHTML = '<p style="color:red;">Pokémon no encontrado</p>';
            });
    }
});

function displayPokeData(pokemon) {
    const pokeDataDiv = document.getElementById('pokeData');
    pokeDataDiv.innerHTML = `
        <h2>${capitalizeFirstLetter(pokemon.name)}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <table id="pokemonTable">
            <thead>
                <tr>
                    <th>Características</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                <!-- Aquí se insertarán los datos del Pokémon -->
            </tbody>
        </table>
    `;

    // Llenamos la tabla con los datos del Pokémon
    const pokemonTableBody = pokeDataDiv.querySelector('#pokemonTable tbody');

    // Agregar el nombre
    agregarFila(pokemonTableBody, 'Nombre', capitalizeFirstLetter(pokemon.name));

    // Agregar tipo
    const tipos = pokemon.types.map(type => type.type.name).join(', ');
    agregarFila(pokemonTableBody, 'Tipo', tipos);

    // Agregar habilidades
    const habilidades = pokemon.abilities.map(ability => ability.ability.name).join(', ');
    agregarFila(pokemonTableBody, 'Habilidades', habilidades);

    // Agregar estadísticas
    pokemon.stats.forEach(stat => {
        agregarFila(pokemonTableBody, capitalizeFirstLetter(stat.stat.name), stat.base_stat);
    });

    // Agregar altura y peso
    agregarFila(pokemonTableBody, 'Altura', `${(pokemon.height / 10).toFixed(1)} m`);
    agregarFila(pokemonTableBody, 'Peso', `${(pokemon.weight / 10).toFixed(1)} kg`);
}

// Función auxiliar para agregar una fila a la tabla
function agregarFila(tabla, caracteristica, valor) {
    const fila = tabla.insertRow();
    const celdaCaracteristica = fila.insertCell(0);
    const celdaValor = fila.insertCell(1);

    celdaCaracteristica.textContent = caracteristica;
    celdaValor.textContent = valor;
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// script.js

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    let pokemonList = [];
    let currentIndex = 0;

    // Función para obtener un Pokémon aleatorio
    function getRandomPokemon() {
        const randomId = Math.floor(Math.random() * 898) + 1; // PokeAPI tiene 898 Pokémon hasta la fecha
        return fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
            .then(response => response.json())
            .then(pokemon => {
                return {
                    name: pokemon.name,
                    types: pokemon.types.map(type => type.type.name).join(', '),
                    image: pokemon.sprites.front_default,
                };
            });
    }

    // Función para agregar un Pokémon al carrusel
    async function addPokemonToCarousel() {
        const pokemon = await getRandomPokemon();
        pokemonList.push(pokemon);
        
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        item.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <h3>${capitalizeFirstLetter(pokemon.name)}</h3>
            <p>Tipo: ${pokemon.types}</p>
        `;
        carousel.appendChild(item);
    }

    // Función para mover el carrusel
    function updateCarousel() {
        const offset = -currentIndex * 100; // Mover el carrusel por el número de elementos
        carousel.style.transform = `translateX(${offset}%)`;
    }

    // Función para mover al siguiente Pokémon
    nextButton.addEventListener('click', () => {
        if (currentIndex < pokemonList.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Si llega al final, vuelve al inicio
        }
        updateCarousel();
        addPokemonToCarousel(); // Añadir un Pokémon nuevo
    });

    // Función para mover al anterior Pokémon
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = pokemonList.length - 1; // Si está en el principio, va al final
        }
        updateCarousel();
    });

    // Función para capitalizar la primera letra de cada nombre de Pokémon
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Cargar los primeros Pokémon en el carrusel
    for (let i = 0; i < 5; i++) {
        addPokemonToCarousel(); // Inicialmente agregar 5 Pokémon
    }
});
