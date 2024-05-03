import * as storage from './local-storage';
import * as search from './search';

// global variables
// set variables for radio button selections
let nameSearchRB: HTMLInputElement;
let typeSearchRB: HTMLInputElement;
// array of Pokemon types, will be used to create checkboxes and display and check Pokemon types
let types: Array<string> = ["normal", "fire", "water", "grass", "electric", "ice",
    "fighting", "poison", "ground", "flying", "psychic", "bug", "rock",
    "ghost", "dragon", "dark", "steel", "fairy"];

const searchButton: HTMLButtonElement = document.querySelector("#search");
const instructions: HTMLParagraphElement = document.querySelector("p");
const checkboxes: HTMLDivElement = document.querySelector("#checkboxes");
const content: HTMLDivElement = document.querySelector("#content");
const status: HTMLDivElement = document.querySelector("#status");
const previousButton: HTMLButtonElement = document.querySelector("#previous");
const nextButton: HTMLButtonElement = document.querySelector("#next");
const searchTerm: HTMLInputElement = document.querySelector("#searchterm");

const init = () => {
    nameSearchRB = document.querySelector("input[value='name']");
    typeSearchRB = document.querySelector("input[value='type']");

    // display proper features and add event handlers
    display();
    // do searchButtonClicked function if the search button is clicked
    searchButton.onclick = search.searchButtonClicked;
    // load previously saved radio button and search term
    storage.loadLastRB();
    storage.loadLastSearchTerm();
    // initialize what's displayed
    // if the name search radio button is selected
    if (nameSearchRB.checked) {
        instructions.innerHTML = "Type the name of a Pokémon!"
        checkboxes.style.display = "none";
        searchTerm.style.display = "block";
        content.innerHTML = "";
        status.innerHTML = "Ready to Search!";
    }
    // if the type search radio button is selected
    if (typeSearchRB.checked) {
        instructions.innerHTML = "Click on the checkboxes to filter through Pokémon of certain types!"
        checkboxes.style.display = "block";
        searchTerm.style.display = "none";
        previousButton.style.display = "none";
        nextButton.style.display = "none";
        content.innerHTML = "";
        status.innerHTML = "Ready to Search!";
    }
    // create checkboxes for Pokemon type search feature
    for (let type of types) {
        let checkbox: HTMLLabelElement = document.createElement("label");
        checkbox.innerHTML = `<label for="${type}">
        <input type="checkbox" id="${type}" name="type"> ${type}
    </label>`
        checkboxes.appendChild(checkbox);
    }
}

// display different features depending on which radio button is clicked
const display = () => {
    // also offer support for hitting enter key instead of pressing button
    document.addEventListener('keypress', (e) => {
        const keyName: string = e.key;
        if (keyName === 'Enter') {
            search.searchButtonClicked();
        }
    });
    // if the name search radio button is clicked, hide the checkboxes and show the search bar
    nameSearchRB.addEventListener("click", () => {
        checkboxes.style.display = "none";
        searchTerm.style.display = "block";
        content.innerHTML = "";
        status.innerHTML = "Ready to Search!";
        instructions.innerHTML = "Type the name of a Pokémon!"
    });
    // if the type search radio button is clicked, show checkboxes and hide everything else
    typeSearchRB.addEventListener("click", () => {
        checkboxes.style.display = "block";
        searchTerm.style.display = "none";
        previousButton.style.display = "none";
        nextButton.style.display = "none";
        content.innerHTML = "";
        status.innerHTML = "Ready to Search!";
        instructions.innerHTML = "Click on the checkboxes to filter through Pokémon of certain types!"
    });
}

const getData = (url: string) => {
    // create new XHR object
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    // set onload handler
    xhr.onload = dataLoaded;
    // set onerror handler
    xhr.onerror = dataError;
    // open connections and send request
    xhr.open("GET", url);
    xhr.send();
}

const dataError = (e) => {
    // when an error occurs
    alert("An error occured.");
}

