const api_url =
"https://mkxzgvwvftzimaugwzvn.supabase.co/rest/v1/";
const Clients_api_url = api_url +"Clients"
const api_key = "sb_publishable_EY8_jS3efnS8mEt2aFGoHA_gDkN6K8v";
const auth = "bearer " + api_key;
const headers = {
        apikey: api_key,
        Authorization: auth,
        "Content-Type": "application/json",
        };
function updateAuthUI() {
  let user = localStorage.getItem("user") || sessionStorage.getItem("user");
  user = user ? JSON.parse(user) : null;
  const loginIcon = document.querySelector(".login-icon");
  const registerIcon = document.querySelector(".register-icon");
  const profileDropdown = document.querySelector(".profile-icon");
  const userNameSpan = document.querySelector(".user-name");
  let currentPage = window.location.pathname.split("/").pop() || "01-home.html";
  const profileLink = document.getElementById("profileLink"); 

  if (user) {
    if (loginIcon) loginIcon.style.display = "none";
    if (registerIcon) registerIcon.style.display = "none";

    if (profileDropdown) profileDropdown.style.display = "inline-block";

    if (userNameSpan) {
      userNameSpan.textContent = `Hello, ${user.fname}`;
    }
        if (profileLink) {
        if (user.email_address === "admin@rowin.com") {
            profileLink.href = "dashboard.html";
            profileLink.textContent = "Dashboard"; 
        } else {
           
            profileLink.href = "profile.html";
            profileLink.textContent = "View Profile";
        }
    }
  } else {
    if (loginIcon) {
        loginIcon.style.display = "inline-block";
        loginIcon.href = `login.html?redirect=${currentPage}`; 
    }
    if (registerIcon) {
        registerIcon.style.display = "inline-block";
        registerIcon.href = `register.html?redirect=${currentPage}`; 
    }

    if (profileDropdown) profileDropdown.style.display = "none";

    if (userNameSpan) userNameSpan.textContent = "";
  }

}

document.addEventListener("DOMContentLoaded", updateAuthUI);
const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click",logout);
}
let Errorspan = function(message, span_element,color="red"){
        span_element.textContent = message;
        span_element.style.color =color;
        span_element.hidden = false;
}
function checkEmail(input,email_error) {
        if (input.value === "" || !input.value.includes("@")) {
        Errorspan("Email Is Not Valid",email_error)
        return false;
        }
        email_error.hidden = true;
        return true;
        }
function checkNumber(input,number_error) {
        if (input.value === "" || !input.value.startsWith("01") || input.value.length < 11 ||input.value.length > 11|| isNaN(input.value)) {
        Errorspan("Number Is Not Valid",number_error)
        return false;
        }
        number_error.hidden = true;
        return true;
        }

function checkPassword(input, password_error) {

if (input.value.length < 8) {
    Errorspan("Password must be At least 8 char",password_error)
        return false;
         }else{
password_error.hidden = true;
return true;
        }}

let getUserdataEmail = async function (email_address) {
        let email_url = Clients_api_url + "?email_address=eq." + email_address;
        let client_res = await fetch(email_url, { headers });
        let client_data = await client_res.json();
        return client_data;
        };
let getUserdataNumber = async function (number) {
        let number_url = Clients_api_url + "?mobile_number=eq." + number;
        let client_res = await fetch(number_url, { headers });
        let client_data = await client_res.json();
        return client_data;
        };
let checkUserpass = async function (email_entered, password_entered) {
  let email_checked = await getUserdataEmail(email_entered);
  if (email_checked.length === 0) {
    return "User is Not Found";
  }
  
  if (email_checked[0].password === password_entered) {
    return true;
  }
  return false;
};

let addUser = async function(email,number,fname, lname, password){
    let emailError = document.getElementById("email_error_register");
    let passwordError = document.getElementById("password_error_register");
    let numberError = document.getElementById("number_error_register");

    let existingUserEmail = await getUserdataEmail(email);
    let existingUserNumber = await getUserdataNumber(number);

    if (existingUserEmail.length > 0) {
      Errorspan("Email already registered", emailError);
      return;
    }    
    if (existingUserNumber.length > 0) {
      Errorspan("Number already registered", numberError);
      return;
    }
    let response = await fetch(Clients_api_url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                email_address: email,
                password: password,
                mobile_number:number,
                fname:fname,
                lname:lname

            })
    });
    if (response.ok) {
     let newUser = await getUserdataEmail(email);
     Errorspan(`welcome ${fname}`,passwordError,"green")
     saveLoginSuccess(newUser[0],"01-home.html");
     console.log("Redirecting to home page in 2 seconds...");
    } else {
      Errorspan("Registration failed", passwordError);
    }
}
function saveLoginSuccess(userObject, defaultRedirectUrl = "01-home.html") {
    localStorage.setItem("user", JSON.stringify(userObject));
    localStorage.setItem("isLoggedIn", "true");

    const urlParams = new URLSearchParams(window.location.search);
    const redirectTarget = urlParams.get("redirect");

    const finalUrl = redirectTarget ? redirectTarget : defaultRedirectUrl;

    setTimeout(() => {
        window.location.href = finalUrl;
    }, 2000);
}
function updateNavbar() {
    let isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true" ||
        sessionStorage.getItem("isLoggedIn") === "true";

    document.getElementById("loginLink").style.display =
        isLoggedIn ? "none" : "inline-block";

    document.getElementById("logoutLink").style.display =
        isLoggedIn ? "inline-block" : "none";
}
function logout() {

    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("isLoggedIn");

    window.location.reload("true");
}
let user = localStorage.getItem("user")
  

