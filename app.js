// Selectors
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggestionBox = searchWrapper.querySelector(".autocom-box");
const urlBase = "http://cop4331-27.com/LAMPAPI";
const ext = ".php"

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

document.addEventListener("click", event =>{
  const isButton = event.target.matches(".login");

  if(!isButton && event.target.closest(".login-dropdown") !=null)
    return;
  
  let currButton;

  if(isButton){
    currButton = event.target.closest(".login-dropdown");
    currButton.classList.toggle("active");
  }

  document.querySelectorAll(".login-dropdown.active").forEach(button =>{
    if (button === currButton) 
      return;
    button.classList.remove("active");
  })
})

document.onkeydown = (event) => {
  if (event.key == 'Enter'){
    let currAction = event.target.closest(".login-menu");

    console.log(currAction);
    
    if (currAction == document.getElementById("register")){
      executeRegister();
    }

    if (currAction == document.getElementById("login")){
      executeLogin();
    }

    event.preventDefault();
  }
}

// Functions

// We will use this function to open the drop down showing the contacts info
function select(element){
  let selectUserData = element.textContent;
  if (selectUserData != "No matching contact"){
    inputBox.value = selectUserData;
    searchWrapper.classList.remove("active");
  }
  searchWrapper.classList.remove("active");
}

function executeRegister(){
  let firstName = document.getElementById("first-name").value;
  let lastName = document.getElementById("last-name").value;
  let user = document.getElementById("desired-user").value;
  let pass = document.getElementById("desired-password").value;

  let obj = {login:user, password:pass, firstName:firstName, lastName:lastName};
  obj = JSON.stringify(obj);

  let link = new XMLHttpRequest();
  let requestUrl = urlBase + '/Register.php';
  link.open("POST", requestUrl, true);
  link.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  link.setRequestHeader("Access-Control-Allow-Origin" , urlBase);
  link.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) 
			{
				let response = JSON.parse( link.responseText );
        if (response.error.length != 0)
        {
          console.log(response.error);
        }
        else
        {
          console.log("Successfully registered");
        }
      }
  }
  link.send(obj);
  console.log(firstName, lastName, user, pass);
}

function executeLogin(){
  let login = document.getElementById("user").value;
  let password = document.getElementById("pass").value;

  let loginObj = {login:login, password:password};
  loginObj = JSON.stringify(loginObj);
  
  let link = new XMLHttpRequest();
  let loginUrl = urlBase + '/Login.php';
  link.open("POST", loginUrl, true);
  link.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  link.setRequestHeader("Access-Control-Allow-Origin" , urlBase);
  link.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200)
      {
        let info = JSON.parse(link.responseText);
        if (info.error.length != 0)
        {
          console.log(info.error);
        }
        else
        {
          console.log("Successfully logged in as ", info.firstName);
        }
      }
  }
  link.send(loginObj);
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