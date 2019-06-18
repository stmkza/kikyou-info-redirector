function rewriteUrl(url) {
    switch (url.hostname) {
        case 'sv.kikyou.info':
            // Subversion
            // GitHubへ転送する
            if (url.pathname.startsWith('/svn/')) {
                return `https://github.com/krkrz/krkr2/tree/master/${url.pathname.replace(/^(\/svn\/)/, '')}`;
            }
            if (url.pathname.startsWith('/trac/kirikiri/browser/')) {
                return `https://github.com/krkrz/krkr2/tree/master/${url.pathname.replace(/^(\/trac\/kirikiri\/browser\/)/, '')}`;
            }

            if (url.pathname.startsWith('/trac/kirikiri/changeset/')) {
                // GitHub APIで対応するコミットを検索し、コミットページに転送する
                const changesetId = url.pathname.replace(/^(\/trac\/kirikiri\/changeset\/)/, '');
                const searchResponse = searchGitHubCommit(`"git-svn-id: svn://localhost@${changesetId} "`);
                if(searchResponse.total_count === 1) {
                    return `https://github.com/krkrz/krkr2/commit/${searchResponse.items[0].sha}`;
                } else if(searchResponse.total_count > 1) {
                    return `https://github.com/krkrz/krkr2/search?type=Commits&q=${encodeURIComponent('"git-svn-id: svn://localhost@' + changesetId + ' "')}`;
                }
            }
            break;
        case 'devdoc.kikyou.info':
            if (url.pathname.startsWith('/tvp/docs/')) {
                // 吉里吉里2 ドキュメント
                return `https://krkrz.github.io/krkr2doc/${url.pathname.replace(/^(\/tvp\/docs\/)/, '')}`;
            }
            break;
        case 'kikyou.info':
            if (url.pathname.startsWith('/tvp/')) {
                if (url.pathname.startsWith('/tvp/bbs/')) {
                    // 掲示板
                    // もうないっぽいので、吉里吉里Z　Q&A(Googleグループ) に転送する
                    return 'https://groups.google.com/forum/?hl=ja#!forum/krkrzqa';
                }
            }
    }
    // どれにもマッチしなかったら吉里吉里Zのサイトに転送する
    return 'https://krkrz.github.io/';
}

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return { redirectUrl: rewriteUrl(new URL(details.url)) };
    },
    {
        urls: [
            "*://*.kikyou.info/*",
            "*://kikyou.info/*"
        ]
    },
    ["blocking"]);

async function searchGitHubCommit(query) {
    return await fetch(`https://api.github.com/search/commits?q=${encodeURIComponent(query)}`, {
        headers: {
            Accept: 'application/vnd.github.cloak-preview'
        }
    }).then(response => response.json())
}