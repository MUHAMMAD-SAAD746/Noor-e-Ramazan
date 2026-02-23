let currentTimeInMin;
let namazTiming;

document.addEventListener("DOMContentLoaded", () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    document.getElementById('displayDate').textContent = today.toLocaleDateString('en-US', options);


    // Set Default Date In Picker
    const dateInput = document.getElementById('dateInput');
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;



    // Update Digital Clock
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('digitalClock').textContent = `${hrs}:${mins}`;
        currentTimeInMin = timeInMinutes(`${hrs}:${mins}`)
        if(namazTiming) setActiveClass(namazTiming);
    }
    setInterval(updateClock, 1000);
    updateClock();


    // Handle City Input
    const cityInput = document.getElementById('cityInput');
    const displayCity = document.getElementById('displayCity');
    cityInput.addEventListener('input', (e) => {
        let value = e.target.value.trim()
        if (value) {
            let formatted = value.charAt(0).toUpperCase()+value.slice(1).toLowerCase()
            displayCity.textContent = `${formatted}, PK`;
        }
        else{
            displayCity.textContent = ""
        }
    });


    // Add entry animations to prayer cards
    const cards = document.querySelectorAll('.prayer-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });



    // Hover sound effect simulation (visual only)
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('active')) {
                card.style.boxShadow = '0 20px 40px -15px rgba(217, 119, 6, 0.35)';
            }
        });
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('active')) {
                card.style.boxShadow = '';
            }
        });
    });
})




const cityInput = document.getElementById("cityInput")
const dateInput = document.getElementById("dateInput")
const school = document.querySelector("#school-of-thought")
let timmer;


const fetchTime = async () => {

    const sehriTime = document.getElementById("sehrTime")
    const iftarTime = document.getElementById("iftarTime")

    const fajr = document.getElementById("fajr")
    const zohr = document.getElementById("zohr")
    const asr = document.getElementById("asr")
    const maghrib = document.getElementById("maghrib")
    const isha = document.getElementById("isha")

    

    // const prayerCard = document.querySelectorAll(".prayer-card")

    await fetch(`https://api.aladhan.com/v1/timingsByCity/${dateInput.value}?city=${cityInput.value}&country=Pakistan&method=1&school=${school.value}`)
        .then(async (response) => {
            let data = await response.json();
            console.log(data);


            sehriTime.textContent = `${data["data"]["timings"]["Imsak"]} AM`
            iftarTime.textContent = `${convertTo12Hour(data["data"]["timings"]["Maghrib"])}`

            fajr.textContent = `${convertTo12Hour(data["data"]["timings"]["Fajr"])}`
            zohr.textContent = `${convertTo12Hour(data["data"]["timings"]["Dhuhr"])}`
            asr.textContent = `${convertTo12Hour(data["data"]["timings"]["Asr"])}`
            maghrib.textContent = `${convertTo12Hour(data["data"]["timings"]["Maghrib"])}`
            isha.textContent = `${convertTo12Hour(data["data"]["timings"]["Isha"])}`


            namazTiming = data["data"]["timings"]
            setActiveClass(data["data"]["timings"])




        })
    .catch((err) => {
        console.log(err)
    })
}

cityInput.addEventListener("input", () => {
    clearTimeout(timmer)

    timmer = setTimeout(() => {
        fetchTime()
    }, 500)
})

dateInput.addEventListener("input", () => {
    clearTimeout(timmer)

    timmer = setTimeout(() => {
        fetchTime()
    }, 1500)
})

school.addEventListener("input", () => {
    clearTimeout(timmer)

    timmer = setTimeout(() => {
        fetchTime()
    }, 1500)
})





const setActiveClass = (timings) => {
    const prayerCard = document.querySelectorAll(".prayer-card")

    for(card of prayerCard){
        card.classList.remove("active")
    }

    const oldTag = document.querySelector(".active-indicator")
    if(oldTag) oldTag.remove();

    const fajrContainer = document.getElementById("fajr-container")
    const zohrContainer = document.getElementById("zohr-container")
    const asrContainer = document.getElementById("asr-container")
    const maghribContainer = document.getElementById("maghrib-container")
    const ishaContainer = document.getElementById("isha-container")

    const fajrTime = timeInMinutes(timings["Fajr"])
    const zohrTime = timeInMinutes(timings["Dhuhr"])
    const asrTime = timeInMinutes(timings["Asr"])
    const maghribTime = timeInMinutes(timings["Maghrib"])
    const ishaTime = timeInMinutes(timings["Isha"])

    const currentTag = `<div class="active-indicator">Current</div>`

    if (currentTimeInMin >= fajrTime && currentTimeInMin < zohrTime) {
        fajrContainer.classList.add("active")
        fajrContainer.innerHTML += currentTag;
    }
    else if (currentTimeInMin >= zohrTime && currentTimeInMin < asrTime) {
        zohrContainer.classList.add("active")
        zohrContainer.innerHTML += currentTag;
    }
    else if (currentTimeInMin >= asrTime && currentTimeInMin < maghribTime) {
        asrContainer.classList.add("active")
        asrContainer.innerHTML += currentTag;
    }
    else if (currentTimeInMin >= maghribTime && currentTimeInMin < ishaTime) {
        maghribContainer.classList.add("active")
        maghribContainer.innerHTML += currentTag;
    }
    else if (currentTimeInMin >= ishaTime) {
        ishaContainer.classList.add("active")
        ishaContainer.innerHTML += currentTag;
    }
}





const timeInMinutes = (time) => {
    let recievedTime = time.split(":").map(Number)
    let timeInMinutes = recievedTime[0] * 60 + recievedTime[1]
    return timeInMinutes;
}



const convertTo12Hour = (time24) => {
    // Split the input "HH:MM" into hours and minutes
    let parts = time24.split(":");
    let hours = parseInt(parts[0], 10); // Convert hour to number
    let minutes = parts[1];             // Keep minutes as string

    // Determine AM or PM
    let period = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    if (hours === 0) hours = 12; // Handle midnight (0) and noon (12)

    // Return formatted string
    return hours + ":" + minutes + " " + period;
}



