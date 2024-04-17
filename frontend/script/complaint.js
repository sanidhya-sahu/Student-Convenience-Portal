var user = ''

function showForm() {
    document.getElementById('body').innerHTML = `
    <form action="/complaint" method="post" id="form">
        <input type="text" name="name" id="name">
        <input type="text" name="email" id="email">
        <select name="location" id="complaint_location_select" required></select>
        <select name="block" id="block_select" required>
            <option value="">Choose block</option>
        </select>
        <select name="type" id="complaint_type_select" required>
            <option value="">Choose complaint type</option>
        </select>
        <textarea required name="details" id="complaint_details" wrap="soft" placeholder="Enter complete details regarding your complaint." cols="30" rows="10"></textarea>
        </form>
        <button onclick="validateAndAlertForm()" class="btn"><i class="animation"></i>Raise Complaint<i class="animation"></i></button>
    <button class="btn" onclick="goback()">Back</button>
    `
    const complaint_location_select = document.getElementById('complaint_location_select')
    const block_select = document.getElementById('block_select')
    const complaint_type_select = document.getElementById('complaint_type_select')
    const complaint_details = document.getElementById('complaint_details')
    const namein = document.getElementById('name')
    const email = document.getElementById('email')
    namein.hidden = true
    email.hidden = true
    fetch('/userInfo')
        .then(response => response.json())
        .then(async (data) => {
            if (data.found) {
                user = data.user
                namein.value = user.name
                email.value = user.email
                if (user.hostler) {
                    complaint_location_select.innerHTML = `
            <option value="">Choose location of complaint</option>
            <option value="Academic Block">Academic Block</option>
            <option value="Hostels">Hostels</option>
            `
                }
                else {
                    complaint_location_select.innerHTML = `
            <option value="">Choose location of complaint</option>
            <option value="Academic Block">Academic Block</option>
            `
                }
            }
            else {
                window.location = '/errorframe'
            }
        })

    complaint_location_select.addEventListener('input', () => {
        complaint_details.value = ''
        const input = complaint_location_select.value
        if (input == "Academic Block") {
            block_select.innerHTML = `
        <option value="Choose block">Choose block</option>
            <option value="Academic Block">Academic Block</option>
            <option value="Lab Complex">Lab Complex</option>
            <option value="Architecture Lab">Architecture Lab</option>
        `
        }
        else if (input == "Hostels") {
            if (user.gender == "male") {
                block_select.innerHTML = `
            <option value="Choose block">Choose block</option>
                    <option value="Boy's Hostel Block 1">Boy's Hostel Block 1</option>
                    <option value="Boy's Hostel Block 2">Boy's Hostel Block 2</option>
                    <option value="Boy's Hostel Block 3">Boy's Hostel Block 3</option>
                    <option value="Boy's Hostel Block 4">Boy's Hostel Block 4</option>
                    <option value="Boy's Hostel Block 5">Boy's Hostel Block 5</option>
                    <option value="Boy's Hostel Block 6">Boy's Hostel Block 6</option>
            `
            }
            else if (user.gender == "female") {
                block_select.innerHTML = `
            <option value="Choose block">Choose block</option>
            <option value="Girl's Hostel Block 1">Girl's Hostel Block 1</option>
            <option value="Girl's Hostel Block 2">Girl's Hostel Block 2</option>
            `
            }

        }
    })

    block_select.addEventListener('input', () => {
        complaint_details.value = ''
        complaint_type_select.innerHTML = `
    <option value="Choose complaint type">Choose complaint type</option>
    <option value="Electricity">Electricity</option>
    <option value="Wifi">Wifi</option>
    <option value="Plumbing">Plumbing</option>
    `
    })
}
window.addEventListener('load', async () => {
    setTimeout(async () => {
        fetch(`/listComplaints`)
            .then(response => response.json())
            .then((respData) => {
                document.getElementById('loader').hidden = true
                if (respData.new) {
                    successAlert('Complaint raised successfully.')
                }
                const dataOBJ = respData.found
                for (let index = 0; index < dataOBJ.length; index++) {
                    const data = dataOBJ[index];
                    const complaint_div = document.getElementById('complaints')
                    const longDateString = data.date;
                    const datePart = longDateString.split(" ").slice(1, 4).join(" ");
                    const date = new Date(datePart);
                    const formattedDate = date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    });
                    const status_color = String(data.status).toLowerCase() == "raised" ? "#c5d60e" : String(data.status).toLowerCase() == "rejected" ? "red" : "#07a407"
                    let currentTime = new Date();
                    let dateObject = new Date(data.date);
                    dateObject.setTime(dateObject.getTime() + 48 * 60 * 60 * 1000);
                    const isFortyEightHoursPast = currentTime > dateObject ? true : false
                    var disabled = "disabled"
                    var className = "oops"
                    var filter = "grayscale()"
                    var btn_txt = "Remainder option available after 48 hours"
                    if (isFortyEightHoursPast) {
                        disabled = ""
                        filter = "none"
                        btn_txt = "Send Remainder Email"
                        className = "animation"
                    }
                    complaint_div.innerHTML += `
                <div class="complaint" name="${data._id}" id="${index}">
                    <div class="head">
                        <div class="location"><b>${data.location} - ${data.block}</b></div>
                        <div class="date"><b>Raised On :</b>&nbsp; ${formattedDate}</div>
                    </div>
                    <div class="type">
                        <b>Type :</b>&nbsp; ${data.type}
                    </div>
                    <div class="details"><b>Complaint :</b>&nbsp;${data.details}</div>
                    <div class="footer">
                        <div class="status"><b>Status :</b>&nbsp;<span style="color:${status_color};-webkit-text-stroke-width: thin;text-transform: capitalize;"> ${data.status}</span></div>
                    </div>
                    <div class="extras">
                        <div class="complaintID"><b>Complaint ID :</b>&nbsp; ${data._id}</div>
                
                        <div class="buttons">
                            <button id="${data._id}" class="delbut" onclick="deleteComplaint(this.id)">
                                <span class="material-symbols-outlined">
                                    delete
                                </span>
                            </button>
                            <div class="reminderButton">
                                <button id="${data._id}" onclick="raiseReminder(this.id)" ${disabled} class="btn ${className}" style="filter:${filter};"><i class="${className}"></i>${btn_txt}<i
                                        class="${className}"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                `
                }
            })
    }, 1000);
})
function goback() {
    window.location.reload()
}
async function deleteComplaint(id) {
    delteWarningAlert("Do you want to delete the complaint ?")
    await waitComplaintDeletionConfirmation()
        .then((result) => {
            if (result) {
                fetch(`/deleteComplaint?id=${id}`)
                    .then(response => response.json())
                    .then((data) => {
                        if (data.status == true) {
                            successAlert('Complaint deleted successfully')
                            document.getElementsByName(`${id}`)[0].remove()
                        }
                        else {
                            errorAlert(data.found)
                        }
                    })
                    .catch((err) => {
                        errorAlert('Some error occured, try again.')
                    })
            }
        })
        .catch((err) => {
            errorAlert('Some error occured, try again.')
        })

}
async function waitComplaintDeletionConfirmation() {
    const handleButtonClick = (event) => {
        document.getElementById('layer').remove()
        if (event.target.id === "deleteButton") {
            return true;
        } else {
            return false;
        }
    };
    const promise = new Promise((resolve) => {
        deleteButton.addEventListener("click", resolve);
        cancelButton.addEventListener("click", resolve);
    });
    return promise.then(handleButtonClick);
}
async function raiseReminder(id) {
    confirmWarningAlert('Do you want send a remainder email ?')
    await waitConfirmation()
        .then((result) => {
            if (result) {
                fetch(`/raiseReminder?id=${id}`)
                    .then(response => response.json())
                    .then((respData) => {
                        if (respData) {
                            successAlert("Reminder sent successfully")
                        }
                        else {
                            errorAlert("Some error occured")
                        }
                    })
                    .catch(err => {
                        errorAlert("Some error occured")
                    })
            }
            else {
                window.location.reload()
            }
        })
        .catch((err) => {
            errorAlert('Some error occured, try again.')
        })
}
function successAlert(msg) {
    document.body.innerHTML += `
    <div class="alert success-alert" id="alert-${msg}">
        <span class="closebtn" onclick="this.parentElement.style.display='none';" style="border: none;">
        <span class="material-symbols-outlined success-alert" style="line-height: 2;border: none;background: transparent;">
            check_circle
        </span>
        </span>
        ${msg}
    </div>
`
    setTimeout(() => {

        document.getElementById(`alert-${msg}`).style.transform = "translateX(0)"
        setTimeout(() => {
            document.getElementById(`alert-${msg}`).style.transform = "translateX(100%)"
        }, 4000);
        setTimeout(() => {
            document.getElementById(`alert-${msg}`).remove()
        }, 5000);
    }, 500);
}
function errorAlert(msg) {
    document.body.innerHTML += `
    <div class="alert error-alert" id="alert-${msg}">
        <span class="closebtn" onclick="this.parentElement.style.display='none';" style="border: none;">
        <span class="material-symbols-outlined error-alert" style="line-height: 2;border: none;background: transparent;">
        report
        </span>
        </span>
        ${msg}
    </div>
`
    setTimeout(() => {

        document.getElementById(`alert-${msg}`).style.transform = "translateX(0)"
        setTimeout(async () => {
            document.getElementById(`alert-${msg}`).style.transform = "translateX(100%)"
        }, 4000);
        setTimeout(() => {
            document.getElementById(`alert-${msg}`).remove()
        }, 5000);
    }, 500);
}
function delteWarningAlert(msg) {
    document.body.innerHTML += `
    <div class="layer" id="layer">
        <div class="alert warning-alert" id="warningAlert">
            <span class="closebtn" onclick="this.parentElement.style.display='none';"
                style="border: none;display: flex;justify-content: center;background: transparent;">
                <span class="material-symbols-outlined"
                    style="line-height: 1;margin-top: 10px;border: none;background: transparent;font-size: xxx-large;">
                    warning
                </span>
            </span>
            <p style="margin-top: 0;width:90%;">
                ${msg}
            </p>
            <div class="buttons" style="width: 70%;justify-content: center;align-items: center;">
                <button class="warning-button" id="deleteButton">Delete</button>
                <button class="warning-button" id="cancelButton" style="background-color: #b6880366;">Cancle</button>
            </div>
        </div>
    </div>
    `
}
function confirmWarningAlert(msg) {
    document.body.innerHTML += `
    <div class="layer" id="layer">
        <div class="alert warning-alert" id="warningAlert">
            <span class="closebtn" onclick="this.parentElement.style.display='none';"
                style="border: none;display: flex;justify-content: center;background: transparent;">
                <span class="material-symbols-outlined"
                    style="line-height: 1;margin-top: 10px;border: none;background: transparent;font-size: xxx-large;">
                    warning
                </span>
            </span>
            <p style="margin-top: 0;width:90%;">
                ${msg}
            </p>
            <div class="buttons" style="width: 70%;justify-content: center;align-items: center;">
                <button class="warning-button" id="RaiseButton">Confirm</button>
                <button class="warning-button" id="cancelButton" style="background-color: #b6880366;">Cancle</button>
            </div>
        </div>
    </div>
    `
}
async function waitConfirmation() {
    const handleButtonClick = (event) => {
        document.getElementById('layer').remove()
        if (event.target.id === `RaiseButton`) {
            return true;
        } else {
            return false;
        }
    };
    const promise = new Promise((resolve) => {
        RaiseButton.addEventListener("click", resolve);
        cancelButton.addEventListener("click", resolve);
    });
    return promise.then(handleButtonClick);
}
async function validateAndAlertForm() {
    var name = document.getElementById('name').value
    var email = document.getElementById('email').value
    var complaint_location_select = document.getElementById('complaint_location_select')
    var block_select = document.getElementById('block_select')
    var complaint_type_select = document.getElementById('complaint_type_select')
    var complaint_details = document.getElementById('complaint_details')
    var location = complaint_location_select.value
    var block = block_select.value
    var type = complaint_type_select.value
    var detail = complaint_details.value
    if (complaint_location_select.value == "" || complaint_location_select.value == "Choose location of complaint") {
        errorAlert("Choose Location")
    }
    else if (block_select.value == "" || block_select.value == "Choose block") {
        errorAlert("Choose Block")
    }
    else if (complaint_type_select.value == "" || complaint_type_select.value == "Choose complaint type") {
        errorAlert("Choose Type")
    }
    else if (complaint_details.value == "") {
        errorAlert("Fill in details")
    }
    else {
        // document.getElementById('loader').hidden = false
        fetch(`/validatePerspective?text=${detail}`)
            .then(response => response.json())
            .then(async (validated) => {
                // document.getElementById('loader').hidden = true
                if (validated.res == true) {
                    confirmWarningAlert('Attention:  Kindly be informed that all complaints will be forwarded to the respective authority for proper handling. Please refrain from using inappropriate language or submitting frivolous complaints, as actions may be taken against the issuer. Thank you for your understanding and cooperation.        Do you want to raise this complaint ?')
                    await waitConfirmation()
                        .then((result) => {
                            if (result) {
                                document.getElementById('name').value = name
                                document.getElementById('email').value = email
                                document.getElementById('complaint_location_select').value = location
                                document.getElementById('block_select').value = block
                                document.getElementById('complaint_type_select').value = type
                                document.getElementById('complaint_details').value = detail
                                document.getElementById('form').submit()
                            }
                            else {
                                window.location.reload()
                            }
                        })
                        .catch((err) => {
                            errorAlert('Some error occured, try again.')
                        })
                }
                else if (validated.res == false) {
                    window.location = '/errorframe'
                }
                else {
                    const result = validated.res
                    errorAlert(`We've detected ${result} in your complaint. Please revise it accordingly`)
                    document.getElementById('name').value = name
                    document.getElementById('email').value = email
                    document.getElementById('complaint_location_select').value = location
                    document.getElementById('block_select').value = block
                    document.getElementById('complaint_type_select').value = type
                    document.getElementById('complaint_details').value = detail
                }
            })
    }
}