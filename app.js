// Selectors
addContactSubmitButton = document.getElementById("add-contact-submit");
searchContactInput = document.getElementById("real-search-bar");
registerButton = document.getElementById("switch-reg-button");
loginButton = document.getElementById("switch-log-button");
logOutButton = document.getElementById("log-out");


// Variables
const urlBase = "http://cop4331-27.com/LAMPAPI";
const ext = ".php";
let user = "Test";
let isLoggedIn = false;
let userID = 0;
let onRegister = false;
// Event Listeners
addContactSubmitButton.addEventListener("click", executeAddContact);
searchContactInput.addEventListener("keyup", executeSearchContact);
registerButton.addEventListener("click", switchRegister);
loginButton.addEventListener("click", switchLogin) ;
logOutButton.addEventListener("click", executeLogOut);

document.addEventListener("click", (event) =>{

  target = event.target.id

  if(event.target.classList.contains("delete-button"))
  {
    deleteContact(target);
  }

  if (event.target.classList.contains("login-form")){
    removeErrorMessages();
  }

  if(target == "submit-button"){
    let button = document.getElementById("submit-button");

    if(button.innerHTML == "Register"){
      executeRegister();
    }

    else if(button.innerHTML == "Log in"){
      executeLogin();
    }
  }

  if(target == "add-contact"){
    doBlur("add-contact-overlay");
  }

  if(target == "view-overlay"){
    removePopups(0)
    document.querySelectorAll(".contact-info").forEach((data) => {
      data.remove();
    });
  }

  let overlay = event.target.closest(".container-fluid");
  if(event.target.classList.contains("contact-overlay")){
    undoBlur(overlay.id);
  }

})


// Functions

function executeRegister() {
  let firstName = document.getElementById("first-name").value;
  let lastName = document.getElementById("last-name").value;
  let user = document.getElementById("user").value;
  let pass = document.getElementById("pass").value;

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
  document.getElementById("user").value = "";
  document.getElementById("pass").value = "";
  switchLogin();
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
        errorMessage.setAttribute("class", "error-message text-white");
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
        
        undoBlur("login-overlay");
        document.getElementById("user").value = "";
        document.getElementById("pass").value = "";
        const messageArea = document.getElementById("message-area");
        const message = document.getElementById("welcome-message");
        message.innerHTML = "Welcome, " + info.firstName;
        messageArea.append(message);

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
  } 
  // Check for input errors in add contact
  else if (!document.getElementById("add-contact-first-name").validity.valid){
    removeErrorMessages();
    const firstNameErrorMessage = document.createElement("div");
    firstNameErrorMessage.setAttribute("class", "error-message popup list");
    firstNameErrorMessage.innerHTML = "Failed to add contact, invalid first name";
    const firstNameMessageFrame = document.getElementById("add-contact-menu");
    firstNameMessageFrame.appendChild(firstNameErrorMessage);
  }
  else if (!document.getElementById("add-contact-last-name").validity.valid){
    removeErrorMessages();
    const lastNameErrorMessage = document.createElement("div");
    lastNameErrorMessage.setAttribute("class", "error-message popup list");
    lastNameErrorMessage.innerHTML = "Failed to add contact, invalid last name";
    const lastNameMessageFrame = document.getElementById("add-contact-menu");
    lastNameMessageFrame.appendChild(lastNameErrorMessage);
  }
  else if (!document.getElementById("add-contact-phone-number").validity.valid){
    removeErrorMessages();
    const phoneNumberErrorMessage = document.createElement("div");
    phoneNumberErrorMessage.setAttribute("class", "error-message popup list");
    phoneNumberErrorMessage.innerHTML = "Failed to add contact, invalid phone number";
    const phoneNumberMessageFrame = document.getElementById("add-contact-menu");
    phoneNumberMessageFrame.appendChild(phoneNumberErrorMessage);
  }
  else if (!document.getElementById("add-contact-email").validity.valid){
    removeErrorMessages();
    const emailErrorMessage = document.createElement("div");
    emailErrorMessage.setAttribute("class", "error-message popup list");
    emailErrorMessage.innerHTML = "Failed to add contact, invalid email address";
    const errorMessageFrame = document.getElementById("add-contact-menu");
    errorMessageFrame.appendChild(emailErrorMessage);
  }
   else {
    console.log("Contact is being added");
    let addContactFirstName = document.getElementById("add-contact-first-name").value;
    let addContactLastName = document.getElementById("add-contact-last-name").value;
    let addContactPhoneNumber = document.getElementById("add-contact-phone-number").value;
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

          const confirmMessage = document.createElement("h3");
          confirmMessage.setAttribute("class", "text-white text-center popup list");
          confirmMessage.setAttribute("id", "confirmMessage");
          document.getElementById("main-content").appendChild(confirmMessage);
          confirmMessage.innerHTML = "Successfully added " + addContactObj.firstName + " " + addContactObj.lastName;
        }
      }
      removeErrorMessages();
      removePopups(0);
      undoBlur("add-contact-overlay");
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

    document.querySelectorAll(".contact-info-table").forEach((contactInfoTable) => {
        contactInfoTable.remove();
      });

    document.querySelectorAll(".search-results-container").forEach((searchResultsContainer) => {
        searchResultsContainer.remove();
      });

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
              li.setAttribute("class", "search-result-list text-black");
              viewButton.addEventListener("click", executeRetrieveContact.bind(executeRetrieveContact, response.ids[i], "view"));
              editButton.addEventListener("click", executeRetrieveContact.bind(executeRetrieveContact, response.ids[i], "edit"));

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
  // Activates edit contact overlay
  doBlur("edit-contact-overlay");

  const firstNameInput = document.getElementById("edit-contact-first-name");
  const lastNameInput = document.getElementById("edit-contact-last-name");
  const phoneNumberInput = document.getElementById("edit-contact-phone-number");
  const emailInput = document.getElementById("edit-contact-email");
  const editContactSubmitButton = document.getElementById("edit-contact-submit");
  const editContactTitle = document.getElementById("edit-contact-title");

  // Putting the contacts info in the fields
  firstNameInput.value = firstName;
  lastNameInput.value = lastName;
  phoneNumberInput.value = phoneNumber;
  emailInput.value = email;
  editContactTitle.innerHTML = "Editing " + firstName + " " + lastName;

  editContactSubmitButton.onclick = submitEditContact.bind(submitEditContact, firstNameInput, lastNameInput, phoneNumberInput, emailInput, id);

}

