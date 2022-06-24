import { interfaceTxt } from "./txtString.js";
var lg = "en";

export function createDetailedCard(fileName, card, lang = lg) {
    lg = lang;
    const t = interfaceTxt[lg].detailedCard;
    const newDiv = document.createElement("div");
    newDiv.className = "detailedCard";
    newDiv.id = card.id + "_complete";
    const panel1 = document.createElement("div");
    panel1.className = "panel1";
    const txtAttacksPerf = document.createElement("p");
    txtAttacksPerf.innerHTML = t.attacksPerf;
    const slider = document.createElement("input");
    //slider.type = "range";

    //slider.min = 1;
    //slider.max = 7;

    panel1.appendChild(txtAttacksPerf);
    //panel1.appendChild(slider);
    newDiv.appendChild(panel1);
    return newDiv;

    // Slider
    // Question ki spheres
    // checkboxes
    // question family
    // checkboxes

    // panel2
    // panel3

    /*

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
    return newDiv; */
}
