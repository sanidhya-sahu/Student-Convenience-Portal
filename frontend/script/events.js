const events_main = document.getElementById('eventmain')
fetch('/events')
    .then((response) => response.json())
    .then((data) => {
        document.getElementById('loader').hidden = true
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            events_main.innerHTML += `
                <div class="card" id="event_card${index}">
                    <div class="card-img">
                        <img src="${element.imgLink}" alt="Unable to load event Banner">
                    </div>
                    <div class="card-title">${element.heading}</div>
                    <div class="card-subtitle"><p>${element.description}</p></div>
                    <hr class="card-divider">
                    <div class="card-footer">
                        <div class="card-price">
                            <div class="date">
                                <span>Date:</span>
                                <span>${element.date}</span>
                            </div>
                            <div class="time">
                                <span>Time:</span>
                                <span>${element.time}</span>
                            </div>
                        </div>
                        <button class="card-btn" id="event_button_${index}" onclick="window.open('${element.regLink}', '_blank')">
                            Register
                        </button>
                    </div>
                </div>
            `
            if (element.blur == true) {
                document.getElementById(`event_card${index}`).classList.add('blur')
                document.getElementById(`event_button_${index}`).disabled = true
            }
        }
    })