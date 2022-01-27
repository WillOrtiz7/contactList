// SELECTORS
const searchBar = document.getElementById("search-input");
const urlBase = "http://cop4331-27.com/LAMPAPI";
const ext = ".php";

// OTHER VARIABLES
let contactNames = [];

// EVENT LISTENERS

// Adds an event listener to the search bar which triggers whenver the user types
searchBar.addEventListener("keyup", (event) => {
  const searchString = event.target.value;
  console.log(event.target.value);
  const filteredContacts = contactNames.filter((contact) => {
    return contact.name.includes(searchString);
  });
  console.log(filteredContacts);
});

document.addEventListener("click", (event) => {
  const isButton = event.target.matches(".login");

  if (!isButton && event.target.closest(".login-dropdown") != null) return;

  let currButton;

  if (isButton) {
    currButton = event.target.closest(".login-dropdown");
    currButton.classList.toggle("active");
  }

  document.querySelectorAll(".login-dropdown.active").forEach((button) => {
    if (button === currButton) return;
    button.classList.remove("active");
  });
});

document.onkeydown = (event) => {
  if (event.key == "Enter") {
    let currAction = event.target.closest(".login-menu");

    if (currAction == document.getElementById("register")) {
      executeRegister();
      event.preventDefault();
    }
  }
};

// FUNCTIONS

// We will use this function to open the drop down showing the contacts info
function select(element) {
  let selectUserData = element.textContent;
  if (selectUserData != "No matching contact") {
    inputBox.value = selectUserData;
    searchWrapper.classList.remove("active");
  }
  searchWrapper.classList.remove("active");
}

function executeRegister() {
  let firstName = document.getElementById("first-name").value;
  let lastName = document.getElementById("last-name").value;
  let user = document.getElementById("desired-user").value;
  let pass = document.getElementById("desired-password").value;

  let obj = {
    login: user,
    password: pass,
    firstName: firstName,
    lastName: lastName,
  };
  obj = JSON.stringify(obj);

  let link = new XMLHttpRequest();
  let requestUrl = urlBase + "/Register.php";
  link.open("POST", requestUrl, true);
  link.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  link.setRequestHeader("Access-Control-Allow-Origin", urlBase);
  link.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(link.responseText);
      if (response.error.length != 0) {
        console.log(response.error);
      } else {
        console.log("Successfully registered");
      }
    }
  };
  link.send(obj);
  console.log(firstName, lastName, user, pass);
}

function showSuggestions(list) {
  let listData;
  if (!list.length) {
    listData = "<li>" + "No matching contact" + "</li>";
  } else {
    listData = list.join("");
  }
  suggestionBox.innerHTML = listData;
}
