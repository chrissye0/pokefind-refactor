import * as main from "./main";
import * as storage from "./local-storage";

// function for what happens after the search button is clicked
const searchButtonClicked = () => {
    //what the user searched for
    let displayTerm: string = "";
    // if the name search radio button is selected
    if (main.nameSearchRB.checked) {
        // save radio button selection to local storage
        storage.saveLastRB("Name");
        // display previous and next buttons
        main.previousButton.style.display = "block";
        main.nextButton.style.display = "block";
        // set up url
        const SERVICE_URL: string = "https://pokeapi.co/api/v2/pokemon/";
        let url: string = SERVICE_URL;
        // grab term from search bar, trim and turn it to lower case (not case-sensitive)
        const searchTerm: HTMLInputElement = document.querySelector("#searchterm");
        let term: string = searchTerm.value;
        displayTerm = term;
        term = term.trim();
        term = term.toLowerCase();
        term = encodeURIComponent(term);
        // prompt the user for an input if there is nothing in the search bar
        if (term.length < 1) {
            main.status.innerHTML = "<b> Please enter a search term! </b>";
            return;
        }
        // add term to url
        url += term;
        // save this to local storage
        storage.saveLastSearchTerm(term);
        // set status
        main.status.innerHTML = "<b>Searching for " + displayTerm.toUpperCase() + "</b>";
        // grab data from API with getData function and generated url
        main.getData(url);
    }
    // if the type search radio button is selected
    if (main.typeSearchRB.checked) {
        // save radio button selection to local storage
        storage.saveLastRB("Type");
        let checkboxes: NodeListOf<Element> = document.querySelectorAll('input[name="type"]:checked');
        let checkboxValues: Array<string> = [];
        checkboxes.forEach((checkbox) => {
            checkboxValues.push(checkbox.id);
        })
        // prompt user to check checkboxes if they checked none
        if (checkboxValues.length == 0) {
            main.status.innerHTML = "<b>Please check checkboxes!</b>";
            main.content.innerHTML = "";
            return;
        }
        // prompt user to check fewer checkboxes if they check more than 2
        if (checkboxValues.length > 2) {
            main.status.innerHTML = "<b>Please check fewer checkboxes!</b>";
            main.content.innerHTML = "";
            return;
        }
        // reset content results
        main.content.innerHTML = "";
        // set status
        main.status.innerHTML = "<b>Searching for " + checkboxValues.toString().toUpperCase() + " type Pokemon" + "</b>";
        // check for unused pokemon type combinations
        if ((checkboxValues.indexOf('normal') != -1 && checkboxValues.indexOf('ice') != -1)
            || (checkboxValues.indexOf('normal') != -1 && checkboxValues.indexOf('bug') != -1)
            || (checkboxValues.indexOf('normal') != -1 && checkboxValues.indexOf('rock') != -1)
            || (checkboxValues.indexOf('normal') != -1 && checkboxValues.indexOf('steel') != -1)
            || (checkboxValues.indexOf('fire') != -1 && checkboxValues.indexOf('fairy') != -1)
            || (checkboxValues.indexOf('ice') != -1 && checkboxValues.indexOf('poison') != -1)
            || (checkboxValues.indexOf('ground') != -1 && checkboxValues.indexOf('fairy') != -1)
            || (checkboxValues.indexOf('bug') != -1 && checkboxValues.indexOf('dragon') != -1)
            || (checkboxValues.indexOf('rock') != -1 && checkboxValues.indexOf('ghost') != -1)) {
            main.status.innerHTML = "<b>There are no Pokémon with this type combination!</b>";
            return;
        }
        // loop through all Pokemon for type data
        for (let i = 1; i < 1018; i++) {
            let url: string = `https://pokeapi.co/api/v2/pokemon/${i}`;
            main.getData(url);
        }
    }
}

export { searchButtonClicked };