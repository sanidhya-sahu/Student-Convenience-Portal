const box = document.getElementById('wampus')
var randWampus = Math.floor(Math.random() * 10) + 1
box.innerHTML = `
    <img src="../assets/${randWampus}.gif" alt="">
`
function log() {
    window.location = '/login'
}
setInterval(() => {
    var randWampus = Math.floor(Math.random() * 10) + 1
    box.innerHTML = `
    <img src="../assets/${randWampus}.gif" alt="">
`
}, 10000);
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        var button = document.getElementById('but');
        if (button) {
            button.click();
        }
    }
});