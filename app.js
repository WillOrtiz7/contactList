// Selectors
addContactSubmitButton = document.getElementById("add-contact-submit");
searchContactInput = document.getElementById("real-search-bar");

// Variables
const urlBase = "http://cop4331-27.com/LAMPAPI";
const ext = ".php";
let user = "Test";
let isLoggedIn = false;
let userID = 0;

// Event Listeners
addContactSubmitButton.addEventListener("click", executeAddContact);
searchContactInput.addEventListener("keyup", executeSearchContact);

document.addEventListener("click", (event) => {
  if (event.target.id == "log-out") {
    console.log("Testing");
    logOut();
    return;
  }

  if (event.target.id == "delete"){
    deleteContact()
  }

  const isButton = event.target.matches(".dropdown-button");

  if (!isButton && event.target.closest(".login-dropdown") != null) return;

  let currButton;

  if (isButton) {
    currButton = event.target.id;
    currAction = currButton + "-dropdown"
    console.log(currButton)
    document.getElementById(currButton + "-dropdown").classList.toggle("active");
  }

  document.querySelectorAll(".login-dropdown.active").forEach((button) => {
    if (button.id === currAction) return;
    button.classList.remove("active");
  });
});

document.onkeydown = (event) => {
  if (event.key == "Enter") {
    let currAction = event.target.closest(".login-menu");

    console.log(currAction);

    if (currAction == document.getElementById("register-menu")) {
      executeRegister();
    }

    if (currAction == document.getElementById("login-menu")) {
      executeLogin();
    }

    event.preventDefault();
  }
};

// Functions

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

function executeLogin() {
  let login = document.getElementById("user").value;
  let password = document.getElementById("pass").value;

  let loginObj = { login: login, password: password };
  loginObj = JSON.stringify(loginObj);

  let link = new XMLHttpRequest();
  let loginUrl = urlBase + "/Login.php";
  link.open("POST", loginUrl, true);
  link.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  link.setRequestHeader("Access-Control-Allow-Origin", urlBase);
  link.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let info = JSON.parse(link.responseText);
      if (info.error.length != 0) {
        console.log(info.error);
      } else {
        console.log("Successfully logged in as ", info.firstName);
        user = info.firstName;
        userID = info.id;
        isLoggedIn = true;
      }

      if (isLoggedIn) {
        document.querySelectorAll(".login-dropdown").forEach((button) => {
          button.classList.toggle("hidden");
        });

        let loginText = document.getElementById("logged-in");
        loginText.innerHTML = "Welcome " + user;

        document.querySelectorAll(".logged-in-ui").forEach((button) => {
          button.classList.toggle("hidden");
        });

        document.getElementById("unlogged-search").classList.toggle("hidden");
        document.getElementById("logged-search").classList.toggle("hidden");
      }
    }
  };
  link.send(loginObj);
  console.log(loginObj);
}

function executeAddContact() {
  // Check to see if user is logged in or not
  if (isLoggedIn == false) {
    console.log("Log in to add a contact");
  } else {
    console.log("Contact is being added");
    let addContactFirstName = document.getElementById(
      "add-contact-first-name"
    ).value;
    let addContactLastName = document.getElementById(
      "add-contact-last-name"
    ).value;
    let addContactPhoneNumber = document.getElementById(
      "add-contact-phone-number"
    ).value;
    let addContactEmail = document.getElementById("add-contact-email").value;
    
    // Create object with necessary info for api call
    let addContactObj = {
      firstName: addContactFirstName,
      lastName: addContactLastName,
      phoneNumber: addContactPhoneNumber,
      emailAddress: addContactEmail,
      userId: userID,
    };
    let addContactJSON = JSON.stringify(addContactObj);

    let link = new XMLHttpRequest();
    let requestUrl = urlBase + "/AddContact.php";
    link.open("POST", requestUrl, true);
    link.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    link.setRequestHeader("Access-Control-Allow-Origin", urlBase);
    link.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(link.responseText);
        if (response.error.length != 0) {
          console.log(response.error);
        } else {
          console.log("Successfully added contact");
        }
      }
    };
    console.log(addContactJSON);
    link.send(addContactJSON);
  }
}

