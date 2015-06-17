//check for new posts and open subreddit in a new tab
chrome.browserAction.getBadgeText({}, function(res) {
    if (res != '') {
        chrome.storage.sync.get('subreddit', function(res) {
            console.log(res);
            if (res.subreddit) {
                chrome.browserAction.setBadgeText({text: ''});

                chrome.tabs.create({
                    url: 'https://reddit.com' + res.subreddit
                });
            }
        });
    }
});

//get subreddit
chrome.storage.sync.get('subreddit', function(res) {
    if (res.subreddit) {
        if (res.subreddit.indexOf('/r/') == -1) {
            res.subreddit = '/r/' + res.subreddit;
        }

        document.querySelector('.subreddit').value = res.subreddit;
    }
});

//get keywords
chrome.storage.sync.get('keywords', function(res) {
    if (res.keywords) {
        document.querySelector('.keywords').value = res.keywords.join('\n');
    }
});

document.querySelector('.save').addEventListener('click', function(e) {
    e.preventDefault();

    var subreddit = document.querySelector('.subreddit');
    var keywords = document.querySelector('.keywords');

    if (subreddit.value != '' && keywords.value != '') {
        if (subreddit.value.indexOf('/r/') == -1) {
            subreddit.value = '/r/' + subreddit.value;
        }

        var data = {
            subreddit: subreddit.value,
            keywords: keywords.value.split('\n'),
            last: 0
        };

        chrome.storage.sync.set(data, function() {
            changeButtonBg();

            setTimeout(function() {
                changeButtonBg();
            }, 2500);
        })
    }

});

function changeButtonBg() {
    var save = document.querySelector('.save');

    if (save.classList.contains('green-button')) {
        save.classList.remove('green-button');
    } else {
        save.classList.add('green-button');
    }
}
