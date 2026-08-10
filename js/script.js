// ==========================================================
// LUQUINN'S BAKES
// JavaScript
// ==========================================================



// ==========================================================
// Contact Form Validation
// ==========================================================

// Runs when the contact form is submitted (see onsubmit in dcontact.html).
// Returns false to STOP the form submitting if a field is invalid,
// or true to allow it through to the response page.
function validateForm() {       
    // Defines a function named validateForm. 
    // Defining it doesn't run it — it runs when called, which happens via onsubmit="return validateForm()" on the form in dcontact.html.

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;
    // document is the page. getElementById("name") finds the input whose id is name. 
    // .value reads the text the user typed into it. 
    // So these three lines pull the current Name, Email, and Message contents into variables. 
    // Point to note: getElementById gives you the element; .value gives you what's inside it.

    // The paragraph where we display the error or success message
    let response = document.getElementById("response");

    // Name must not be blank.
    // We use === (strict equality) which checks value AND type.
    if (name === "") {
        response.innerHTML = "Please enter your name.";
        return false; // stops the form from submitting
    }

    // Email must not be blank
    if (email === "") {
        response.innerHTML = "Please enter your email.";
        return false;
    }

    // Simple email check: it must contain an "@".
    // indexOf returns -1 when "@" is not found in the string.
    if (email.indexOf("@") === -1) {
        response.innerHTML = "Please enter a valid email address.";
        return false;
    }

    // Message must not be blank
    if (message === "") {
        response.innerHTML = "Please enter your message.";
        return false;
    }

    // All checks passed - allow the form to submit
    response.innerHTML = "Form submitted successfully!";
    return true;
}

/* ===== Ingredient Converter (Baking Guide) =====
   Waits until the page HTML has loaded, then sets up the three converter
   tabs (weight / volume / temperature). Each result updates live as the
   user types, using input/change event listeners. */
document.addEventListener("DOMContentLoaded", function () {

    const tabs = document.querySelectorAll(".conv-tab");
    const panels = {
        weight: document.getElementById("convWeight"),
        volume: document.getElementById("convVolume"),
        temp:   document.getElementById("convTemp")
    };

    // Tab switching
    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const mode = tab.getAttribute("data-mode");
            for (const key in panels) {
                panels[key].hidden = (key !== mode);
            }
        });
    });

    // Weight: cups -> grams
    const wtCups = document.getElementById("wtCups");
    const wtIngredient = document.getElementById("wtIngredient");
    const wtResult = document.getElementById("wtResult");

    function convertWeight() {
        const cups = parseFloat(wtCups.value);
        const gramsPerCup = parseFloat(wtIngredient.value);
        if (isNaN(cups) || cups < 0) {
            wtResult.textContent = "Enter an amount to convert";
            wtResult.classList.add("is-empty");
            return;
        }
        const grams = Math.round(cups * gramsPerCup);
        wtResult.textContent = cups + " cup" + (cups === 1 ? "" : "s") + " ≈ " + grams + " g";
        wtResult.classList.remove("is-empty");
    }
    if (wtCups) {
        wtCups.addEventListener("input", convertWeight);
        wtIngredient.addEventListener("change", convertWeight);
    }

    // Volume: tbsp/tsp -> ml
    const volAmount = document.getElementById("volAmount");
    const volUnit = document.getElementById("volUnit");
    const volResult = document.getElementById("volResult");

    function convertVolume() {
        const amount = parseFloat(volAmount.value);
        const mlPerUnit = parseFloat(volUnit.value);
        if (isNaN(amount) || amount < 0) {
            volResult.textContent = "Enter an amount to convert";
            volResult.classList.add("is-empty");
            return;
        }
        const ml = Math.round(amount * mlPerUnit * 10) / 10;
        volResult.textContent = amount + " → " + ml + " ml";
        volResult.classList.remove("is-empty");
    }
    if (volAmount) {
        volAmount.addEventListener("input", convertVolume);
        volUnit.addEventListener("change", convertVolume);
    }

    // Temperature: C <-> F
    const tempValue = document.getElementById("tempValue");
    const tempDir = document.getElementById("tempDir");
    const tempResult = document.getElementById("tempResult");

    function convertTemp() {
        const v = parseFloat(tempValue.value);
        if (isNaN(v)) {
            tempResult.textContent = "Enter a temperature to convert";
            tempResult.classList.add("is-empty");
            return;
        }
        let out, label;
        if (tempDir.value === "c2f") {
            out = Math.round(v * 9 / 5 + 32);
            label = v + " °C = " + out + " °F";
        } else {
            out = Math.round((v - 32) * 5 / 9);
            label = v + " °F = " + out + " °C";
        }
        tempResult.textContent = label;
        tempResult.classList.remove("is-empty");
    }
    if (tempValue) {
        tempValue.addEventListener("input", convertTemp);
        tempDir.addEventListener("change", convertTemp);
    }

});

// ==========================================================
// Response Page - Fill Submission Summary from URL
// ==========================================================

(function () {

    // Only run if the summary table exists (i.e. on eresponse.html)
    const nameCell = document.getElementById("displayName");
    if (!nameCell) {
        return;
    }

    const params = new URLSearchParams(window.location.search);

    function setCell(id, value) {
        const cell = document.getElementById(id);
        if (cell) {
            cell.textContent = (value && value.trim() !== "") ? value : "—";
        }
    }

    setCell("displayName", params.get("name"));
    setCell("displayEmail", params.get("email"));
    setCell("displayPhone", params.get("phone"));
    setCell("displayTopic", params.get("topic"));
    setCell("displayMessage", params.get("message"));

})();