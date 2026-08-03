// ===== RECIPE SCALER (guide page) =====
var servingsInput = document.getElementById("servings");

function updateQuantities() {
  var base = 12;                          // recipe makes 12
  var wanted = servingsInput.value;       // what the user typed

  // find every ingredient amount on the page
  var amounts = document.getElementsByClassName("qty");

  for (var i = 0; i < amounts.length; i++) {
    var baseAmount = amounts[i].getAttribute("data-base");
    // scale: base amount / 12 * wanted number
    var scaled = baseAmount / base * wanted;
    // round to 1 decimal place so it's not messy
    amounts[i].innerHTML = Math.round(scaled * 10) / 10;
  }
}

// only run on the page that has the scaler
if (servingsInput) {
  servingsInput.addEventListener("input", updateQuantities);
  updateQuantities();   // fill in the starting values on load
}