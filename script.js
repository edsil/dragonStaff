"use strict";

window.onload = function () {
    loadCardsData();
    cardsContainer = document.getElementById("contentBox");
    searchBox = document.getElementById("searchbox");
    btnConfirm = document.getElementById("confirm");
    addEvents();
};
const initRnd = 25;
var cards = {};
const leaderSkills = [];
var searchBox, btnConfirm, cardsContainer;

function addEvents() {
    btnConfirm.onclick = searchAndDisplay;
}

function searchAndDisplay() {
    clearButtons();
    var txt = searchBox.value.toLowerCase();
    var filter = {};
    for (const [k, v] of Object.entries(cards)) {
        if (String(v.name).toLowerCase().includes(txt)) filter[k] = v;
    }
    for (const [k, v] of Object.entries(filter)) {
        let name = "./final_assets/final_" + k + ".png";
        addCard(name, v);
    }
}

function displayRandom(n) {
    var keys = Object.keys(cards);
    for (let i = 0; i < n; i++) {
        let rnd = Math.floor(Math.random() * keys.length);
        let filePicName = "./final_assets/final_" + keys[rnd] + ".png";
        addCard(filePicName, cards[keys[rnd]]);
    }
}

function init() {}

function clearButtons() {
    while (contentBox.firstChild) {
        contentBox.removeChild(contentBox.firstChild);
    }
}

function addCard(fileName, card) {
    const newDiv = document.createElement("div");
    newDiv.className = "card";
    newDiv.id = card.id;
    const cardName = document.createElement("p");
    cardName.className = "cardName";
    cardName.innerHTML = String(card.name);

    const cardPic = document.createElement("img");
    cardPic.className = "cardPic";
    cardPic.src = fileName;

    const cardHP = document.createElement("p");
    cardHP.className = "cardHP";
    cardHP.innerHTML = "HP: " + String(card.hp_max);

    const cardATK = document.createElement("p");
    cardATK.className = "cardATK";
    cardATK.innerHTML = "ATK: " + String(card.atk_max);

    const cardDEF = document.createElement("p");
    cardDEF.innerHTML = "DEF: " + String(card.def_max);
    cardDEF.className = "cardDEF";

    newDiv.append(cardName);
    newDiv.append(cardPic);
    newDiv.append(cardHP);
    newDiv.append(cardATK);
    newDiv.append(cardDEF);
    newDiv.onclick = clickCard;

    cardsContainer.appendChild(newDiv);
    return newDiv;
}

function clickCard(e) {
    console.log(this.id);
    if (this.className == "cardSelected") this.className = "card";
    else if (this.className == "card") this.className = "cardSelected";
}

async function loadCardsData() {
    const data = await readCsv("data", "cards.csv");
    const cardHeaders = await readCsv("data", "cardsheader.csv");

    if (data === -1 || cardHeaders == -1) {
        alert("(63) Error reading Cards");
        return;
    }

    var all_cards = await csvToArr(data, cardHeaders);
    console.log("Data:" + data.length);
    console.log("Header:" + cardHeaders.length);
    console.log("Cards:" + cards.length);
    var mx = 0;
    var arrCards = all_cards.filter((c) => {
        mx = Math.max(mx, String(c.name).length);
        if (String(c.name).length >= 53) console.log(c.name, mx);
        return (
            c.open_at != "2030-12-31 23:59:59" &&
            c.id[0] != "9" &&
            String(c.id).endsWith("0") &&
            c.leader_skill_set_id != ""
        );
    });
    console.log(mx);
    for (i in cards) delete cards[i];
    Object.assign(cards, ...arrCards.map((f) => ({ [f.id]: f })));
    displayRandom(initRnd);
}

function csvToArr(csvData, csvHeader, delim = ",", headerInData = false) {
    let headers, rows;
    rows = csvData.split("\n");

    if (csvHeader) {
        headers = csvHeader.split(delim);
    } else {
        //If the header is in data, moves it into, if not, just copy it
        //Then splits it by the delimiter
        headers = (headerInData ? rows.shift() : rows[0]).split(delim);
        // if first row is not the header, converts it to c0, c1, c2....
        if (!headerInData) headers = headers.map((e, i) => "c" + i);
    }
    const arr = rows.map(function (row) {
        const values = row.split(delim);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });
    return arr;
}

async function readCsv(folder, name) {
    const target = "./" + folder + "/" + name;
    try {
        const res = await fetch(target, {
            method: "get",
            headers: {
                "content-type": "text/csv;charset=UTF-8",
            },
        });

        if (res.status === 200) {
            const data = await res.text();
            return data;
        } else {
            console.log("Error code: " + res.status + ": " + target);
            alert("Error reading: " + target + ". " + res.status);
            return -1;
        }
    } catch (err) {
        console.log(err);
        alert("Error reading: " + target + ". " + err);
        return -1;
    }
}
