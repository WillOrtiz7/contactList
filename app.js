// Selectors
const contactInput = document.querySelector('.contact-input');
const searchButton = document.querySelector('.search-button');

// Event Listeners

// Functions

function searchContact(){
    let input = document.getElementById("input-text").value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName('contacts');
    let listMod = document.getElementById("list")
      
    for (i = 0; i < x.length; i++) { 
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        }
        else if (input === ""){
            listMod.style.display = "none";
        }
        else {
            x[i].style.display = "list-item";
            listMod.style.display = "list-item";                 
        }
    }
}