function executeSearchContact() {
  // Check to see if user is logged in or not
  if (isLoggedIn == false) {
    console.log("Log in to search for a contact");
  } else {
    // Here we will clear the ul containing the list of contacts being displayed
    document.querySelectorAll(".search-result-list").forEach((searchResultList) => {
      searchResultList.remove();
    });

    let userInput = document.getElementById("real-search-bar").value;
    let searchContactObj = {
      userId: userID,
      userInput: userInput,
    }
    let searchContactJSON = JSON.stringify(searchContactObj);
    console.log("USER INPUT: " + userInput);
    let link = new XMLHttpRequest();
    let requestUrl = urlBase + "/PartialSearch.php";
    link.open("POST", requestUrl, true);
    link.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    link.setRequestHeader("Access-Control-Allow-Origin", urlBase);
    link.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(link.responseText);
        let response = JSON.parse(link.responseText);
        if (response.error.length != 0) {
          console.log(response.error);
        } else {
          console.log("Successfully searched for contact");
          // Checks all contacts for potential matching letters from user input
          for (let i = 0; i < response.firstNames.length; i++) {
            
            if(document.getElementById("contact-" + response.ids[i]) != null){
              continue;
            }
            
            if (userInput.length > 0) {
              console.log(response.firstNames[i] + " " + response.lastNames[i] + " " + response.ids[i]);
              // Creating the element that will show the contacts first and last name on screen
              const li = document.createElement("li");
              const textNode = document.createTextNode(response.firstNames[i] + " " + response.lastNames[i]);
              li.appendChild(textNode);
              li.setAttribute("id", "contact-" + response.ids[i]);
              li.setAttribute("class", "search-result-list");
              li.addEventListener("click", executeRetrieveContact.bind(executeRetrieveContact, id));
              const searchResults = document.getElementById("search-bar");
              searchResults.appendChild(li);

            }
          }
        }
      }
    };

    link.send(searchContactJSON);
    console.log(searchContactJSON);
  }
}
function deleteContact(){
  let firstName = document.getElementById("delete-first").value;
  let lastName = document.getElementById("delete-last").value;
  let phone = document.getElementById("delete-phone").value;
  let email = document.getElementById("delete-email").value;

  let contactObj = {userId:userID, firstName:firstName, lastName:lastName, 
                    phoneNumber:phone, emailAddress:email}
  }


function executeRetrieveContact(id) {
  document.querySelectorAll(".search-result-list").forEach((searchResultList) => {
      searchResultList.remove();
    });
  // Creating object with necessary info for api
  let retrieveContactObj = {
    id: id,
  };

  let retrieveContactJSON = JSON.stringify(retrieveContactObj);

  console.log(retrieveContactJSON);

  let link = new XMLHttpRequest();
    let requestUrl = urlBase + "/RetrieveContact.php";
    link.open("POST", requestUrl, true);
    link.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    link.setRequestHeader("Access-Control-Allow-Origin", urlBase);
    link.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(link.responseText);
        if (response.error.length != 0) {
          console.log(response.error);
        } else {
          console.log("Successfully retrieved contact");
          console.log(response);
          firstName = response.firstName;
          lastName = response.lastName;
          email = response.emailAddress;
          phoneNumber = response.phoneNumber;
          let contactInfoArray = [firstName, lastName, email, phoneNumber];
          const table = document.createElement("table");
          const tr = document.createElement("tr");
          for (let i = 0; i < 4; i++){
            const td = document.createElement("td");
            const textNode = document.createTextNode(contactInfoArray[i]);
            td.appendChild(textNode);
            td.setAttribute("class", "text-white");
            tr.appendChild(td);
          }
          const openContact = document.getElementById("open-contact");
          table.appendChild(tr);
          openContact.appendChild(table);
        }
      }
    };

    link.send(retrieveContactJSON);
}

function logOut() {
  document.querySelectorAll(".login-dropdown").forEach((button) => {
    button.classList.toggle("hidden");
  });

  let loginText = document.getElementById("logged-in");
  loginText.innerHTML = "";

  document.querySelectorAll(".logged-in-ui").forEach((button) => {
    button.classList.toggle("hidden");
  });

  document.getElementById("unlogged-search").classList.toggle("hidden");
  document.getElementById("logged-search").classList.toggle("hidden");

  isLoggedIn = false;
}

