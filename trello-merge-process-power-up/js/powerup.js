var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';

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
        icon: WHITE_ICON,
        color: 'teal'
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
            text: 'Open Jira task',
            callback: () => openSettings(options)
        }];
    },
    'card-badges': showMemberBadges,
    'card-detail-badges': showMemberBadges,

    'card-buttons': function (t, options) {
        debugOptions(options);
        return t.card("name")
            .then(result => {
                return {
                    icon: GRAY_ICON,
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