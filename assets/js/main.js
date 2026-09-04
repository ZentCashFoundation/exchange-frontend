document.addEventListener("DOMContentLoaded", async() => {
    
    const emailInput = document.getElementById('email');

    if (emailInput && emailInput.value.trim() === '') {
        const savedEmail = localStorage.getItem("email");
        if (savedEmail) {
            emailInput.value = savedEmail;
        }
    }
    
    const registerloginbtn = document.querySelector('.register-login-btn');
    const closesessionbtn = document.querySelector('.user-menu');
    const authuser = document.querySelector('.auth-container');
    const walletuserlink = document.getElementById('wallet-user-link');
    const transationsuserlink = document.getElementById('transactions-link');
    
    if (!token) {
        registerloginbtn.style.display = "initial";
		    closesessionbtn.style.display = "none";
        walletuserlink.style.display = "none";
        transationsuserlink.style.display = "none";
    } else {
        if (authuser) {
            authuser.style.display = "none";
        }
        registerloginbtn.style.display = "none";  
		    closesessionbtn.style.display = "flex";
        walletuserlink.style.display = "initial";
        transationsuserlink.style.display = "initial";
      }  
    });


/** Session management */
  async function closeSession() {
    localStorage.removeItem('token');
    localStorage.removeItem("token-date");
    location.href = "/";
}
/** End of session management */

/** Copyright Automatic Year */
const getCurrentYear = ()=>{
    return new Date().getFullYear();
}
document.getElementById('currentyear').textContent = getCurrentYear()
/** 
document.addEventListener('contextmenu', function (e) {
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
});**/