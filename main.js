const select = document.querySelectorAll(".currency");
const btn = document.getElementById("btn");
const num = document.getElementById("num");
const ans = document.getElementById("ans");
const historyList = document.getElementById("history-list");

const ratesUrl = "https://api.frankfurter.app/currencies";
let ratesData;

// Check if rates data is in local storage and use it if available
if (localStorage.getItem("ratesData")) {
  ratesData = JSON.parse(localStorage.getItem("ratesData"));
  displayRates(ratesData);
} else {
  fetch(ratesUrl)
    .then((data) => data.json())
    .then((data) => {
      ratesData = data;
      localStorage.setItem("ratesData", JSON.stringify(ratesData));
      displayRates(ratesData);
    });
}

// Display currency rates in dropdowns
function displayRates(data) {
  const entries = Object.entries(data);
  for (var i = 0; i < entries.length; i++) {
    select[0].innerHTML += `<option value="${entries[i][0]}">${entries[i][0]}</option>`;
    select[1].innerHTML += `<option value="${entries[i][0]}">${entries[i][0]}</option>`;
  }
}

// Convert currencies
btn.addEventListener("click", () => {
  let currency1 = select[0].value;
  let currency2 = select[1].value;
  let value = num.value;

  if (currency1 != currency2) {
    convert(currency1, currency2, value);
  } else {
    alert("Choose Different Currencies !!!");
  }
});

function convert(currency1, currency2, value) {
  const host = "api.frankfurter.app";
  fetch(
    `https://${host}/latest?amount=${value}&from=${currency1}&to=${currency2}`
  )
    .then((val) => val.json())
    .then((val) => {
      const rate = Object.values(val.rates)[0];
      const result = rate * value;
      ans.value = result.toFixed(2);
      saveToHistory(currency1, currency2, value, result);
    });
}

// Save conversion to history
function saveToHistory(currency1, currency2, value, result) {
  const conversion = { currency1, currency2, value, result };
  let history;
  if (localStorage.getItem("history")) {
    history = JSON.parse(localStorage.getItem("history"));
  } else {
    history = [];
  }
  history.push(conversion);
  localStorage.setItem("history", JSON.stringify(history));
  displayHistory(history);
}

// Display conversion history
function displayHistory(history) {
  historyList.innerHTML = "";
  history.forEach((conversion) => {
    const item = document.createElement("li");
    const text = document.createTextNode(
      `${conversion.value} ${conversion.currency1} = ${conversion.result.toFixed(
        2
      )} ${conversion.currency2}`
    );
    item.appendChild(text);
    historyList.appendChild(item);
  });
}

// Initialize history list on page load
if (localStorage.getItem("history")) {
  const history = JSON.parse(localStorage.getItem("history"));
  displayHistory(history);
}
