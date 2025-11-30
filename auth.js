import supaBase from "./config.js";



//  pasword toggle button for both sign up and login page 


const passwordInput = document.getElementById("password");
const toggleIcon = document.querySelector(".toggle-password");

if (passwordInput && toggleIcon) {
    toggleIcon.addEventListener("click", () => {
        // Check current type
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);

        // Icon Icon Change Logic
        if (type === "text") {
            toggleIcon.classList.remove("fa-eye-slash");
            toggleIcon.classList.add("fa-eye");
        } else {
            toggleIcon.classList.remove("fa-eye");
            toggleIcon.classList.add("fa-eye-slash");
        }
    });
}




                //    Sign up page functionality

let sUName = document.getElementById("name");
let sEmail = document.getElementById("email");
let sPass = document.getElementById("password");
let sPhn = document.getElementById("ph-no.");
let sBtn = document.querySelector(".btn-signup");




//  SIGN UP FUNCTIONALITY
async function signUp(e) {
  e.preventDefault();

  if (!sUName.value.trim() ||
    !sEmail.value.trim() ||
    !sPass.value.trim() ||
    !sPhn.value.trim()) {
    Swal.fire({
      title: "All fields required!",
      text: "Please fill all fields before signup.",
      icon: "warning",
      background: "#f9fbfc",
      color: "#003b46",
      confirmButtonColor: "#003b46",
      confirmButtonText: "OK",
      padding: "20px",
      borderRadius: "15px",
      customClass: {
        popup: "glass-alert"
      }
    })

    return
  };


  if (sPhn.value.length !== 11) {
    Swal.fire({
      title: "Incorrect Phone Number!",
      text: "Phone number must be exactly 11 digits.",
      icon: "warning",
      background: "#f9fbfc",
      color: "#003b46",
      confirmButtonColor: "#003b46",
      confirmButtonText: "Try Again",
      customClass: {
        popup: "glass-alert"
      }

    }).then(() => {
      sPhn.value = "";
    })
    return;
  }


  try {



    const { data, error } = await supaBase.auth.signUp(
      {
        email: sEmail.value,
        password: sPass.value,
        options: {
          data: {
            user_name: sUName.value,
            phone_no: sPhn.value,
          }
        }
      }
    )

    if (error) {
      console.log(error);
      Swal.fire({
        title: "Signup Failed!",
        text: error.message,
        icon: "error",
        draggable: true,
        background: "#f9fbfc",
        color: "#003b46",
        confirmButtonColor: "#003b46",
        confirmButtonText: "OK",
        padding: "20px",
        borderRadius: "15px",
        customClass: {
          popup: "glass-alert"
        }
      }).then(() => {
        sUName.value = "";
        sEmail.value = "";
        sPass.value = "";
        sPhn.value = "";
      
      })
      return;
    

    
    } else {
      Swal.fire({
        title: "Signup successfully!",
        text: "Welcome to covid survey",
        icon: "success",
        draggable: true,
        background: "#f9fbfc",
        color: "#003b46",
        confirmButtonColor: "#003b46",
        confirmButtonText: "Go to Home",
        padding: "20px",
        borderRadius: "15px",
        customClass: {
          popup: "glass-alert"
        }

      })
        .then(() => {
          location.href = "user.html"
        })


    }
  } catch (err) {
    console.log(err)
    Swal.fire({
      title: "System error!",
      html: `Something went wrong internally! <br></br> <b>${err.message || "Unknown error"}</b>`,
      icon: "error",
      background: "#f9fbfc",
      color: "#003b46",
      confirmButtonColor: "#003b46",
      confirmButtonText: "Report issue",
      padding: "20px",
      borderRadius: "15px",
      customClass: {
        popup: "glass-alert"
      }
    }).then(() => {
        sUName.value = "";
        sEmail.value = "";
        sPass.value = "";
        sPhn.value = "";
      
      })
  }
}

sBtn && sBtn.addEventListener("click", signUp);




                    // Login page functionality



let lEmail = document.getElementById("email");
let lPass = document.getElementById("password");
let lBtn = document.querySelector(".btn-primary");






