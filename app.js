// API ENDPOINT : `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`

const form = document.querySelector('form');
const input = document.querySelector('input');
const errorMsg = document.querySelector('.error-msg');
const loader = document.querySelector('.loader');
const resultsDisplay = document.querySelector('.results-display');

form.addEventListener("submit", handleSubmit) //form submit par defaut

function handleSubmit(e) {
    e.preventDefault()
    if (input.value === "") {
        errorMsg.textContent = "Wops, veuillez remplir l'input";
        return;
    } else {
        errorMsg.textContent = "";
        loader.style.display = "flex";
        resultsDisplay.textContent = "";
        wikiApiCAll(input.value);
        
    }
}

async function wikiApiCAll (searchInput) {

    try {

     const response = await fetch (`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`)
     
     if (!response.ok) {
        throw new Error (`${response.status}`) // Erreur de la reponse du fetch, status: false, erreur 404
     }// fetch n 'envoi pas cet erreur

     const data = await response.json();
     console.log(data);

    //  {batchcomplete: '', continue: {…}, query: {…}}
        // batchcomplete: 
        // ""
        // continue: {sroffset: 20, continue: '-||'}
        // query: 
        //     search: Array(20)
        //         0: {ns: 0, title: 'Cat', pageid: 6678, size: 152430, wordcount: 15543, …}
        //         1: {ns: 0, title: 'Cat (disambiguation)', pageid: 434590, size: 6324, wordcount: 709, …}
        //         2: {ns: 0, title: '.cat', pageid: 1978706, size: 10098, wordcount: 893, …}
        //         3: {ns: 0, title: "Schrödinger's cat", pageid: 27856, size: 42909, wordcount: 4903, …}
        //         ...
        //         19: {ns: 0, title: 'Siamese cat', pageid: 63087, size: 35757, wordcount: 4154, …}
     
        createCards(data.query.search)
    }
    catch (error) { // Erreur de network, comme panne internet, ...
        errorMsg.textContent = `${error}`;
        loader.style.display = "none";
    }
}


function createCards (data) {
    if (!data.length) {
        errorMsg.textContent = "Wopsy, aucun résultat";
        loader.style.display = "none";
        return;
    }
    data.forEach(el => {
        
        const url = `https://en.wikipedia.org/?curid=${el.pageid}`

        const card = document.createElement('div');
        card.className = 'result-item';
        card.innerHTML = `<h3 class= 'result-title'> <a href = ${url} target = '_blank'>${el.title}</a></h3>
                          <a href = ${url} class = "result-link" target = "_blank">${url}</a>
                          <span class = "result-snippet">${el.snippet}</span>
                          <br>
                          `
        resultsDisplay.appendChild(card);
    });
    loader.style.display = "none";
}