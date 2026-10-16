/// <reference path="../pb_data/types.d.ts" />
//
// Aurora Animal Clinic contact forms arrive here from the Vercel app.
// This server adds the Site Monitor token and forwards the message.
// The token never goes to the browser. A missing stamp is not stored.

routerAdd("POST", "/_api/aurora/form", (e) => {
    var clip = function (value, max) {
        var text = "";
        if (typeof value === "string") text = value;
        else if (value != null) text = String(value);
        if (text.length > max) text = text.slice(0, max);
        return text.trim();
    };
    var escText = function (value) {
        return String(value == null ? "" : value)
            .split("&").join("&amp;")
            .split("<").join("&lt;")
            .split(">").join("&gt;")
            .split("\n").join("<br>");
    };
    var notSent = "Your message was not sent. Something went wrong — please try again.";

    var info = {};
    try { info = e.requestInfo() || {}; } catch (err) { info = {}; }
    var src = info.body || {};
    if (typeof src === "string") {
        try { src = JSON.parse(src); } catch (err2) { src = {}; }
    }
    if (!src || typeof src !== "object") {
        return e.json(400, { ok: false, error: notSent });
    }

    var token = ($os.getenv("FORM_INTAKE_TOKEN") || "").trim();
    var monitor = ($os.getenv("FORM_MONITOR_URL") || "").replace(/\/$/, "");
    if (!token || monitor.indexOf("https://") !== 0) {
        return e.json(400, { ok: false, error: notSent });
    }

    var intakeKey = clip(src.intakeKey, 80);
    var keyOk = intakeKey.length >= 16 && intakeKey.length <= 80;
    var i = 0;
    for (i = 0; i < intakeKey.length; i++) {
        var c = intakeKey.charAt(i);
        var digit = c >= "0" && c <= "9";
        var lower = c >= "a" && c <= "z";
        var upper = c >= "A" && c <= "Z";
        if (!digit && !lower && !upper) keyOk = false;
    }
    if (!keyOk) {
        try { intakeKey = $security.randomString(24); } catch (err3) { intakeKey = ""; }
    }
    if (!intakeKey) {
        return e.json(400, { ok: false, error: notSent });
    }

    var note = clip(src.note, 8000);
    var altcha = "";
    if (typeof src.altcha === "string") altcha = src.altcha.slice(0, 16384);
    var payload = {
        websiteId: "c5en7v8zot93t23",
        intakeKey: intakeKey,
        name: clip(src.name, 200),
        email: clip(src.email, 320),
        phone: clip(src.phone, 40),
        message: "<p>" + escText(note) + "</p>",
        ip: clip(src.ip, 80),
        userAgent: clip(src.userAgent, 400),
        acceptLanguage: clip(src.acceptLanguage, 200),
        origin: clip(src.origin, 300),
        formVersion: "0.0.3",
        altcha: altcha,
        precheck: [],
        sheet: {
            note: note,
            journey: clip(src.journey, 500),
            referrer: clip(src.referrer, 300)
        }
    };

    var send = function () {
        return $http.send({
            url: monitor + "/_api/monitor/form",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(payload),
            timeout: 20
        });
    };
    var res = null;
    try { res = send(); } catch (err4) { res = null; }
    if (!res || !res.statusCode || res.statusCode >= 500) {
        try { res = send(); } catch (err5) { res = null; }
    }
    if (!res || !res.json) {
        return e.json(400, { ok: false, error: notSent });
    }
    var status = res.statusCode || 400;
    if (status < 200 || status > 599) status = 400;
    return e.json(status, {
        ok: res.json.ok === true,
        code: res.json.code || "",
        status: res.json.status || "",
        error: res.json.error || ""
    });
});
