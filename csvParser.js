export async function loadCSVtoDict(csvFile, filterFunc = false) {
    var csvData, csvHeaders;
    if (!filterFunc)
        filterFunc = (c) => {
            return true;
        };

    const requHead = { method: "get", headers: { "content-type": "text/csv;charset=UTF-8" } };
    try {
        const resp = await fetch(csvFile, requHead);
        if (resp.status === 200) {
            const data = await resp.text();
            const arr_all = csvToArr(data);
            const arr = arr_all.filter(filterFunc);
            return arr;
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

    function csvToArr(csvData) {
        let headers, rows;
        rows = breakRows(csvData);
        headers = breakCols(rows.shift());
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
}