async function login(e) {
    e.preventDefault();

    let email = lEmail.value.trim();
    let pass = lPass.value.trim();

    if (!email) {
        Swal.fire({
            title: "Please enter your email address.",
            icon: "warning",
            background: "#f9fbfc",
            color: "#003b46",
            confirmButtonColor: "#003b46",
            confirmButtonText: "OK",
            padding: "20px",
            borderRadius: "15px",
            customClass: {
                popup: "glass-alert"
            }
        });
        return;
    }

    if (!email.includes("@") || !email.includes("gmail.com")) {
        Swal.fire({
            title: "Please enter a valid Gmail address.",
            text: "Example: yourname@gmail.com",
            icon: "warning",
            background: "#f9fbfc",
            color: "#003b46",
            confirmButtonColor: "#003b46",
            confirmButtonText: "OK",
            padding: "20px",
            borderRadius: "15px",
            customClass: {
                popup: "glass-alert"
            }
        }).then(() => {
            lEmail.value = "";
            lPass.value = "";
        })
        return;
    }

    if (!pass) {
        Swal.fire({
            title: "Password field is empty.",
            text: "Please enter your password.",
            icon: "warning",
            background: "#f9fbfc",
            color: "#003b46",
            confirmButtonColor: "#003b46",
            confirmButtonText: "OK",
            padding: "20px",
            borderRadius: "15px",
            customClass: {
                popup: "glass-alert"
            }
        });
        return;
    }

    if (pass.length < 6) {
        Swal.fire({
            title: "Invalid password!",
            text: "Password must be at least 6 characters long.",
            icon: "warning",
            background: "#f9fbfc",
            color: "#003b46",
            confirmButtonColor: "#003b46",
            confirmButtonText: "OK",
            padding: "20px",
            borderRadius: "15px",
            customClass: {
                popup: "glass-alert"
            }
        }).then(() => {
            lPass.value = "";
        })
        return;
    }

    if (email === "admin@gmail.com" && pass === "admin12345") {

        Swal.fire({
            title: "Admin logged in Successfully!",
            icon: "success",
            background: "#f9fbfc",
            color: "#003b46",
            confirmButtonColor: "#003b46",
            confirmButtonText: "Go to Admin portal..",
            padding: "20px",
            borderRadius: "15px",
            customClass: {
                popup: "glass-alert"
            }
        }).then(() => {
            location.href = "admin.html";
        });



        return;

    }

    try {

        const { data, error } = await supaBase.auth.signInWithPassword({
            email: email,
            password: pass
        });


        if (error) {
            console.log("Supabase Error: ", error);


            if (error.message.includes("Invalid login credentials")) {
                Swal.fire({
                    title: "Login failed!",
                    text: "Incorrect Email or Password. Please try again.",
                    icon: "error",
                    background: "#f9fbfc",
                    color: "#003b46",
                    confirmButtonColor: "#003b46",
                    confirmButtonText: "Try Again!",
                    padding: "20px",
                    customClass: {
                        popup: "glass-alert"
                    }
                }).then(() => {
                    lEmail.value = "";
                    lPass.value = "";
                })
            }
            else {

                Swal.fire({
                    title: "Error!",
                    text: error.message,
                    icon: "error",
                    background: "#f9fbfc",
                    color: "#003b46",
                    confirmButtonColor: "#003b46",
                    confirmButtonText: "Try Again!",
                    padding: "20px",
                    customClass: {
                        popup: "glass-alert"
                    }
                }).then(() => {
                    lEmail.value = "";
                    lPass.value = "";
                })


            }
            return;
        }

        Swal.fire({
            title: "Successfully logged in!",
            icon: "success",
            background: "#f9fbfc",
            color: "#003b46",
            confirmButtonColor: "#003b46",
            confirmButtonText: "Go to Home",
            padding: "20px",
            customClass: {
                popup: "glass-alert"
            }
        }).then(() => {
            location.href = "/crud/ecom-home.html";
        });



    } catch (err) {
        console.log(err);
        Swal.fire({
            title: "System error!",
            html: `Something went wrong internally!<br></br> <b> ${(err.message) || "Unknown error"}</b>`,
            icon: "error",
            background: "#f9fbfc",
            color: "#003b46",
            confirmButtonColor: "#003b46",
            confirmButtonText: "Report issue",
            padding: "20px",
            borderRadius: "15px",
            customClass: {
                popup: "glass-alert"
            }
        }).then ( () => {
            lEmail.value = "";
            lPass.value = "";
        })
    }
}


lBtn && lBtn.addEventListener("click", login);





// --- LOGOUT FUNCTIONALITY ---

// Logout button ko sirf DOM content load hone ke baad target karein
document.addEventListener('DOMContentLoaded', () => {
    // NOTE: 'logout-btn' Admin aur User dono pages par hai.
    let logoutBtn = document.getElementById("logout-btn");
    
    // Yahan Console.log laga diya hai, ab yeh console mein zaroor aana chahiye
    console.log("Logout Button Element found:", logoutBtn); 

    async function logout() {
        try {
            const { error } = await supaBase.auth.signOut();

            if (!error) {
                Swal.fire({
                    title: "Successfully logged out!",
                    icon: "success",
                    confirmButtonText: "Go to Login page",
                }).then(() => {
                    // Default jahan jana hai
                    location.href = "login.html"; 
                });
            } else {
                console.error("Supabase SignOut Error:", error);
                Swal.fire({
                    title: "Logout Failed!",
                    text: error.message,
                    icon: "error",
                });
            }
        } catch (err) {
            console.log("Logout System Error:", err);
        }
    }

    // Ab listener lagayen
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});