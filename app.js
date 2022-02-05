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

  if (event.target.matches(".delete-button")) {
    console.log("This is working. id of the contact is " + event.target.id);
    deleteContact(event.target.id);
  }

  const isDropdown = event.target.matches(".dropdown-button");

  if (!isDropdown && event.target.closest(".login-dropdown") != null) return;

  let currButton;

  if (isDropdown) {
    currButton = event.target.id;
    currAction = currButton + "-dropdown";
    console.log(currButton);

    // Add contact keeps its animation when toggling between hidden and not hidden
    if (currButton == "add-contact"){
      searchContactInput.value = "";
      document.getElementById("add-contact-menu").classList.toggle("hidden");
      setTimeout(function(){
        document.getElementById(currAction).classList.toggle("active");
      }, 100);
      removePopups(currAction);
      return;
    }
    document.getElementById(currAction).classList.toggle("active");
    removePopups(currAction);
  }
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

  // Checks if user submitted any empty fields when registering
  if (!firstName || !lastName || !user || !pass){
    if (document.getElementById("register-error-text")){
      document.getElementById("register-error-text").remove();
    }
    let errorMessage = document.createElement("p");
    errorMessage.setAttribute("class", "popup list");
    errorMessage.setAttribute("id", "register-error-text");
    errorMessage.innerHTML = "INVALID REGISTER INFORMATION";
    document.getElementById("register-error").appendChild(errorMessage);
    return;
  }

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
        let errorMessage = document.createElement("p");
        errorMessage.setAttribute("class", "popup list");
        document.getElementById("register-error").appendChild(errorMessage);
        errorMessage.innerHTML = response.error;
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
      
      // If the user is attempting to log in with invalid info send error message
      if (info.error.length != 0) {
        if (document.getElementById("error-message-text")){
          document.getElementById("error-message-text").remove();
        }
        let errorMessage = document.createElement("p");
        errorMessage.setAttribute("class", "popup list");
        errorMessage.setAttribute("id", "error-message-text");
        document.getElementById("login-error").appendChild(errorMessage);
        errorMessage.innerHTML = "INVALID USERNAME OR PASSWORD";
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
        loginText.innerHTML = "Welcome, " + user;

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
          document.getElementById("add-contact-first-name").value = "";
          document.getElementById("add-contact-last-name").value = "";
          document.getElementById("add-contact-email").value = "";
          document.getElementById("add-contact-phone-number").value = "";
          document.getElementById("add-contact-dropdown").classList.remove("active");
          document.getElementById("add-contact-menu").classList.toggle("hidden");

          const confirmMessage = document.createElement("h3");
          confirmMessage.setAttribute("class", "text-white text-center popup list");
          confirmMessage.setAttribute("id", "confirmMessage");
          document.getElementById("main-content").appendChild(confirmMessage);
          confirmMessage.innerHTML = "Successfully added " + addContactObj.firstName + " " + addContactObj.lastName;
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
    document
      .querySelectorAll(".search-result-list")
      .forEach((searchResultList) => {
        searchResultList.remove();
      });

    document
      .querySelectorAll(".contact-info-table")
      .forEach((contactInfoTable) => {
        contactInfoTable.remove();
      });

    document
      .querySelectorAll(".search-results-container")
      .forEach((searchResultsContainer) => {
        searchResultsContainer.remove();
      });

    if (
      document
        .getElementById("add-contact-dropdown")
        .classList.contains("active")
    ) {
      console.log("Testing");
      document
        .getElementById("add-contact-dropdown")
        .classList.toggle("active");
    }

    let userInput = document.getElementById("real-search-bar").value;
    let searchContactObj = {
      userId: userID,
      userInput: userInput,
    };
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
          removePopups(0);
        } else {
          console.log("Successfully searched for contact");
          const searchResultsContainer = document.createElement("div");
          searchResultsContainer.setAttribute("class", "search-results-container popup");
          searchResultsContainer.setAttribute("id", "search-results-container");
          // Checks all contacts for potential matching letters from user input
          for (let i = 0; i < response.firstNames.length; i++) {
            if (document.getElementById("contact-" + response.ids[i]) != null) {
              continue;
            }

            if (userInput.length > 0) {
              console.log(response.firstNames[i] + " " + response.lastNames[i] + " " + response.ids[i]);
              // Creating the element that will show the contacts first and last name on screen
              const li = document.createElement("li");
              const viewContact = document.createElement("span");
              const textNode = document.createTextNode(
                response.firstNames[i] + " " + response.lastNames[i]
              );
              const deleteButton = document.createElement("button");
              const editButton = document.createElement("button");
              const viewButton = document.createElement("button");
              const icon = document.createElement("i");
              const editIcon = document.createElement("i");
              const viewIcon = document.createElement("i");
              icon.setAttribute("class", " fas fa-trash-alt delete-button");
              icon.setAttribute("id", response.ids[i]);
              editIcon.setAttribute("class", "fas fa-edit edit-button");
              editIcon.setAttribute("id", "edit-icon-" + response.ids[i]);
              viewIcon.setAttribute("class", "fas fa-eye view-button");
              viewIcon.setAttribute("id", "view-icon-" + response.ids[i]);

              // Creating buttons for each contact
              deleteButton.appendChild(icon);
              deleteButton.setAttribute("class", "delete-button");
              deleteButton.setAttribute("id", response.ids[i]);
              editButton.appendChild(editIcon);
              editButton.setAttribute("class", "edit-button");
              editButton.setAttribute("id", "edit-button-" + response.ids[i]);
              viewButton.appendChild(viewIcon);
              viewButton.setAttribute("class", "view-button");
              viewButton.setAttribute("id", "view-button-" + response.ids[i]);

              // Adding the completed buttons to the list of contacts
              viewContact.appendChild(textNode);
              li.appendChild(viewContact);
              li.appendChild(deleteButton);
              li.appendChild(editButton);
              li.appendChild(viewButton);
              li.setAttribute("id", "contact-" + response.ids[i]);
              li.setAttribute("class", "search-result-list");
              viewButton.addEventListener(
                "click",
                executeRetrieveContact.bind(
                  executeRetrieveContact,
                  response.ids[i],
                  "view"
                )
              );
              editButton.addEventListener(
                "click",
                executeRetrieveContact.bind(
                  executeRetrieveContact,
                  response.ids[i],
                  "edit"
                )
              );

              // Creating search results div
              const searchResults = document.createElement("div");
              searchResults.setAttribute("class", "list popup search-results");
              searchResults.setAttribute("id", "search-list");
              const searchBar = document.getElementById("search-bar");
              searchResultsContainer.appendChild(searchResults);
              searchBar.appendChild(searchResultsContainer);
              removePopups(searchResults.id);
              searchResults.appendChild(li);
            }
            if (userInput.length == 0){
              removePopups(0);
            }
          }
        }
      }
    };

    link.send(searchContactJSON);
    console.log(searchContactJSON);
  }
}

