const api_url = ""; 
let slides = [];
let current_slide_index = 0;
let presentation_id = null;

// Diák betöltése
async function fetch_slides() {
    try {
        const response = await fetch(`${api_url}/list`);
        const data = await response.json();

        if (data.success && data.controls.length > 0) {
            presentation_id = data.controls[0]; 
            slides = Array.from({ length: 10 }, (_, i) => `slide${i + 1}.png`); 
            display_slide(current_slide_index);
            listen_for_commands(); 
        } else {
            console.error("Nincs elérhető prezentáció.");
        }
    } catch (error) {
        console.error("Hálózati hiba:", error);
    }
}

/*
function display_slide(index) {
    if (index < 0 || index >= slides.length) return;

    const container = document.getElementById("slide_container");
    container.innerHTML = `<img src="${slides[index]}" alt="Slide ${index + 1}" style="max-width: 100%;">`;
}
*/

// Parancsok fogadása
async function listen_for_commands() {
    setInterval(async () => {
        if (!presentation_id) return;

        try {
            const response = await fetch(`${api_url}/${presentation_id}/next`);
            const data = await response.json();

            if (data.success) {
                execute_command(data.action, data.currentSlide);
            }
        } catch (error) {
            console.error("Hiba a parancsok figyelése közben:", error);
        }
    }, 2000);
}

// Parancs végrehajtása
function execute_command(action, slide_number) {
    switch (action) {
        case "next":
            if (current_slide_index < slides.length - 1) {
                current_slide_index++;
                display_slide(current_slide_index);
            }
            break;
        case "previous":
            if (current_slide_index > 0) {
                current_slide_index--;
                display_slide(current_slide_index);
            }
            break;
        case "goto":
            if (slide_number >= 0 && slide_number < slides.length) {
                current_slide_index = slide_number;
                display_slide(current_slide_index);
            }
            break;
        case "start":
            current_slide_index = 0;
            display_slide(current_slide_index);
            break;
        case "stop":
            console.log("Prezentáció leállt");
            break;
        case "restart":
            current_slide_index = 0;
            display_slide(current_slide_index);
            break;
        default:
            console.warn("Ismeretlen parancs:", action);
    }
}


document.addEventListener("DOMContentLoaded", fetch_slides);
