var syncRules;

function init_main() {
    //get the current enabled state and rule list
    chrome.storage.sync.get('caseDownloadStatus', function(data) {
        if (typeof data.caseDownloadStatus === "undefined") {
            //this is first use; enable by default and save
            chrome.storage.sync.set({
                "caseDownloadStatus": 1
            });
            var isEnabled = 1;
        } else {
            var isEnabled = parseInt(data.caseDownloadStatus);
        }

        //make the switch reflect our current state
        if (isEnabled) {
            $('#caseDownloadStatus').bootstrapSwitch('state', true);
        } else {
            $('#caseDownloadStatus').bootstrapSwitch('state', false);
        }
    });

    //init our switch
    $('#caseDownloadStatus').bootstrapSwitch();

    //show the menu
    $('html').hide().fadeIn('slow');
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);

//handle enabling or disabling or the extension
$('#caseDownloadStatus').on('switchChange.bootstrapSwitch', function(event, state) {
    if (state) {
        chrome.storage.sync.set({
            "caseDownloadStatus": 1
        });
    } else {
        chrome.storage.sync.set({
            "caseDownloadStatus": 0
        });
    }
});