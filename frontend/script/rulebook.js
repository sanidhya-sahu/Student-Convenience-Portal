window.addEventListener('load',async ()=>{

    fetch(`/ruleFetch`)
    .then(response => response.json())
    .then(async (data) => {
        document.getElementById('loader').hidden = true
        if (data.status) {   
            const obj = data.data
            for (let index = 0; index < obj.length; index++) {
                const rule = obj[index];
                document.getElementById('list').innerHTML+=`
                <li>${rule}</li>
                `
            }
        }
        else {
            window.location = '/errorframe'
        }
    })
})