function submitEditContact(firstNameInput, lastNameInput, phoneNumberInput, emailInput, id) {
  if (!editContactValidityCheck(firstNameInput, lastNameInput, phoneNumberInput, emailInput)){
    return;
  }

  let editContactObj = {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    phoneNumber: phoneNumberInput.value,
    emailAddress: emailInput.value,
    id: id,
  };

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
        confirmMessage.setAttribute("id", id);
        document.getElementById("messages").appendChild(confirmMessage);
        confirmMessage.innerHTML = "Successfully updated " + editContactObj.firstName + " " + editContactObj.lastName;
        removePopups(confirmMessage.id);
        removeErrorMessages();
        undoBlur("edit-contact-overlay");


      }
    }
  };
  console.log(editContactJSON);
  link.send(editContactJSON);
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
          console.log("Editing contact");
          executeEditContact(firstName, lastName, email, phoneNumber, id);
        } 
        
        else {
          
          const openContact = document.createElement("div");
          openContact.setAttribute("id", "open-contact");
          openContact.setAttribute("class", "popup list text-white text-center");
          openContact.setAttribute("style", "font-size: 16pt; max-width:500px");

          firstNameLine = document.createElement("div");
          lastNameLine = document.createElement("div");
          phoneNumberLine = document.createElement("div");
          emailLine = document.createElement("div");

          firstNameLine.setAttribute("class", " poupup listt");
          lastNameLine.setAttribute("class", " poupup list");
          phoneNumberLine.setAttribute("class", " poupup list");
          emailLine.setAttribute("class", " poupup list");

          name1 = document.createElement("u");
          name2 = document.createElement("u");
          emailUnder = document.createElement("u");
          phone = document.createElement("u");

          name1.innerHTML = "First Name"
          name2.innerHTML = "Last Name"
          emailUnder.innerHTML = "Email"
          phone.innerHTML = "Phone"

          const firstName = document.createElement("div");
          const lastName = document.createElement("div");
          const phoneNumber = document.createElement("div");
          const email = document.createElement("div");

         

          firstName.setAttribute("class", " contact-info  text-black view-form col-12");
          lastName.setAttribute("class", "contact-info  text-black view-form col-12");
          phoneNumber.setAttribute("class", "contact-info  text-black view-form col-12");
          email.setAttribute("class", "contact-info  text-black view-form col-12");

          firstName.setAttribute("style", "max-width:500px");
          lastName.setAttribute("style", "max-width:500px");
          phoneNumber.setAttribute("style", "max-width:500px");
          email.setAttribute("style", "max-width:500px");

          firstName.innerHTML = response.firstName;
          lastName.innerHTML = response.lastName;
          phoneNumber.innerHTML = response.phoneNumber;
          email.innerHTML = response.emailAddress;




          firstNameLine.appendChild(firstName);
          lastNameLine.appendChild(lastName);
          phoneNumberLine.appendChild(phoneNumber);
          emailLine.appendChild(email);



          let viewOverlay = document.getElementById("view-content");
          viewOverlay.appendChild(openContact);

          openContact.appendChild(firstNameLine);
          firstNameLine.appendChild(name1);
          openContact.appendChild(firstName);
          firstNameLine.appendChild(document.createElement("br"));

          openContact.appendChild(lastNameLine);
          lastNameLine.appendChild(name2);
          openContact.appendChild(lastName);
          lastNameLine.appendChild(document.createElement("br"));

          openContact.appendChild(phoneNumberLine);
          phoneNumberLine.appendChild(phone)
          openContact.appendChild(phoneNumber);
          phoneNumberLine.appendChild(document.createElement("br"));

          openContact.appendChild(emailLine);
          emailLine.append(emailUnder);
          openContact.append(email)
          emailLine.appendChild(document.createElement("br"));

         doBlur("view-overlay");
        }
      }
    }
  };

  link.send(retrieveContactJSON);
}

