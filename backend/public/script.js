const form = document.querySelector("#login-form");

form.addEventListener("submit", async (e) =>{
    e.preventDefault();
    const username = document.querySelector("#name").value;
    const password = document.querySelector("#password").value;
    const response = await fetch('/api/user/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({ username: username, password: password })
    });
    const data = await response.json();
    const localData = JSON.stringify(data);

    switch(data.status){
        case 200:{
            localStorage.setItem("user", localData);
            window.location.href = "home/index.html";
            break;
        }
        case 401:{
            alert("Invalid username or password");
            break;
        }
    }
})