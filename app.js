// Selectors
addContactSubmitButton = document.getElementById("add-contact-submit");
searchContactInput = document.getElementById("search-contact");
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

    console.log(currAction);

    if (currAction == document.getElementById("register")) {
      executeRegister();
    }

    if (currAction == document.getElementById("login")) {
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
    console.log(addContactJSON);
  }
}

function executeSearchContact() {
  if (isLoggedIn == false) {
    console.log("Log in to search for a contact");
  } else {
    let userInput = document.getElementById("search-contact").value;

    let searchContactObj = {
      userId: userID,
      userInput: userInput,
    };

    let searchContactJSON = JSON.stringify(searchContactObj);

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
            if (response.firstNames[i].includes(userInput) && userInput.length > 0) {
              console.log(response.firstNames[i]);
            }
          }
        }
      }
    };

    link.send(searchContactJSON);
    console.log(searchContactJSON);
  }
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

  isLoggedIn = false;
}
