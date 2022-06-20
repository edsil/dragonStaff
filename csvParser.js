export function loadCSVtoDict(
    dataFile,
    headerFile = false,
    callback = false,
    filterFunc = (c) => {
        return true;
    }
) {
    var csvData,
        csvHeaders,
        hasHeaderFile,
        retDict = {};
    const head = { method: "get", headers: { "content-type": "text/csv;charset=UTF-8" } };
    const promises = [];
    const dataProm = fetch(dataFile, head)
        .then((r) => r.text())
        .then((dTxt) => {
            csvData = dTxt;
        });
    promises.push(dataFile);
    if (headerFile) {
        hasHeaderFile = true;
        const headerProm = fetch(headerFile, head)
            .then((r) => r.text())
            .then((hTxt) => {
                csvHeaders = hTxt;
            });
        promises.push(headerProm);
    } else hasHeaderFile = false;
    Promise.all(promises).then(() => {
        var all_cards = csvToArr(csvData, csvHeaders ? hasHeaderFile : false, !hasHeaderFile);
        var arrCards = all_cards.filter((c) => filterFunc(c));
        Object.assign(retDict, ...arrCards.map((f) => ({ [f.id]: f })));
        callback(retDict);
    });

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
    }

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

function filterFunc(c) {
    return (
        c.open_at != "2030-12-31 23:59:59" &&
        c.id[0] != "9" &&
        String(c.id).endsWith("0") &&
        c.leader_skill_set_id != ""
    );
}
