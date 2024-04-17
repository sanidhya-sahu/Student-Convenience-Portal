const STORAGE_VARIABLE = {}
const faculty_names = []
window.addEventListener('load', () => {
    const base_URL = window.location.origin
    fetch(`${base_URL}/facultyInfoFetch`)
        .then((response) => response.json())
        .then((data) => {
            if (data.stat == true) {
                const facultyData = data.data
                STORAGE_VARIABLE['SCP_faculty_data'] = facultyData
                return facultyData
            }
            else {
                window.location = '/errorframe'
            }
        })
        .then((facultyData) => {
            document.getElementById('loader').hidden = true
            document.getElementById('inp').style.opacity = "1"
            const facultySelect = document.getElementById('facultySelect')
            const data = facultyData.data
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    const element = data[key];
                    faculty_names.push(element.name)
                    facultySelect.innerHTML += `
                    <option value="${element.name}" id="option_${element.name}">${element.name}</option>
                `
                }
            }
        })
})
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        var button = document.getElementById('search_faculty');
        if (button) {
            button.click();
        }
    }
});
const card = document.getElementById('card')
const input = document.getElementById('inputfaculty')
const datalist = document.getElementById('facultySelect');
const input_button = document.getElementById('search_faculty')
input_button.addEventListener('click', () => {
    var inputValue = String(input.value).trim()
    if (inputValue.length > 0) {
        const matchingOption = Array.from(datalist.options).find(option => option.value.toLowerCase().includes(inputValue));
        if (matchingOption) {
            input.value = matchingOption.value;
        }
        var value = String(input.value).trim()
        if (faculty_names.some(name => name.toLowerCase() === value.toLowerCase())) {
            const data = STORAGE_VARIABLE.SCP_faculty_data.data
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    const element = data[key];
                    if (element.name == value) {
                        card.style.opacity = "1"
                        card.innerHTML = `
                            <div class="data">
                                <div class="labels data-cont">
                                    <div class="content label facultyname">Name </div>
                                    <div class="content label empid">Emp Id </div>
                                    <div class="content label facultyemail">Email </div>
                                    <div class="content label cabin">Cabin No </div>
                                </div>
                                <div class="values data-cont">
                                    <div class="content value facultyname">${element.name}</div>
                                    <div class="content value empid">${key}</div>
                                    <div class="content value facultyemail">${element.email}</div>
                                    <div class="content value cabin">${element.cabin}</div>
                                </div>
                         
                            </div>
                            <div class="dp">
                                <img src="../assets/11.png" alt="" srcset="">
                            </div>
                        `
                    }
                }
            }

        }
        else {
            alert('Faculty not found');
        }
    }
    else {
        alert('Please enter a faculty name.');
    }
})
