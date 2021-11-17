var ruleSet;
var viewCaseFile = ""
var viewCaseGuid = ""
var downCaseAttach = ""
var casePDFUrl = ""

chrome.storage.sync.get(null, function(data) {
    if (typeof data.rules === 'undefined') {
        chrome.storage.sync.set({
            rules: []
        });

        ruleSet = [];
    } else {
        ruleSet = data.rules;
    }

    if (typeof data.caseDownloadStatus === 'undefined') {
        chrome.storage.sync.set({
            caseDownloadStatus: 1
        });
        walk(document);
    } else {
        if (parseInt(data.caseDownloadStatus)) {
            walk(document);
        }
    }
});

function walk(node) {
    // I stole this function from here:
    // http://is.gd/mwZp7E
    var child, next;

    switch (node.nodeType) {
        case 1:
            // Element
            if (node.nodeName === "IFRAME") {
                var src = node.src;
                var regex = /https:.*?\?file=(.*)/gis;
                var match = regex.exec(src);
                if (match != null) {
                    casePDFUrl = unescape(match[1]);
                    console.log("casePDFUrl: " + casePDFUrl);
                    var el = document.getElementsByClassName("portlet_title")[0]
                    caseTitle = el.innerText;
                    el.innerHTML = '<a href="' +
                        casePDFUrl + '">点击下载《' + caseTitle + '》 </a>';
                };
            }
        case 9:
            // Document
        case 11:
            // Document fragment
            child = node.firstChild;
            while (child) {
                next = child.nextSibling;
                walk(child);
                child = next;
            }
            break;

        case 3:
            // Text node
            handleText(node);
            break;
    }
}

function handleText(textNode) {
    var v = textNode.nodeValue;

    if (textNode.parentNode.nodeName === 'SCRIPT' && v != '') {
        var regexp = /function\s+viewCaseFile\(\){.*?window.open\('(.*?)'\);/ims;
        var match = regexp.exec(v)
        if (match != null) {
            viewCaseFile = match[1];
            console.log("viewCaseFile: " + viewCaseFile);
        }

        regexp = /function\s+viewCaseGuid\(\){.*?window.open\('(.*?)'\);/ims;
        match = regexp.exec(v)
        if (match != null) {
            viewCaseGuid = match[1];
            console.log("viewCaseGuid: " + viewCaseGuid);
        }

        regexp = /function\s+downCaseAttach\(attach\){.*?window\.location\.href\s+=\s+'(.*?)';/ims;
        match = regexp.exec(v)
        if (match != null) {
            downCaseAttach = match[1];
            console.log("downCaseAttach: " + downCaseAttach);
        }
    }
    if (v === "案例正文" && textNode.parentNode.nodeName === 'A') {
        var el = textNode.parentNode;
        el.style.display = "none";
        var link = document.createElement('a');
        link.innerText = " 案例正文 "
        link.href = viewCaseFile;
        el.parentNode.append(link);
    }
}