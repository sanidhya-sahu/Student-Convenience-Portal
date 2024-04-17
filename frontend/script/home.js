fetch('/userInfo')
.then(response => response.json())
.then(async (data)=>{
    if (data.found) {
        document.getElementById('profile_img').innerHTML=`<img src="${data.user.G_DP_URL}" alt="">`
        document.getElementById('profile_name').innerText = `${data.user.name}`
    }
    else{
        document.getElementById('profile_img').innerHTML = `<img src="../assets/11.png" alt="" srcset="">`
        document.getElementById('profile_name').innerText = `name_not_found`
    }
})
const home = document.getElementById('side-home')
const faculty = document.getElementById('side-faculty')
const event_butt = document.getElementById('side-event')
const notice = document.getElementById('side-notice')
const complaint_button = document.getElementById('side-complaint')
const suggetion = document.getElementById('side-suggetions')
const rule = document.getElementById('side-rule')
const heading = document.getElementById('heading')
home.id="active"
const workspace = document.getElementById('workspace')
function facultyInfo() {
    home.id=""
    event_butt.id=""
    notice.id=""
    complaint_button.id=""
    suggetion.id=""
    rule.id=""
    faculty.id="active"
    heading.innerText="Faculty Information"
    workspace.classList.remove('home')
    workspace.classList.add('frame')
    workspace.innerHTML = `
    <iframe src="../html/facultyInfo.html" style="border: none;width: 100%;height: 100%;"></iframe>
    `
}
function events() {
    home.id=""
    event_butt.id="active"
    notice.id=""
    complaint_button.id=""
    suggetion.id=""
    rule.id=""
    faculty.id=""
    heading.innerText="Upcoming Events"
    workspace.classList.remove('home')
    workspace.classList.add('frame')
    workspace.innerHTML = `
        <iframe src="../html/events.html" style="border: none;width: 100%;height: 100%;"></iframe>
    `
}
function rulebook() {
    home.id=""
    event_butt.id=""
    notice.id=""
    complaint_button.id=""
    suggetion.id=""
    rule.id="active"
    faculty.id=""
    heading.innerText="Rule Book"
    workspace.classList.remove('home')
    workspace.classList.add('frame')
    workspace.innerHTML = `
        <iframe src="../html/rulebook.html" style="border: none;width: 100%;height: 100%;"></iframe>
    `
}
function complaint() {
    home.id=""
    event_butt.id=""
    notice.id=""
    complaint_button.id="active"
    suggetion.id=""
    rule.id=""
    faculty.id=""
    heading.innerText="Complaints"
    workspace.classList.remove('home')
    workspace.classList.add('frame')
    workspace.innerHTML = `
        <iframe src="../html/complaint.html" style="border: none;width: 100%;height: 100%;"></iframe>
    `
}