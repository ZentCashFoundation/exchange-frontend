document.addEventListener("DOMContentLoaded", async() => {
    
    const emailInput = document.getElementById('email');

    if (emailInput && emailInput.value.trim() === '') {
        const savedEmail = localStorage.getItem("email");
        if (savedEmail) {
            emailInput.value = savedEmail;
        }
    }
    
    const registerloginbtn = document.querySelector('.register-login-btn');
    const closesessionbtn = document.querySelector('.close-session-btn');
    const authuser = document.querySelector('.auth-container');
    
    if (!token) {
        registerloginbtn.style.display = "initial";
		closesessionbtn.style.display = "none";
    } else {
        if (authuser) {
            authuser.style.display = "none";
        }
        registerloginbtn.style.display = "none";  
		closesessionbtn.style.display = "initial";
      }  
    });


/** Session management */
  async function closeSession() {
    localStorage.removeItem('token');
    location.href = "./";
}
/** End of session management */



/** Copyright Automatic Year */
const getCurrentYear = ()=>{
    return new Date().getFullYear();
}
document.getElementById('currentyear').textContent = getCurrentYear()

/** Disable right-click context menu */
/*document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

document.addEventListener('keydown', function (e) {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') ||
    (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'j') ||
    (e.ctrlKey && e.key.toLowerCase() === 'u')
  ) {
    e.preventDefault();
  }
});*/