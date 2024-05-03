import { nameSearchRB, typeSearchRB } from './main';

// saving and loading the last radio button selection from local storage
const saveLastRB = (radioButtonState:string) => {
    localStorage.setItem("RB", radioButtonState)
}
const loadLastRB = () => {
    let RB:string = localStorage.getItem("RB");
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
const saveLastSearchTerm = (searchTerm:string) => {
    localStorage.setItem("lastSearchTerm", searchTerm);
}

const loadLastSearchTerm = () => {
    let lastSearchTerm:string = localStorage.getItem("lastSearchTerm");
    if (lastSearchTerm) {
        const searchTerm:HTMLInputElement = document.querySelector("#searchterm");
        searchTerm.value = lastSearchTerm;
    }
}

export { saveLastRB, loadLastRB, saveLastSearchTerm, loadLastSearchTerm };