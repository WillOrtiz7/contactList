// Selectors
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggestionBox = searchWrapper.querySelector(".autocom-box");

// Event Listeners
inputBox.onkeyup = (event) => {
  let userInput = event.target.value;
  let emptyArray = [];
  if (userInput) {
    emptyArray = suggestions.filter((input) => {
      // Filtering user input to return names in database which start with the input entered
      return input.toLocaleLowerCase().startsWith(userInput.toLocaleLowerCase());
    });
    emptyArray = emptyArray.map((input) => {
      return (input = "<li>" + input + "</li>");
    });
    console.log(emptyArray);
    // Show autocomplete box
    searchWrapper.classList.add("active");
    showSuggestions(emptyArray);
    let allList = suggestionBox.querySelectorAll("li");
    for (let i = 0; i < allList.length; i++){
      // Adding on click attribute to each contacts li
      allList[i].setAttribute("onclick", "select(this)");
    }
  }else{
    // Hide autocomplete box
    searchWrapper.classList.remove("active");
  }
};

// Functions

// We will use this function to open the drop down showing the contacts info
function select(element){
  let selectUserData = element.textContent;
  if (selectUserData != "No matching contact"){
    inputBox.value = selectUserData;
    searchWrapper.classList.remove("active");
  }
}

function showSuggestions(list){
  let listData;
  if (!list.length){
    listData = "<li>"+ "No matching contact" +"</li>"
  }else{
    listData = list.join('');
  }
  suggestionBox.innerHTML = listData;
}