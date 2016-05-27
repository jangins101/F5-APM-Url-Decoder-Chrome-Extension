// This function will decode an LTM persistence cookie
//    REF: https://github.com/CheungJ/BIG-IP-encoder-and-decoder
function decodeF5PersistenceCookie(cookieValue) {
    var ipSegments = [];
    var sumOfIPSegments = 0;
    var encodedIP;

    if (typeof cookieValue === 'number') {
        cookieValue += '';
    }

    encodedIP = new Number(cookieValue.split('.')[0]);

    /*
    * Where the format of the IP is a.b.c.d, the calculation is:
    * a = (cookieValue % 256)
    * b = ((cookieValue - a) / 256) % 256
    * c = (((cookieValue - a - b) / 256) / 256) % 256
    * d = ((((cookieValue - a - b - c) / 256) / 256) / 256) % 256
    */
    for (var i = 0; i < 4; i++) {
        var ip = encodedIP;
        var n = Math.pow(256, i);

        ip -= sumOfIPSegments;
        ip = (ip / n);
        ip = (ip % 256);
        ip = Math.floor(ip);
        sumOfIPSegments += ip;
        ipSegments.push(ip);
    }

    return ipSegments.join('.');
}

// This function will decode a HEX string into ASCII
function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
function delCookie(el) {
    console.log(el);
}

$(document).ready(function(){
    // Process the currently active tab
    // REF: https://developer.chrome.com/extensions/tabs#method-query
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        if (!tab) return;

        // APM rewriter uses the format /f5-w-[HEX-Encoded URL]$$/, so we'll look for that
        var matches = tab.url.match(/f5-w-(.*?)\$\$(\/.*)/);
        if (matches) {
            // Show the APM section (decoding the url);
            document.getElementById("apm").style.display = "block";

            var data = {
                url: url,
                hostEncoded: matches[1],
                host: hex2a(matches[1]),
                uri: matches[2]
            };

            document.getElementById("host").innerText = data.host;
            document.getElementById("uri").innerText = data.uri;
            document.getElementById("url").innerHTML = "<a target='_blank' href='" + data.host + data.uri + "'>" + data.host + data.uri + "</a>";
        }

        // List the cookies for this domain
        // REF: https://support.f5.com/kb/en-us/solutions/public/15000/300/sol15387.html
        // REF: https://developer.chrome.com/extensions/cookies#method-getAll
        chrome.cookies.getAll({url: tab.url}, function(cookies) {
            //var el = document.getElementById("cookies");

            // Show the cookies section
            //if (cookies) el.style.display = "block";

            // Build a table for the cookies
            var elTable = $("<table cellpadding=0 cellspacing=0><thead><tr><th style='width:16px;text-align:center'>&nbsp;</th><th>Name</th><th>Domain</th><th>Value</th></tr></thead><tbody></tbody></table>");
                elTable.attr("data-url", tab.url);

            var elTBody = $("tbody", elTable);

            for(var i=0;i<cookies.length;i++) {
                var elRow = $("<tr></tr>")
                    .attr("data-json", JSON.stringify(cookies[i]));

                // NOTE: when deleting cookies from the extension, it will delete all the cookies with the given name that match that url
                elRow.append("<td><i onclick='delCookie(this)' class='delCookie link fa fa-trash''></i></td>");
                $("i.delCookie", elRow)
                    .data("cookie",cookies[i])
                    .click(function(e){
                        window.currentRow = $(this).closest("tr");
                        var c = window.currentRow.data("json");
                        var u = $(this).closest("table").data("url");
                        chrome.cookies.remove({url: u, name: c.name}, function(details) {
                            if (details) {
                                window.currentRow.remove();
                                console.log("Removed '" + details.name + "' cookie from '" + details.url  + "'");
                            }
                            window.currentRow = null;
                        });
                    });
                elRow.append("<td>" + cookies[i].name + "</td>");
                elRow.append("<td>" + cookies[i].domain + "</td>");
                elRow.append("<td>" + cookies[i].value + (cookies[i].name.indexOf("BIGipServer") == 0 ? "<br /><em>(" + decodeF5PersistenceCookie(cookies[i].value) + ")</em>" : "") + "</td>");

                elTBody.append(elRow);
            }
            $("#cookies").show().append(elTable);
        });
    });
});
