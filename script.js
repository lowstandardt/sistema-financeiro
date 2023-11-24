const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const currency = document.querySelector("#currency");
const btnNew = document.querySelector("#btnNew");

let items;

btnNew.onclick = () => {
  if (descItem.value === "" || amount.value === "" || type.value === "" || currency.value === "") {
    return alert("Preencha todos os campos!");
  }

  items.push({
    desc: descItem.value,
    amount: Math.abs(amount.value).toFixed(2),
    type: type.value,
    currency: currency.value,
  });

  setItensBD();

  loadItens();

  descItem.value = "";
  amount.value = "";
};

function deleteItem(index) {
  items.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>${formatCurrency(item.amount, item.currency)}</td>
    <td>${getCurrencyIcon(item.currency)}</td>
    <td class="columnInOut">${item.type === "Entrada" ? '<i class="bx bxs-chevron-up-circle"></i>' : '<i class="bx bxs-chevron-down-circle"></i>'}</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItens() {
  items = getItensBD();
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();

  const container = document.querySelector(".container");
  container.style.marginTop = `${30 + items.length * 5}vh`;
}

function getTotals() {
  const totalByCurrency = {
    bitcoin: 0,
    ethereum: 0,
    drex: 0,
    real: 0,
  };

  items.forEach((item) => {
    const { currency, type, amount } = item;
    const key = `${currency}_${type}`;
    totalByCurrency[currency] += type === "Entrada" ? Number(amount) : -Number(amount);
  });

  for (const currency in totalByCurrency) {
    const totalAmount = totalByCurrency[currency].toFixed(2);
    const targetElement = document.querySelector(`.total.${currency}`);
    if (targetElement) {
      targetElement.innerHTML = `R$ ${totalAmount}`;
    }
  }
}

const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensBD = () =>
  localStorage.setItem("db_items", JSON.stringify(items));

function formatCurrency(amount, currency) {
  if (currency === "real") {
    return `R$ ${amount}`;
  } else {
    return `${amount} ${currency.toUpperCase()}`;
  }
}

function getCurrencyIcon(currency) {
  switch (currency) {
    case "bitcoin":
      return '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png" alt="Bitcoin Icon" style="width: 25px; height: 25px; margin-right: 5px;">';
    case "ethereum":
      return '<img src="https://www.coins.com.br/img/criptos/eth.png" alt="Ethereum Icon" style="width: 25px; height: 25px; margin-right: 5px;">';
    case "drex":
      return '<img src="https://s2-extra.glbimg.com/xflGWkBlSNHtQsc-NSVPir8qxh8=/0x0:792x434/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f551ea7087a47f39ead75f64041559a/internal_photos/bs/2023/j/o/LZsmo9Tb66dYvgIj5rmQ/drex.png" alt="Drex Icon" style="width: 25px; height: 25px; margin-right: 5px;">';
    case "real":
      return '<img src="https://www.anamelim.com.br/wp-content/uploads/2022/11/bandeira-brasil.png" alt="Real Icon" style="width: 25px; height: 25px; margin-right: 5px;">';
    default:
      return '';
  }
}

loadItens();
