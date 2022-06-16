function lol() {
    function ot(p, e) {
        console.log(p + " => " + (Date.now() - e));
    }
    var x0, x1, x2;
    x0 = prom1(2300).then((e) => {
        ot(2300, e);
        x1 = prom1(600).then((y) => {
            ot(600, y);
            x2 = prom1(3000).then((w) => {
                ot(3000, w);
            });
            ot(601, y);
        });
        ot(2301, e);
    });
    return Promise.all([x0, x1, x2]).then((v) => {
        console.log(v[0]);
        console.log(v[1]);
        console.log(v[2]);
        return v;
    });
}
function sleep(mm) {
    var finishat = Date.now() + mm;
    //console.log("Will waiting until: " + String(finishat-1655058070117));
    var current = Date.now();
    //console.log("Starting: "+String(current-1655058070117));
    while (current < finishat) current = Date.now();
    //console.log("done waiting: " + String(current-1655058070117));
    return finishat - mm;
}

async function prom1(a) {
    var res = sleep(a);
    return new Promise((resolve, reject) => {
        if (res > 100) resolve(res);
        else reject(0);
    });
}

async function prom2(a) {
    return new Promise((resolve, reject) => {
        var res = sleep(a);
        if (res > 100) resolve(res);
        else reject(0);
    });
}

async function prom3(a) {
    return new Promise((resolve, reject) => {
        var res = sleep(300);
        if (res > 100) resolve(res);
        else reject(0);
    });
}