function executeLogOut() {

  removePopups(0);

  doBlur("login-overlay");

  user = 0;
 

  isLoggedIn = false;
}

function removePopups(id) {

  console.log("Removing popups")
 
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

function removeErrorMessages(){
  // Clearing error message from screen so we only get the most recent error message
  document.querySelectorAll(".error-message").forEach((errorMessage) => {
  console.log("REMOVING ERROR MESSAGES IN EXECUTE ADD CONTACT");
  errorMessage.remove();
  });

  console.log("Testing");
}

function editContactValidityCheck(firstNameInput, lastNameInput, phoneNumberInput, emailInput){
      const editContactDropdownFrame = document.getElementById("edit-contact-menu");
      if (!firstNameInput.validity.valid){
      removeErrorMessages();
      const firstNameErrorMessage = document.createElement("div");
      firstNameErrorMessage.setAttribute("class", "error-message");
      firstNameErrorMessage.innerHTML = "Failed to edit contact, invalid first name";
      editContactDropdownFrame.appendChild(firstNameErrorMessage);
      return false;
    }
    else if (!lastNameInput.validity.valid){
      removeErrorMessages();
      const lastNameErrorMessage = document.createElement("div");
      lastNameErrorMessage.setAttribute("class", "error-message");
      lastNameErrorMessage.innerHTML = "Failed to edit contact, invalid last name";
      editContactDropdownFrame.appendChild(lastNameErrorMessage);
      return false;
    }
    else if (!phoneNumberInput.validity.valid){
      removeErrorMessages();
      const phoneNumberErrorMessage = document.createElement("div");
      phoneNumberErrorMessage.setAttribute("class", "error-message");
      phoneNumberErrorMessage.innerHTML = "Failed to edit contact, invalid phone number";
      editContactDropdownFrame.appendChild(phoneNumberErrorMessage);
      return false;
    }
    else if (!emailInput.validity.valid){
      removeErrorMessages();
      const emailErrorMessage = document.createElement("div");
      emailErrorMessage.setAttribute("class", "error-message");
      emailErrorMessage.innerHTML = "Failed to edit contact, invalid email";
      editContactDropdownFrame.appendChild(emailErrorMessage);
      return false;
    }
    return true;
}

function switchRegister(){

  if (onRegister){
    return;
  }

  loginArea = document.getElementById("login-area");
  firstName = document.createElement("input");
  lastName = document.createElement("input");
  firstName.setAttribute("class", "register login-form");
  lastName.setAttribute("class", "register login-form");
  firstName.setAttribute("placeholder", "First Name");
  lastName.setAttribute("placeholder", "Last Name");
  firstName.setAttribute("id", "first-name");
  lastName.setAttribute("id", "last-name");


  document.getElementById("user").setAttribute("placeholder", "Desired Username");
  document.getElementById("pass").setAttribute("placeholder", "Desired Password");
  document.getElementById("submit-button").innerHTML = "Register";

  document.getElementById("user").value = "";
  document.getElementById("pass").value = "";

  loginArea.prepend(lastName);
  loginArea.prepend(firstName);
  onRegister = true;
  removeErrorMessages();
}

function switchLogin(){
  loginArea = document.getElementById("login-area");
  document.querySelectorAll(".register").forEach((input) => {
    input.remove();
  });

  document.getElementById("user").setAttribute("placeholder", "Username");
  document.getElementById("pass").setAttribute("placeholder", "Password");
  document.getElementById("submit-button").innerHTML = "Log in";
  document.getElementById("user").value = "";
  document.getElementById("pass").value = "";

  onRegister = false;
  removeErrorMessages();
}

function doBlur(element){
  const blur = document.getElementById("logged-in");
  const overlay = document.getElementById(element);
    
  for(i = 4; i >=0; i--){
    blur.classList.remove("active-" + (i+1));
    blur.classList.add("active-" + i);
    }
  for(i = 2; i >=0 ; i--){
    overlay.classList.remove("inactive-" + (i-1));
    overlay.classList.add("inactive-" + i);
    }

}

function undoBlur(element){

  const blur = document.getElementById("logged-in");
  const overlay = document.getElementById(element);
    
  for(i = 1; i <= 4; i++){
    blur.classList.remove("active-" + (i-1));
    blur.classList.add("active-" + i);
    }
  for(i = 1; i <= 3 ; i++){
    overlay.classList.remove("inactive-" + (i-1));
    overlay.classList.add("inactive-" + i);
    }

}