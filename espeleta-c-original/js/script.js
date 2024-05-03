"use strict";

window.onload = loadPage;
// global variables
// set variables for radio button selections
let nameSearchRB;
let typeSearchRB;
//what the user searched for
let displayTerm = "";
// array of Pokemon types, will be used to create checkboxes and display and check Pokemon types
let types = ["normal", "fire", "water", "grass", "electric", "ice",
    "fighting", "poison", "ground", "flying", "psychic", "bug", "rock",
    "ghost", "dragon", "dark", "steel", "fairy"];

function loadPage() {
    nameSearchRB = document.querySelector("input[value='name']");
    typeSearchRB = document.querySelector("input[value='type']");
    // display proper features and add event handlers
    display();
    // do searchButtonClicked function if the search button is clicked
    document.querySelector("#search").onclick = searchButtonClicked;
    // load previously saved radio button and search term
    loadLastRB();
    loadLastSearchTerm();
    // initialize what's displayed
    // if the name search radio button is selected
    if (nameSearchRB.checked) {
        document.querySelector("p").innerHTML = "Type the name of a Pokémon!"
        document.querySelector("#checkboxes").style.display = "none";
        document.querySelector("#searchterm").style.display = "block";
        document.querySelector("#content").innerHTML = "";
        document.querySelector("#status").innerHTML = "Ready to Search!";
    }
    // if the type search radio button is selected
    if (typeSearchRB.checked) {
        document.querySelector("p").innerHTML = "Click on the checkboxes to filter through Pokémon of certain types!"
        document.querySelector("#checkboxes").style.display = "block";
        document.querySelector("#searchterm").style.display = "none";
        document.querySelector("#previous").style.display = "none";
        document.querySelector("#next").style.display = "none";
        document.querySelector("#content").innerHTML = "";
        document.querySelector("#status").innerHTML = "Ready to Search!";
    }
    // create checkboxes for Pokemon type search feature
    for (let type of types) {
        let checkbox = document.createElement("label");
        checkbox.innerHTML = `<label for="${type}">
        <input type="checkbox" id="${type}" name="type"> ${type}
    </label>`
        let checkboxList = document.querySelector("#checkboxes");
        checkboxList.appendChild(checkbox);
    }
}

// display different features depending on which radio button is clicked
function display() {
    // also offer support for hitting enter key instead of pressing button
    document.addEventListener('keypress', (e) => {
        let keyName = e.key;
        if (keyName === 'Enter') {
            searchButtonClicked();
        }
    });
    // if the name search radio button is clicked, hide the checkboxes and show the search bar
    nameSearchRB.addEventListener("click", () => {
        document.querySelector("#checkboxes").style.display = "none";
        document.querySelector("#searchterm").style.display = "block";
        document.querySelector("#content").innerHTML = "";
        document.querySelector("#status").innerHTML = "Ready to Search!";
        document.querySelector("p").innerHTML = "Type the name of a Pokémon!"
    });
    // if the type search radio button is clicked, show checkboxes and hide everything else
    typeSearchRB.addEventListener("click", () => {
        document.querySelector("#checkboxes").style.display = "block";
        document.querySelector("#searchterm").style.display = "none";
        document.querySelector("#previous").style.display = "none";
        document.querySelector("#next").style.display = "none";
        document.querySelector("#content").innerHTML = "";
        document.querySelector("#status").innerHTML = "Ready to Search!";
        document.querySelector("p").innerHTML = "Click on the checkboxes to filter through Pokémon of certain types!"
    });
}

