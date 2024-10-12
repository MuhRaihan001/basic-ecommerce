const form = document.querySelector("#reg-form");

form.addEventListener("submit", async (e) =>{
    e.preventDefault();
    const name = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const response = await fetch("/api/user/register",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username: name,email: email,password: password})
    });
    const data = await response.json();
    switch(data.status){
        case 201:{
            alert("Registration successful");
            window.location.href = "../index.html";
            break;
        }
        case 409:{
            alert("Username or Email already exists");
        }
    }
})