function executeEditContact(firstName, lastName, email, phoneNumber, id) {

  const editContactDropdownFrame = document.createElement("div");
  editContactDropdownFrame.setAttribute("id", "edit-contact");
  editContactDropdownFrame.setAttribute("class", "popup list text-white");
  editContactDropdownFrame.setAttribute("style", "font-size: 16pt");


  const firstNameInput = document.createElement("input");
  const lastNameInput = document.createElement("input");
  const phoneNumberInput = document.createElement("input");
  const emailInput = document.createElement("input");
  const lineBreak = document.createElement("br");
  const editContactSubmitButton = document.createElement("button");

  firstNameInput.setAttribute("class", "login-form edit");
  lastNameInput.setAttribute("class", "login-form edit");
  phoneNumberInput.setAttribute("class", "login-form edit");
  emailInput.setAttribute("class", "login-form edit");

  // Creating the edit contact dropdown
  firstNameInput.setAttribute("value", firstName);
  lastNameInput.setAttribute("value", lastName);
  phoneNumberInput.setAttribute("value", phoneNumber);
  emailInput.setAttribute("value", email);

  firstNameInput.setAttribute("type", "text");
  lastNameInput.setAttribute("type", "text");
  phoneNumberInput.setAttribute("type", "text");
  emailInput.setAttribute("type", "text");
  
  editContactSubmitButton.setAttribute("type", "button");
  editContactSubmitButton.setAttribute("class", "login text-white");
  editContactSubmitButton.innerHTML = "Confirm";

  let addContactDropdown = document.getElementById("add-contact-dropdown");
  addContactDropdown.appendChild(editContactDropdownFrame);

  editContactDropdownFrame.innerHTML = "Editing " + firstName + " " + lastName;
  editContactDropdownFrame.appendChild(document.createElement("br"));
  editContactDropdownFrame.appendChild(firstNameInput);
  editContactDropdownFrame.appendChild(lastNameInput);
  editContactDropdownFrame.appendChild(phoneNumberInput);
  editContactDropdownFrame.appendChild(emailInput);
  editContactDropdownFrame.appendChild(lineBreak);
  editContactDropdownFrame.appendChild(editContactSubmitButton);

  removePopups(editContactDropdownFrame.id);

  editContactSubmitButton.addEventListener(
    "click",
    submitEditContact.bind(submitEditContact, id)
  );

  function submitEditContact(id) {

    let editContactObj = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      phoneNumber: phoneNumberInput.value,
      emailAddress: emailInput.value,
      id: id,
    };

    document.getElementById("edit-contact").remove();

    let editContactJSON = JSON.stringify(editContactObj);
    let link = new XMLHttpRequest();
    let requestUrl = urlBase + "/EditContact.php";
    link.open("POST", requestUrl, true);
    link.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    link.setRequestHeader("Access-Control-Allow-Origin", urlBase);
    link.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(link.responseText);
        if (response.error.length != 0) {
          console.log(response.error);
        } else {
          console.log("Successfully edited contact");

          const confirmMessage = document.createElement("h3");
          confirmMessage.setAttribute("class", "text-white text-center popup list");
          confirmMessage.setAttribute("id", "confirmMessage");
          document.getElementById("main-content").appendChild(confirmMessage);
          confirmMessage.innerHTML = "Successfully updated " + editContactObj.firstName + " " + editContactObj.lastName;

        }
      }
    };
    console.log(editContactJSON);
    link.send(editContactJSON);
  }
}