// function for what happens after the search button is clicked
function searchButtonClicked() {
    // if the name search radio button is selected
    if (nameSearchRB.checked) {
        // save radio button selection to local storage
        saveLastRB("Name");
        // display previous and next buttons
        document.querySelector("#previous").style.display = "block";
        document.querySelector("#next").style.display = "block";
        // set up url
        const SERVICE_URL = "https://pokeapi.co/api/v2/pokemon/";
        let url = SERVICE_URL;
        // grab term from search bar, trim and turn it to lower case (not case-sensitive)
        let term = document.querySelector("#searchterm").value;
        displayTerm = term;
        term = term.trim();
        term = term.toLowerCase();
        term = encodeURIComponent(term);
        // prompt the user for an input if there is nothing in the search bar
        if (term.length < 1) {
            document.querySelector("#status").innerHTML = "<b> Please enter a search term! </b>";
            return;
        }
        // add term to url
        url += term;
        // save this to local storage
        saveLastSearchTerm(term);
        // set status
        document.querySelector("#status").innerHTML = "<b>Searching for " + displayTerm.toUpperCase() + "</b>";
        // grab data from API with getData function and generated url
        getData(url);
    }
    // if the type search radio button is selected
    if (typeSearchRB.checked) {
        // save radio button selection to local storage
        saveLastRB("Type");
        let checkboxes = document.querySelectorAll('input[name="type"]:checked');
        let checkboxValues = [];
        checkboxes.forEach((checkbox) => {
            checkboxValues.push(checkbox.id);
        })
        // prompt user to check checkboxes if they checked none
        if (checkboxValues.length == 0) {
            document.querySelector("#status").innerHTML = "<b>Please check checkboxes!</b>";
            document.querySelector("#content").innerHTML = "";
            return;
        }
        // prompt user to check fewer checkboxes if they check more than 2
        if (checkboxValues.length > 2) {
            document.querySelector("#status").innerHTML = "<b>Please check fewer checkboxes!</b>";
            document.querySelector("#content").innerHTML = "";
            return;
        }
        // reset content results
        document.querySelector("#content").innerHTML = "";
        // set status
        document.querySelector("#status").innerHTML = "<b>Searching for " + checkboxValues.toString().toUpperCase() + " type Pokemon" + "</b>";
        console.log(checkboxValues)
        // check for unused pokemon type combinations
        if ((checkboxValues.includes('normal') && checkboxValues.includes('ice'))
        || (checkboxValues.includes('normal') && checkboxValues.includes('bug'))
        || (checkboxValues.includes('normal') && checkboxValues.includes('rock'))
        || (checkboxValues.includes('normal') && checkboxValues.includes('steel'))
        || (checkboxValues.includes('fire') && checkboxValues.includes('fairy'))
        || (checkboxValues.includes('ice') && checkboxValues.includes('poison'))
        || (checkboxValues.includes('ground') && checkboxValues.includes('fairy'))
        || (checkboxValues.includes('bug') && checkboxValues.includes('dragon'))
        || (checkboxValues.includes('rock') && checkboxValues.includes('ghost'))){
            document.querySelector("#status").innerHTML = "<b>There are no Pokémon with this type combination!</b>";
            return;
        }
        // loop through all Pokemon for type data
        for (let i = 1; i < 1018; i++) {
            let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
            getData(url);
        }
    }
}

function getData(url) {
    // create new XHR object
    let xhr = new XMLHttpRequest();
    // set onload handler
    xhr.onload = dataLoaded;
    // set onerror handler
    xhr.onerror = dataError;
    // open connections and send request
        xhr.open("GET", url);
        xhr.send();
}

function dataError(e) {
    // when an error occurs
    alert("An error occured.");
}

