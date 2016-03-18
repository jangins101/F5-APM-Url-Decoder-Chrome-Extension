// This function will decode a HEX string into ASCII
function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
debugger;
document.addEventListener('DOMContentLoaded', function() {
    debugger;
    // Act on the current tab
    chrome.tabs.getSelected(null, function(tab) {
        //alert(tab);
        //debugger;
        var url = tab.url;
        console.log('URL: ' + tab.url);
        console.log(tab);
        
        // Show the decoded APM url
        var matches = tab.url.match(/f5-w-(.*?)\$\$(\/.*)/);
        if (matches) {
            // Show the APM section (decoding the urls);
            document.getElementById("apm").style.display = "block";
            
            var data = {
                url: url,
                hostEncoded: matches[1],
                host: hex2a(matches[1]),
                uri: matches[2]
            };
            
            document.getElementById("host").innerHTML = data.host;
            document.getElementById("uri").innerHTML = data.uri;
            document.getElementById("url").innerHTML = "<a target='_blank' href='" + data.host + data.uri + "'>" + data.host + data.uri + "</a>";
        }
        
        // List the cookies for this domain
        chrome.cookies.getAll({url: tab.url}, function(cookies) {
            //console.log(cookies);
            //debugger;
            // Show the cookies section
            if (cookies) document.getElementById("cookies").style.display = "block";
            
            // Build out the list of cookies and values
            var html = "";
            for(var i=0;i<cookies.length;i++) {
                html += "<strong>" + cookies[i].name + " <em>(" + cookies[i].domain + ")</em></strong>: " + cookies[i].value + "<br />";
            }
            document.getElementById("sid").innerHTML = html;
        });
    });
}, false);