function deleteContact(id) {
  // Give user an alert message to confirm if they want to delete the contact
  const deletedContact = document.getElementById("contact-" + id);
  if (confirm("Are you sure you want to delete this contact?")) {
    // Animation for a contact being deleted
    deletedContact.remove();
    deleteJSON = { id: id };
    deleteJSON = JSON.stringify(deleteJSON);
    console.log(id + " " + deleteJSON);

    let link = new XMLHttpRequest();
    let requestUrl = urlBase + "/RemoveContact.php";
    link.open("POST", requestUrl, true);
    link.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    link.setRequestHeader("Access-Control-Allow-Origin", urlBase);
    link.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Testing deletion");
        let response = JSON.parse(link.responseText);
        if (response.error.length != 0) {
          console.log(response.error);
        } else {
          console.log("Deleted contact successfully");
        }
      }
    };
    link.send(deleteJSON);
  }
}

function executeRetrieveContact(id, type) {
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
        if (type === "edit") {
          executeEditContact(firstName, lastName, email, phoneNumber, id);
        } 
        
        else {
          
          const openContact = document.createElement("div");
          openContact.setAttribute("id", "open-contact");
          openContact.setAttribute("class", "popup list text-white text-center border");
          openContact.setAttribute("style", "font-size: 16pt");


          const firstName = document.createElement("div");
          const lastName = document.createElement("div");
          const phoneNumber = document.createElement("div");
          const email = document.createElement("div");

          const name = document.createElement("div");
          name.setAttribute("class", "row");
          name.setAttribute("style", "height:100px");

          const info = document.createElement("div");
          info.setAttribute("class", "row");
          info.setAttribute("style", "height:100px");

          info.appendChild(phoneNumber);
          info.appendChild(email);

          name.appendChild(firstName);
          name.appendChild(lastName);

          firstNameLine = document.createElement("u");
          lastNameLine = document.createElement("u");
          phoneNumberLine = document.createElement("u");
          emailLine = document.createElement("u");

          firstNameLine.innerHTML = "First Name";
          lastNameLine.innerHTML = "Last Name";
          phoneNumberLine.innerHTML = "Phone Number";
          emailLine.innerHTML = "Email Address";

          firstName.setAttribute("class", " contact-info border col-6");
          lastName.setAttribute("class", "contact-info border col-6");
          phoneNumber.setAttribute("class", "contact-info border col-6");
          email.setAttribute("class", "contact-info border col-6");

          firstName.appendChild(firstNameLine);
          lastName.appendChild(lastNameLine);
          phoneNumber.appendChild(phoneNumberLine);
          email.appendChild(emailLine);

          firstName.appendChild(document.createElement("br"));
          lastName.appendChild(document.createElement("br"));
          phoneNumber.appendChild(document.createElement("br"));
          email.appendChild(document.createElement("br"));

          firstName.appendChild(document.createTextNode(response.firstName)); 
          lastName.appendChild(document.createTextNode(response.lastName));
          phoneNumber.appendChild(document.createTextNode(response.phoneNumber));
          email.appendChild(document.createTextNode(response.emailAddress));



          let addContactDropdown = document.getElementById("main-content");
          addContactDropdown.appendChild(openContact);

          openContact.appendChild(name);
          openContact.appendChild(info);

           removePopups(openContact.id);
        }
      }
    }
  };

  link.send(retrieveContactJSON);
}

function logOut() {

  removePopups(0);

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
  document.getElementById("add-contact-dropdown").classList.remove("active");

  isLoggedIn = false;
}

function removePopups(id) {
  const addContactMenu = document.getElementById("add-contact-menu");
  if (!addContactMenu.classList.contains("hidden") && id != "add-contact-dropdown"){
    addContactMenu.classList.add("hidden");
  }
  document.querySelectorAll(".popup").forEach((popup) => {
    if (popup.id == id) {
      console.log("Conditional is working");
      return;
    } else {
      if (popup.classList.contains("login-dropdown")) {
        // Clears all inputs that are within a form upon their respective dropdown being closed
        document.querySelectorAll(".login-form").forEach((input) => {
          if(input.classList.contains("edit")){
            return;
          }

          input.value = "";
        });
        console.log("Drop down " + popup.id);
        popup.classList.remove("active");
        console.log("REMOVE POPUPS INPUT VALUE: " + document.getElementById("real-search-bar").value);
      } else if (popup.classList.contains("list")) {
        console.log("List " + popup.id);
        popup.remove();
      }
    }
  });
}