function dataLoaded(e) {
    let xhr = e.target;
    let obj;
    // try to turn object into parsable JS object
    try {
        obj = JSON.parse(xhr.responseText);
    }
    catch {
        // if it doesn't work, change status, clear content, and return out of the function
        document.querySelector("#status").innerHTML = "<b> No results found! </b>";
        document.querySelector("#content").innerHTML = "";
        console.clear();
        return;
    }
    // setting pokemon info variables
    let pokemonName = obj.name;
    let pokemonId = obj.id;
    let pokemonTypes = [];
    // added a loop in the instance the pokemon has more than one type
    for (let i = 0; i < obj.types.length; i++) {
        pokemonTypes.push(obj.types[i].type.name);
    }
    // if the type search radio button is clicked
    if (typeSearchRB.checked) {
        // select all checked checkboxes
        let checkboxes = document.querySelectorAll('input[name="type"]:checked');
        let checkboxValues = [];
        // add them all to an array
        checkboxes.forEach((checkbox) => {
            checkboxValues.push(checkbox.id);
        })
        // check to see if a pokemon's type(s) includes the selected checkboxes
        // EX: If the user selects the water checkbox,
        // They can see a pokemon with a water and ground type combination.
        // If the user selects the water and ground checkbox,
        // They cannot see pokemon that only have the water type.
        if ((checkboxValues.every(element => { return pokemonTypes.includes(element) })) && checkboxValues.length > 0) {
            // grab sprite
            let pokemonSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
            // generate result with pokemon info
            let line = `<div class='result'><img src=${pokemonSprite} title='${pokemonName}'/>`;
            line += `<br><span>${pokemonName.toUpperCase()}</span>`
            line += `<br><span>#${pokemonId}</span><br>`
            for (let i = 0; i < pokemonTypes.length; i++) {
                line += `<span>${pokemonTypes[i].toUpperCase()}</span><br>`
            }
            // add to content
            document.querySelector("#content").innerHTML += line;
        }
        // return out if no checkboxes were selected
        if (checkboxValues.length > 0) {
            return;
        }
    }
    // if the name search radio button is selected
    if (nameSearchRB.checked) {
        // what happens when you click the previous and next buttons
        document.querySelector("#previous").onclick = previousButtonClicked;
        document.querySelector("#next").onclick = nextButtonClicked;
        function nextButtonClicked() {
            // if on the last pokemon, prevent user from going further
            if (obj.id == 1017) {
                document.querySelector("#status").innerHTML = `<b> You can't go any further! </b>`;
                return;
            }
            // grab data for next pokemon
            getData(`https://pokeapi.co/api/v2/pokemon/${obj.id + 1}`)
            // get rid of text in search bar
            document.querySelector("#searchterm").value = "";
        }
        function previousButtonClicked() {
            // if on the first pokemon, prevent user from going further back
            if (obj.id == 1) {
                document.querySelector("#status").innerHTML = `<b> You can't go any further! </b>`;
                return;
            }
            // grab data for previous pokemon
            getData(`https://pokeapi.co/api/v2/pokemon/${obj.id - 1}`);
            // get rid of text in search bar
            document.querySelector("#searchterm").value = "";
        }
        // grab sprite
        let pokemonSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
        // generate result with pokemon info
        let line = `<div class='result'><img src=${pokemonSprite} title='${pokemonName}'/>`;
        line += `<br><span>${pokemonName.toUpperCase()}</span>`
        line += `<br><span>#${pokemonId}</span><br>`
        for (let i = 0; i < pokemonTypes.length; i++) {
            line += `<span>${pokemonTypes[i].toUpperCase()}</span><br>`
        }
        // set it to content
        document.querySelector("#content").innerHTML = line;
        // update status (used to update status for previous and next buttons)
        document.querySelector("#status").innerHTML = "<b>Searching for " + pokemonName.toUpperCase() + "</b>";
    }
}

// saving and loading the last radio button selection from local storage
function saveLastRB(radioButtonState) {
    localStorage.setItem("RB", radioButtonState)
}
function loadLastRB() {
    let RB = localStorage.getItem("RB");
    if (RB) {
        if (RB == "Name") {
            nameSearchRB.checked = true;
        }
        if (RB == "Type") {
            typeSearchRB.checked = true;
        }
    }
}

// saving and loading the last search term entered from local storage
function saveLastSearchTerm(searchTerm) {
    localStorage.setItem("lastSearchTerm", searchTerm);
}
function loadLastSearchTerm() {
    let lastSearchTerm = localStorage.getItem("lastSearchTerm");
    if (lastSearchTerm) {
        document.querySelector("#searchterm").value = lastSearchTerm;
    }
}