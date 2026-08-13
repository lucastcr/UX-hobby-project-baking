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

    // Email must contain "@" and a "." after it (e.g. name@example.com)
if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    response.innerHTML = "Please enter a valid email address, e.g. name@example.com";
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
// addEventListener means "when this event happens, run this function."
// DOMContentLoaded fires once the page's HTML is fully parsed.

    const tabs = document.querySelectorAll(".conv-tab");
    // querySelectorAll(".conv-tab") finds all elements with class conv-tab (the three tab buttons) and returns them as a list.
    // getElementById finds one element by id; querySelectorAll finds many by CSS selector.

    const panels = {
        weight: document.getElementById("convWeight"),
        volume: document.getElementById("convVolume"),
        temp:   document.getElementById("convTemp")
    };
    // An object mapping names to the three panel elements, so panels.weight is the weight panel, 
    // etc. Grouping them keeps the tab-switch loop below clean.

    // Tab switching
    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            // forEach loops over each tab button; for each one, attach a click listener. So clicking any tab runs the inner function.

            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            // On click: loop through all tabs removing the active class (clears the old highlight), then add active to the clicked one. 
            // classList.add/remove change an element's CSS classes from JavaScript. 
            // t => ... is arrow-function shorthand. Result: only the clicked tab looks active.

            const mode = tab.getAttribute("data-mode");
            // Reads the clicked tab's data-mode attribute ("weight", "volume", or "temp"). This is where the HTML connects to the JS
            
            for (const key in panels) {
                panels[key].hidden = (key !== mode);
            }
        });
    });
    // Loop over the three panel names. 
    // Set each panel's .hidden to true/false: key !== mode is true for every panel except the matching one — 
    // so the match gets hidden = false (shown) and the other two get hidden. One line shows the right panel and hides the rest.

    // Weight: cups -> grams
    const wtCups = document.getElementById("wtCups");
    const wtIngredient = document.getElementById("wtIngredient");
    const wtResult = document.getElementById("wtResult");
    // Grab the cups input, the ingredient dropdown, and the result paragraph.

    function convertWeight() {
        const cups = parseFloat(wtCups.value);
        const gramsPerCup = parseFloat(wtIngredient.value);
        // parseFloat converts input text into a decimal number (.value is always a string, even from a number field). 
        // cups = what the user typed; gramsPerCup = the dropdown's value (flour=120, sugar=200, etc., which live in the HTML value attributes).

        if (isNaN(cups) || cups < 0) {
            wtResult.textContent = "Enter an amount to convert";
            wtResult.classList.add("is-empty");
            return;
        }
        // isNaN = "is Not a Number" — true if empty or non-numeric. || is OR. 
        // So if the input isn't a valid number or is negative: show the prompt text, 
        // add is-empty (styles it lighter), and return early to skip the maths. Guards against bad input.

        const grams = Math.round(cups * gramsPerCup);
        wtResult.textContent = cups + " cup" + (cups === 1 ? "" : "s") + " ≈ " + grams + " g";
        wtResult.classList.remove("is-empty");
    }
    // Calculate cups × grams-per-cup, rounded to a whole number. Build the result string. 
    // (cups === 1 ? "" : "s") is a ternary (shorthand if/else): if cups is exactly 1, add nothing ("1 cup"), else add "s" ("2 cups"). 
    // Remove is-empty so it styles as a real result. textContent sets plain text (vs innerHTML, which parses HTML).

    if (wtCups) {
        wtCups.addEventListener("input", convertWeight);
        wtIngredient.addEventListener("change", convertWeight);
    }
    // Only wire these up if the cups input exists (guard — this page-checks so the converter code is harmless on other pages). 
    // "input" fires on every keystroke; "change" fires when a different dropdown option is picked. 
    // Both call convertWeight, so the result updates live.

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
    // Same structure as weight. 
    // The one new trick: Math.round(x * 10) / 10 rounds to one decimal place (×10, round, ÷10). 
    // mlPerUnit comes from the unit dropdown (tbsp=15, tsp=5), so 2 tbsp → 30 ml.

    if (volAmount) {
        volAmount.addEventListener("input", convertVolume);
        volUnit.addEventListener("change", convertVolume);
    }
    // Same wiring pattern as weight.

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
        // Same setup and empty-guard — but note no < 0 check, because negative temperatures are valid (unlike negative cups).

        let out, label;
        if (tempDir.value === "c2f") {
            out = Math.round(v * 9 / 5 + 32);
            label = v + " °C = " + out + " °F";
        } else {
            out = Math.round((v - 32) * 5 / 9);
            label = v + " °F = " + out + " °C";
        }
        // tempDir.value is the direction code from the dropdown (c2f or f2c). 
        // If Celsius→Fahrenheit, apply ×9/5 + 32; otherwise Fahrenheit→Celsius, apply (−32) ×5/9. 
        // out is the rounded answer, label the display string.

        tempResult.textContent = label;
        tempResult.classList.remove("is-empty");
    }
    if (tempValue) {
        tempValue.addEventListener("input", convertTemp);
        tempDir.addEventListener("change", convertTemp);
    }

});
// Write the result, remove the empty style, wire up the listeners (same pattern). 
// The final }); closes the DOMContentLoaded function from the very start of this block.

// ==========================================================
// Response Page - Fill Submission Summary from URL
// ==========================================================

(function () {
    // An IIFE (Immediately Invoked Function Expression) — a function that runs itself right away (the wrapping ( ) plus the () at the very end). 
    // Why? It keeps its variables private so they don't clash with the rest of the file.

    // Only run if the summary table exists (i.e. on eresponse.html)
    const nameCell = document.getElementById("displayName");
    if (!nameCell) {
        return;
    }
    // Grab the first summary cell. if (!nameCell) means "if it does NOT exist" (! is NOT). 
    // On any page that isn't the response page, that cell isn't there, so return exits immediately and does nothing. 
    // This is the guard that makes the code safe to load on every page.

    const params = new URLSearchParams(window.location.search);
    // The key line. 
    // window.location.search is the URL part after ? 
    // (e.g. ?name=Lucas&email=...). new URLSearchParams(...) turns that into an object you can read values from easily. 
    // This is how the submitted form data is retrieved: the contact form used method="get", so the data sits in the URL, and this reads it.

    function setCell(id, value) {
        const cell = document.getElementById(id);
        if (cell) {
            cell.textContent = (value && value.trim() !== "") ? value : "—";
        }
    }
    // A helper to avoid repeating code. Given a cell id and a value: find the cell, and if it exists, set its text. 
    // The ternary (value && value.trim() !== "") ? value : "—" means: if there's a value and it isn't just blank spaces, show it; 
    // otherwise show a dash "—". .trim() removes surrounding whitespace, so a field of only spaces counts as empty — 
    // that's why an empty phone shows "—".

    setCell("displayName", params.get("name"));
    setCell("displayEmail", params.get("email"));
    setCell("displayPhone", params.get("phone"));
    setCell("displayTopic", params.get("topic"));
    setCell("displayMessage", params.get("message"));

})();
// Call the helper five times. params.get("name") pulls the name value out of the URL; setCell writes it into the cell with id displayName.
// Repeat for the other four. 
// The full chain to be able to recite: the form field's name attribute → appears in the URL → params.get("name") reads it → 
// written into the <td id="displayName">. The final })(); closes and immediately runs the IIFE.