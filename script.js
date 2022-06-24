"use strict";
import { loadCSVtoDict } from "./csvParser.js";
import { createDetailedCard } from "./detailedCard.js";
const lang = "en";

window.onload = function () {
    //loadCardsData();
    loadCardsData();
    cardsContainer = document.getElementById("contentBox");
    searchBox = document.getElementById("searchbox");
    btnConfirm = document.getElementById("confirm");
    windowWidth = window.innerWidth;
    addEvents();
};

//#region Global Variables
//DOM elements
var searchBox, btnConfirm, cardsContainer;
//Data holders
var cards = {};
var windowWidth;
//Helpers
const initRnd = 25; // Number of random cards displayed when loading
var timed = 0; // Used for setTimeOut loading few cards at time
var dispCtn = 0; // Used to count the cards that were already loaded
//#endregion

function addEvents() {
    btnConfirm.onclick = searchAndDisplay;
    searchBox.oninput = searchAndDisplay;
    window.onresize = updateWindowWidth;
}

function updateWindowWidth() {
    windowWidth = window.innerWidth;
}

function searchAndDisplay() {
    clearTimeout(timed);
    dispCtn = 0;
    clearCardsContainer();
    var txt = searchBox.value.toLowerCase();
    var filtered = [];
    for (const [k, v] of Object.entries(cards)) {
        if (String(v.name).toLowerCase().includes(txt)) filtered.push(k);
    }
    displayTimed(filtered);
}

function displayTimed(keys) {
    let i = 0;
    while (i < windowWidth / 85 && dispCtn < keys.length) {
        let name = "./final_assets/final_" + keys[dispCtn] + ".png";
        addCard(name, cards[keys[dispCtn]]);
        dispCtn++;
        i++;
    }
    if (dispCtn < keys.length) {
        timed = setTimeout(displayTimed, 100, keys);
    }
}

function displayRandom(n) {
    var keys = Object.keys(cards);
    var rndKeys = {};
    while (n > 0) {
        let rnd = Math.floor(Math.random() * keys.length);
        if (!rndKeys[rnd]) {
            rndKeys[rnd] = 1;
            n--;
            let filePicName = "./final_assets/final_" + keys[rnd] + ".png";
            addCard(filePicName, cards[keys[rnd]]);
        }
    }
    let fi = "./final_assets/final_" + keys[1] + ".png";
    cardsContainer.appendChild(createDetailedCard(fi, cards[keys[1]]));
}

function clearCardsContainer() {
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
    e.currentTarget.className = e.currentTarget.className == "cardSelected" ? "card" : "cardSelected";
}

async function loadCardsData() {
    const filter = (c) => {
        return (
            c.open_at != "2030-12-31 23:59:59" &&
            c.id[0] != "9" &&
            String(c.id).endsWith("0") &&
            c.leader_skill_set_id != ""
        );
    };
    const arrCards = await loadCSVtoDict("./data/cardsWithHeader.csv", filter);
    cards = [];
    Object.assign(cards, ...arrCards.map((f) => ({ [f.id]: f })));
    displayRandom(initRnd);
}

/*
async function readCsv(fileName) {
    try {
        const res = await fetch(fileName, {
            method: "get",
            headers: {
                "content-type": "text/csv;charset=UTF-8",
            },
        });

        if (res.status === 200) {
            const data = await res.text();
            return data;
        } else {
            console.log("Error code: " + res.status + ": " + fileName);
            alert("Error reading: " + fileName + ". " + res.status);
            return -1;
        }
    } catch (err) {
        console.log(err);
        alert("Error reading: " + fileName + ". " + err);
        return -1;
    }
}

function csvToArr(csvData, csvHeader, headerInData = false) {
    let headers, rows;
    rows = breakRows(csvData);

    if (csvHeader) {
        headers = breakCols(csvHeader);
    } else {
        //If the header is in data, moves it into, if not, just copy it
        //Then splits it by the delimiter
        headers = breakCols(headerInData ? rows.shift() : rows[0]);
        // if first row is not the header, converts it to c0, c1, c2....
        if (!headerInData) headers = headers.map((e, i) => "c" + i);
    }
    const arr = rows.map(function (row) {
        const values = breakCols(row);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });
    return arr;

    function breakRows(data) {
        var breaker = "--<br><row>--";
        var re = /,\s*"[^!"]+"\s*,?|\n/gm;
        var prep = data.replace(re, prepLineBreakCsv);
        var rows = prep.split(breaker);
        return rows;

        function prepLineBreakCsv(rows) {
            if (rows == "\n") return breaker;
            var ret = rows.replaceAll('"', "");
            return ret;
        }
    }

    function breakCols(data) {
        var breaker = "--<br><col>--";
        var re = /,\s*"[^!"]+"\s*,?|,/gm;
        var prep = data.replace(re, prepCommasCsv);
        var cols = prep.split(breaker);
        return cols;

        function prepCommasCsv(cols) {
            if (cols == ",") return breaker;
            var ret = breaker + cols.slice(1, -1).replaceAll('"', "") + breaker;
            return ret;
        }
    }
}
/*

/*async function loadCardsData() {
    const data = await readCsv("./data/cards.csv");
    const cardHeaders = await readCsv("./data/cardsheader.csv");

    if (data === -1 || cardHeaders == -1) {
        alert("Error Reading Cards Data");
        return;
    }
    var all_cards = await csvToArr(data, cardHeaders);
    var arrCards = all_cards.filter((c) => {
        return (
            c.open_at != "2030-12-31 23:59:59" &&
            c.id[0] != "9" &&
            String(c.id).endsWith("0") &&
            c.leader_skill_set_id != ""
        );
    });
    cards = [];
    Object.assign(cards, ...arrCards.map((f) => ({ [f.id]: f })));
    displayRandom(initRnd);
} */

/*
function csvToArrV1(csvData, csvHeader, delim = ",", headerInData = false) {
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
*/
