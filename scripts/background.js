var interval = setInterval(function() {
    chrome.storage.sync.get('subreddit', function(res) {
        if (res.subreddit) {
            var url = 'https://reddit.com' + res.subreddit + '.json';

            fetch(url)
                .then(parseJson)
                .then(checkChildren);
        }
    });
}, 5000);

function parseJson(res) {
    return res.json();
}

function checkChildren(data) {
    chrome.storage.sync.get('last', function(created) {
        var children = findLastCreated(data, created.last);
        setLastCreated(children.last);
        checkForKeywords(children.children);
    })
}

function setLastCreated(data) {
    chrome.storage.sync.set({last: data});
}

function findLastCreated(data, created) {
    var children_to_return = [];
    var last_created = 0;

    data.data.children.reverse().forEach(function(v) {
        if (v.data.created_utc > last_created) {
            last_created = v.data.created_utc;
        }

        if (!created || v.data.created_utc > created) {
            children_to_return.push(v);
        }
    });

    return {
        children: children_to_return,
        last: last_created
    };
}

function checkForKeywords(posts) {
    chrome.storage.sync.get('keywords', function(res) {
        var count = 0;

        if (res.keywords) {
            posts.forEach(function(post) {
                res.keywords.forEach(function(keyword) {
                    keyword = keyword.toLowerCase();
                    if (post.data.title.toLowerCase().indexOf(keyword) > -1 || post.data.selftext.toLowerCase().indexOf(keyword) > -1) {
                        count++;
                    }
                });
            });
        }

        if (count > 0) {
            chrome.browserAction.setBadgeText({text: count.toString()});
        } else {
            chrome.browserAction.setBadgeText({text: ""});
        }
    });
}