const dataLoaded = (e) => {
    const xhr = e.target;
    let obj: { name: string, id: number, types: { type: { name: string } }[] };
    // try to turn object into parsable JS object
    try {
        obj = JSON.parse(xhr.responseText);
    }
    catch {
        // if it doesn't work, change status, clear content, and return out of the function
        status.innerHTML = "<b> No results found! </b>";
        content.innerHTML = "";
        console.clear();
        return;
    }
    // setting pokemon info variables
    let pokemonName: string = obj.name;
    let pokemonId: number = obj.id;
    let pokemonTypes: Array<string> = [];
    // added a loop in the instance the pokemon has more than one type
    for (let i = 0; i < obj.types.length; i++) {
        pokemonTypes.push(obj.types[i].type.name);
    }
    // if the type search radio button is clicked
    if (typeSearchRB.checked) {
        // select all checked checkboxes
        let checkboxes: NodeListOf<Element> = document.querySelectorAll('input[name="type"]:checked')
        let checkboxValues: Array<string> = [];
        // add them all to an array
        checkboxes.forEach((checkbox: Element) => {
            checkboxValues.push(checkbox.id);
        })
        // check to see if a pokemon's type(s) includes the selected checkboxes
        // EX: If the user selects the water checkbox,
        // They can see a pokemon with a water and ground type combination.
        // If the user selects the water and ground checkbox,
        // They cannot see pokemon that only have the water type.
        if ((checkboxValues.every(element => { return pokemonTypes.indexOf(element) != -1 })) && checkboxValues.length > 0) {
            // grab sprite
            let pokemonSprite: string = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
            // generate result with pokemon info
            let line: string = `<div class='result'><img src=${pokemonSprite} title='${pokemonName}'/>`;
            line += `<br><span>${pokemonName.toUpperCase()}</span>`
            line += `<br><span>#${pokemonId}</span><br>`
            for (let i = 0; i < pokemonTypes.length; i++) {
                line += `<span>${pokemonTypes[i].toUpperCase()}</span><br>`
            }
            // add to content
            content.innerHTML += line;
        }
        // return out if no checkboxes were selected
        if (checkboxValues.length > 0) {
            return;
        }
    }
    // if the name search radio button is selected
    if (nameSearchRB.checked) {
        // what happens when you click the previous and next buttons
        const nextButtonClicked = () => {
            // if on the last pokemon, prevent user from going further
            if (obj.id == 1017) {
                status.innerHTML = `<b> You can't go any further! </b>`;
                return;
            }
            // grab data for next pokemon
            getData(`https://pokeapi.co/api/v2/pokemon/${obj.id + 1}`)
            // get rid of text in search bar
            searchTerm.value = "";
        }
        const previousButtonClicked = () => {
            // if on the first pokemon, prevent user from going further back
            if (obj.id == 1) {
                status.innerHTML = `<b> You can't go any further! </b>`;
                return;
            }
            // grab data for previous pokemon
            getData(`https://pokeapi.co/api/v2/pokemon/${obj.id - 1}`);
            // get rid of text in search bar
            searchTerm.value = "";
        }
        previousButton.onclick = previousButtonClicked;
        nextButton.onclick = nextButtonClicked;
        // grab sprite
        let pokemonSprite: string = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
        // generate result with pokemon info
        let line: string = `<div class='result'><img src=${pokemonSprite} title='${pokemonName}'/>`;
        line += `<br><span>${pokemonName.toUpperCase()}</span>`
        line += `<br><span>#${pokemonId}</span><br>`
        for (let i = 0; i < pokemonTypes.length; i++) {
            line += `<span>${pokemonTypes[i].toUpperCase()}</span><br>`
        }
        // set it to content
        content.innerHTML = line;
        // update status (used to update status for previous and next buttons)
        status.innerHTML = "<b>Searching for " + pokemonName.toUpperCase() + "</b>";
    }
}

export { nameSearchRB, typeSearchRB, previousButton, nextButton, status, content, getData, init };