const changesetId = location.hash.substr(1);
goToGitHubPage(changesetId);

async function searchGitHubCommit(query) {
    return await (await fetch(`https://api.github.com/search/commits?q=${encodeURIComponent(query)}`, {
        headers: {
            Accept: 'application/vnd.github.cloak-preview'
        }
    })).json();
}

async function kirikiriChangesetIdToGitHub(changesetId) {
    const searchResponse = await searchGitHubCommit(`"git-svn-id: svn://localhost@${changesetId} "`);
    if (searchResponse.total_count === 1) {
        return `https://github.com/krkrz/krkr2/commit/${searchResponse.items[0].sha}`;
    } else if (searchResponse.total_count > 1) {
        return `https://github.com/krkrz/krkr2/search?type=Commits&q=${encodeURIComponent('"git-svn-id: svn://localhost@' + changesetId + ' "')}`;
    }
}

async function goToGitHubPage(changesetId) {
    location.replace(await kirikiriChangesetIdToGitHub(changesetId));
}
