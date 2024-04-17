window.addEventListener('load',async()=>{
    console.log("triig");
    fetch('/userInfo')
    .then(response => response.json())
    .then((dat) => {
        const data = dat.user
        const head_name = document.getElementById('headName')
        const img = document.getElementById('img')
        const name = document.getElementById('name')
        const email = document.getElementById('email')
        const hostler = document.getElementById('hosteler')
        const access = document.getElementById('access')
        const gender = document.getElementById('gender')
        head_name.innerText = `Welcome ${data.name}, `
        img.innerHTML = `<img src="${data.G_DP_URL}" alt="">`
        name.innerText = data.name
        email.innerText = data.email
        hostler.innerText = data.hostler ? "Yes" : "No"
        access.innerText = String(data.access).toUpperCase()
        gender.innerText = data.gender
    })
    .catch((err) => {
        console.log(err);
        window.location = '/errorframe'
    })
})
