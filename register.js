window.addEventListener("DOMContentLoaded", e => {
    document.querySelector("#register").addEventListener("click", e => {
        e.preventDefault(); // Prevent default form submission behavior
        let button = e.target;
        console.log(`You clicked on ${e.target.id}`);
        let email = document.querySelector("#email").value;
        let password = document.querySelector("#password").value;
        console.log(`email: ${email} | password: ${password}`);
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: new URLSearchParams(
                {
                    'email': email,
                    'password': password
                }
            )
        };
        fetch("http://localhost:3000/api/user/", fetchOptions)
            .then(response => response.json())
            .then(message => {
                console.log(message);
                window.location.href = message.redirected;
            })
            .catch(error => console.error(error.message));
    });
});