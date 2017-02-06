const WHITE_ICON = './images/icon-white.svg';
const BRANCH_ICON = './images/git-branch.svg';
const JIRA_ICON = './images/jira-logo.png';

function openJiraTask(trello) {
    trello.card("name")
}

function debugOptions(options) {
    console.log(JSON.stringify(options));
}

function showMemberBadges(trello) {
    return trello.card('members')
        .then(result => {
            return result.members.map(createMemberBadge)
        });
}

function createMemberBadge(member) {
    return {
        title: 'Member',
        text: member.fullName,
        icon: BRANCH_ICON,
        color: 'green'
    }
}
function createCardFromIssueUrl(trello, url) {
    let issueUrlTemplate = /https:\/\/issues.wdf.sap.corp\/browse\/HS-(\d+)/;
    let parsedIssueLink = issueUrlTemplate.exec(url);
    if (parsedIssueLink) {
        let issueNum = parsedIssueLink[1];
        return {
            text: issueNum,
            description: ""
        }
    } else
        throw trello.NotHandled();

}

function openSettings(options) {
    debugOptions(options)
}
TrelloPowerUp.initialize({
    'board-buttons': function (t, options) {
        return [{
            icon: WHITE_ICON,
            text: 'Settings',
            callback: () => openSettings(options)
        }];
    },
    'card-badges': showMemberBadges,
    'card-detail-badges': showMemberBadges,

    'card-buttons': function (t, options) {
        return t.card("name")
            .then(result => {
                return {
                    icon: JIRA_ICON,
                    text: 'Open Jira Task',
                    url: result.name
                }
            })
    },
    'card-from-url': function (t, options) {
        console.log("Card from URL");
        return createCardFromIssueUrl(t, options.url);
    },
    'format-url': function (t, options) {
        console.log("Format URL");
        return createCardFromIssueUrl(t, options.url);
    },

    'show-settings': function (t, options) {
        return t.popup({
            title: 'Settings',
            url: './settings.html',
            height: 184
        });
    }
});