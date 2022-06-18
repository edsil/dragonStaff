"use strict";

window.onload = function () {
    loadCardsData();
    cardsContainer = document.getElementById("contentBox");
    updateWH();
    searchBox = document.getElementById("searchbox");
    btnConfirm = document.getElementById("confirm");
    addEvents();
};
const initRnd = 25;
var cards = {};
const leaderSkills = [];
var searchBox, btnConfirm, cardsContainer;
var width, height;

function addEvents() {
    window.addEventListener("resize", () => {
        updateWH();
    });
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
        addBtnV2(name, v);
    }
}

function displayRandom(n) {
    var keys = Object.keys(cards);
    for (let i = 0; i < n; i++) {
        let rnd = Math.floor(Math.random() * keys.length);
        let filePicName = "./final_assets/final_" + keys[rnd] + ".png";
        addBtnV2(filePicName, cards[keys[rnd]]);
    }
}

function init() {}

function updateWH() {
    let menuBar = 0;
    //canvasContainer.style.top = String(menuBar) + "px";
    //cardsContainer.style.top = String(menuBar) + "px";
    width = Math.floor(window.innerWidth - window.scrollX - 20);
    height = window.innerHeight;
    //ctx.canvas.width = width;
    //ctx.canvas.height = height;
    //cardsContainer.width = width;
}

function clearButtons() {
    while (contentBox.firstChild) {
        contentBox.removeChild(contentBox.firstChild);
    }
}

function addBtnV1(fileName, id) {
    const newBtn = document.createElement("button");
    const newImg = document.createElement("img");
    let btnwid = width / Math.floor(width / 120);
    newBtn.className = "btnCard";
    newBtn.id = id;
    newImg.src = fileName;
    newImg.width = btnwid;
    newBtn.appendChild(newImg);
    cardsContainer.appendChild(newBtn);
    return newBtn;
}

function addBtnV2(fileName, card) {
    const newDiv = document.createElement("div");
    newDiv.className = "card";
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
    newDiv.onclick = function () {
        this.className = "cardSelected";
    };

    cardsContainer.appendChild(newDiv);
    return newDiv;
}

async function loadCardsData() {
    const data = await readCsv("data", "cards.csv");
    const cardHeaders = await readCsv("data", "cardsheader.csv");

    /*Promise.all([data, cardHeaders]).then((e) => {
        cards = csvToArr(e[0], e[1]);
        console.log("done loading cards data");
    });*/
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
            console.log("(112) Error code: " + res.status + ": " + target);
            alert("(113) Error reading: " + target + ". " + res.status);
            return -1;
        }
    } catch (err) {
        console.log(err);
        alert("(118) Error reading: " + target + ". " + err);
        return -1;
    }
}
