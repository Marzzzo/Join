let isPasswordEntered = false;


function getLoginInput() {
  let email = document.getElementById('loginEmail').value.trim();
  let password = document.getElementById('loginPassword').value.trim();
  let login = { email, password };
  return login;
}


async function submitLogin() {
  let { email, password } = getLoginInput();
  try {
    let isValid = await isLoginValid(email, password)
    if (!isValid) {
      renderLoginMessage();
      return;
    }
    let user = await findUserFromDB(email);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "./pages/dashboard.html";
  } catch (error) {
    console.error("Login failed:", error);
  }
}


async function isLoginValid(email, password) {
  let user = await findUserFromDB(email);
  return user ? user.password === password : false;
}


async function findUserFromDB(email) {
  const url = `${BASE_URL}/register/users.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    const users = await response.json();
    if (!users) return null;
    return Object.values(users).find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error("Error when retrieving the user data", error);
    return null;
  }
}


function toggleRequiredInput(isFocused) {
  let border = document.getElementById('requiredInput');
  if (border) {
    border.classList.toggle('input-focus', isFocused);
  }
}


function checkPasswordIcon() {
  let passwordInput = document.getElementById('loginPassword');
  let visibilityIcon = document.getElementById('visibilityLogin');
  isPasswordEntered = passwordInput.value.length > 0;
  if (isPasswordEntered) {
    visibilityIcon.src = '../assets/icons/visibility_off.svg';
    visibilityIcon.style.pointerEvents = 'auto';
  } else {
    visibilityIcon.src = '../assets/icons/login_pw_lock.svg';
    visibilityIcon.style.pointerEvents = 'none';
  }
}


function togglePasswordVisibility() {
  let passwordInput = document.getElementById('loginPassword');
  let visibilityIcon = document.getElementById('visibilityLogin');
  let isPasswordVisible = passwordInput.type === 'text';
  passwordInput.type = isPasswordVisible ? 'password' : 'text';
  visibilityIcon.src = isPasswordVisible
    ? '../assets/icons/visibility_off.svg'
    : '../assets/icons/visibility.svg'
}


function renderLoginMessage() {
  const message = document.getElementById('loginMessage');
  const borders = document.getElementsByClassName('outside-input');
  message.innerText = "Check your email and password. Please try again!";
  message.style.display = "block";
  for (const border of borders) {
    border.style.borderColor = "#FF001F";
  }
}


function guestLogin() {
  let guestUser = { name: "Guest" }
  localStorage.setItem("loggedInUser", JSON.stringify(guestUser));
  window.location.href = "./pages/dashboard.html";
}





