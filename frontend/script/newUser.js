const btn = document.getElementById('btn')
btn.innerHTML = "Loading ..."
fetch('/newUserDetails')
    .then(response => response.json())
    .then((data) => {
        const head_name = document.getElementById('headName')
        const img = document.getElementById('img')
        const name = document.getElementById('name')
        const email = document.getElementById('email')
        const hostler = document.getElementById('hosteler')
        const access = document.getElementById('access')
        head_name.innerText = `Welcome ${data.name}, `
        img.innerHTML = `<img src="${data.G_DP_URL}" alt="">`
        name.innerText = data.name
        email.innerText = data.email
        hostler.innerText = data.hostler ? "Yes" : "No" 
        access.innerText = String(data.access).toUpperCase()
        btn.innerHTML = `<button onclick="submit()" class="btn"><i class="animation"></i>Confirm & Create Account<i class="animation"></i></button>`
    })
function submit() {
    const form = document.getElementById('gender_form');
    const formData = new FormData(form);
    var values = ""
    formData.forEach((value, key) => {
        values = value
    });
    if (values.length > 0) {
        form.submit()
    }
    else {
        alert('Please select your gender')
    }
}