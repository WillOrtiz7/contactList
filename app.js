// Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

// Event Listeners
// document.addEventListener('DOMContentLoaded', getTodos);
// todoButton.addEventListener('click', searchContact);
// todoList.addEventListener('click', deleteCheck);
// todoInput.addEventListener('input', searchContact);

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