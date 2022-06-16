"use strict";

window.onload = function () {
    loadCardsData();
    headbox = document.getElementById("headbox");
    btnContainer = document.getElementById("btnContainer");
    updateWH();
    searchBox = document.getElementById("searchbox");
    btnConfirm = document.getElementById("confirm");
    addEvents();

    for (let i = 0; i < 44; i++) {
        let id = String(1000010 + i * 10);
        let name = "./final_assets/final_" + id + ".png";
        addBtnV1(name, id);
    }
    // searchAndDisplay();
};
var cards = {};
const leaderSkills = [];
var canvas, ctx, searchBox, btnConfirm, headbox, canvasContainer, btnContainer;
var width, height;

function addEvents() {
    window.addEventListener("resize", () => {
        updateWH();
    });
    btnConfirm.onclick = searchAndDisplay;
}

function searchAndDisplay() {
    clearButtons();
    var txt = "super"; //searchBox.value.toLowerCase();
    var filter = {};
    for (const [k, v] of Object.entries(cards)) {
        if (String(v.name).toLowerCase().includes(txt)) filter[k] = v;
    }
    for (const [k, v] of Object.entries(filter)) {
        let name = "./final_assets/final_" + k + ".png";
        addBtnV2(name, v);
    }
}

function init() {}

function updateWH() {
    let menuBar = headbox.clientHeight;
    //canvasContainer.style.top = String(menuBar) + "px";
    btnContainer.style.top = String(menuBar) + "px";
    width = Math.floor(window.innerWidth - window.scrollX - 20);
    height = window.innerHeight;
    //ctx.canvas.width = width;
    //ctx.canvas.height = height;
    btnContainer.width = width;
}

function clearButtons() {
    while (btnContainer.firstChild) {
        btnContainer.removeChild(btnContainer.firstChild);
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
    btnContainer.appendChild(newBtn);
    return newBtn;
}

function addBtnV2(fileName, card) {
    const newDiv = document.createElement("div");
    newDiv.className = "fullCardDiv";
    const newBtn = document.createElement("button");
    const newImg = document.createElement("img");
    let btnwid = width / Math.floor(width / 120);
    newBtn.className = "btnCard";
    newBtn.id = card.id;
    newImg.src = fileName;
    newImg.width = btnwid - 5;
    newDiv.width = btnwid;
    newBtn.appendChild(newImg);
    newDiv.append(newBtn);
    newDiv.append(dataTable(card));
    btnContainer.appendChild(newDiv);
    return newDiv;
}

function dataTable(card) {
    const divData = document.createElement("div");
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    divData.className = "divData";
    divData.id = String(card.id);
    table.className = "tableData";
    th.style.columnSpan = "2";
    th.innerHTML = "<p>" + String(card.name) + "</p>";
    var txt1 = "<p><em>HP: </em>" + String(card.hp_init) + "<br>";
    txt1 += "<em>ATK: </em>" + String(card.atk_init) + "<br>";
    txt1 += "<em>DEF: </em>" + String(card.def_init) + "</p>";
    td1.innerHTML = txt1;

    var txt2 = "<p><em>HP: </em>" + String(card.hp_init) + "<br>";
    txt2 += "<em>ATK: </em>" + String(card.atk_init) + "<br>";
    txt2 += "<em>DEF: </em>" + String(card.def_init) + "</p>";
    td2.innerHTML = txt2;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tbody.appendChild(tr);
    table.appendChild(th);
    table.appendChild(tbody);
    divData.appendChild(table);
    return divData;
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
    var arrCards = all_cards.filter((c) => {
        return (
            c.open_at != "2030-12-31 23:59:59" &&
            c.id[0] != "9" &&
            String(c.id).endsWith("0") &&
            c.leader_skill_set_id != ""
        );
    });
    for (i in cards) delete cards[i];
    Object.assign(cards, ...arrCards.map((f) => ({ [f.id]: f })));
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
