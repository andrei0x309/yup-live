export const recentChanges = [
    {
        date: "2 May - 2023",
        title: "Changes",
        changes: [
            'add clear indication of farcaster subthread on farcaster post type',
            'added auto clear notifications on checking the notification',
            'yup live web/desktop light theme improvments',
            'disable historic rewards on staking page due to dune restrictions',
            'added cross posting to all yup-live apps',
            'added connect to social platforms on yup live mobile',
            're-enabled reply to farcaster posts using web3 posting',
            'added badge to notifications on yup live mobile',
            'added avatar editing to yup live mobile',
        ],
    },
    {
        date: "13 April - 2023",
        title: "Changes",
        changes: [
            'fixed web3Profile display on post page on yup live mobile',
            'migrated to vite env variables in yup live mobile',
            'added support for aggregated vote notifications everywhere in the repo',
            'refactored notification by splitting the notification type into a separate files',
            'added support for new types of notifications on yup live browser extension',
            'change to load optimized image for rewards notifications',
        ],
    },
    {
        date: "10 April - 2023",
        title: "Changes",
        changes: [
            'improved display on small screens on yup live mobile',
            'add first version of tauri config for desktop app',
            'add workflow to cross compile desktop app for windows, mac and linux',
            'add workflow to build and publish desktop app to github releases',
            'add workflow to limit releases to last 5',
            'generated desktop app icons',
            'prevent open external links in tauri and default on shell.open',
            'move delete account from account section to ireversable actions section',
            'enabled posibility to enable disable feed personalization and tracking in yup live mobile',
            'updated rust dependencies',
            'headbar component for desktop only with back, forward, full screen and close buttons',
            'add pull refresh to feeds on yup live mobile',
        ],
    },
    {
        date: "07 April - 2023",
        title: "Changes",
        changes: [
            'search improvements',
            'added score page to yup live mobile',
            'added link to yup score from every web3Profile on web app and mobile',
            'added Guide Pointers to yup live mobile in info section',
            'added link from follow notifications to web3Profiles',
            'added support for follow notifications on yup live mobile',
            'new 1.1.3 version of yup live mobile',
        ],
    },
    {
        date: "05 April - 2023",
        title: "Changes",
        changes: [
            're-enabled twitter link with new endpoints',
            'added folowers notifications',
            'added ability to navigate to web3Profile from farcaster post types',
            'added web3Profiles to yup live mobile',
            'improved additional compatibility changes ionic v7',
            'added info page on yup live mobile with runtime app version',
            'minor style changes to yup live mobile',
            'added gating conditions documentation at signup',
            'added additional eslint configs to yup live mobile',
            'changed from having the back button on post detail to having the back button on all pages except feeds on yup live mobile',
            'added search for profiles on yup live mobile',
            'added connect to twitter on yup live mobile',
            'added link to web3Profile from lens posts',
            'disable mirror wnft image because is too slow & not optimized',
            'added avatar and handle if web3Creator exists on mirror post',
            'refactored the avatar component a bit',
            'added search for web3 profiles on yup live web app'
        ],
    },
    {
        date: "30 MARCH - 2023",
        title: "Changes",
        changes: [
            'deprecated claim old account using twitter',
            'removed twitter connect due to inadequate backend api changes',
            'updated mobile / yup live signup requirements',
            'update mobile to ionic 7'
        ],
    },
    {
        date: "22 MARCH - 2023",
        title: "Changes",
        changes: [
            "added social posts of yup from twitter and farcaster",
            "fix to stop farcaster request to be sent when post not loaded yet",
            "fix recommended in case of empty list",
        ],
    },
    {
        date: "14 MARCH - 2023",
        title: "Changes",
        changes: [
            "added a conditional button to check web3Profile on post detail yup-live",
            "hide follow button on web3Profile if your account is the same as web3Profile",
            "added radar icon or comment icon to easy access of post detail",
            "overite web3Profile for farcaster accounts with web3Profile of connected address",
            "switched farcaster native comments to yup farcaster comments",
            "added radar icon on vote list to easy access of post detail",
            "added more explicit rating errors",
            "made info button on post detail more to open a modal with more info",
            "added ability to explore nested comments on farcaster",
            "consolidated voting component as reusable component",
            "consolidated post component as reusable component",
            "submitted mobile android yup live version 10(1.0.9)",
        ],
    },
    {
        date: "03 MARCH - 2023",
        title: "Changes",
        changes: [
            "change farcaster connect to web3Auth model due to backend changes",
            "added initial web3Profile creator on full post page on large screens",
            "added icons for profile tabs on Yup profile page",
            "moved web3 profile to shared state so can be reused",
            "added ability for users to change their default first feed on the profile",
            "switch to content created as the first tab feed for yup profiles",
            "made and added my own library for editing avatar with advanced crop and transform features (vue-cup-avatar)",
            "other minor fixes and style changes",
        ],
    },
    {
        date: "28 FEB - 2023",
        title: "Changes",
        changes: [
            "added web3 profiles",
            "added associated links between yup profile and web3 profile",
            "switch follows to wbe3 follows, now users can follow any web3 profile",
            "deprecated old wallet page",
            "switch to wallet assets using new web3 profiles endpoints for mobile and web yup-live",
            "added comment number for farcaster",
            "added possibility to reply to any farcaster post or comment if you have farcaster connected",
            "improved the SSG process a bit",
            "rewrote the followers' page to use web3 profiles and pagination",
            "added new OG images for main static pages",
            "added recommended web3 profiles on large screens on web3Profile page",
            "some style adjustments",
            "added option to sent confirmation cast on farcaster connect",
            "added option to insert twitter followers as personal keywords on twitter link",
            "submited mobile android yup live version 1.0.9",
        ],
    },
]


export const oldChanges = [

    {
        date: "23 FEB - 2023",
        title: "Changes",
        changes: [
            "moved and refactor checking the auth for farcaster if you previously connected your farcaster",
            "minor seo SSG improvements, no SSR yet to avoid costs",
            "other minor changes like removing some warnings",
        ],
    },
    {
        date: "22 FEB - 2023",
        title: "Changes",
        changes: [
            "updated most dependencies to latest",
            "updated to latest turboRepo & Android Gradle",
            "clean & remove unused dependencies & refresh lock file",
            "switch to vite for mobile app",
            "added link/unlink to Twitter on account settings on yup-live",
            "added search page and filters on yup-live",
            "switch to the latest tailwind on mobile",
            "moved buy-yup to footer",
            "changed ~120 files",
            "changed markdown lib to one with a larger set of features",
            "minor updates to wallet connectivity on mobile",
            "switch connect bg modal to white to not confuse QR scanners",
            "added report posts on mobile & yup-live",
            "further reduced mobile bundle size to < 5mb and build time < 20s",
            "removed yup controls(vote/data/info) on live farcaster feed on YUP live",
            "add open in browser on mobile if URL is a valid web link",
        ],
    },
    {
        date: "13 FEB - 2023",
        title: "Changes",
        changes: [
            "change raw influence page",
            "added posibility param to raw influence page",
            "added calculator to get derived influence from raw influence",
            "fixed connect modal not loading on /login",
            "fixed route /sign-up title",
        ],
    },
    {
        date: "5 FEB - 2023",
        title: "Changes",
        changes: [
            "added detection of deleted tweed",
            "added posibility to manualy load broken tweet",
            "made graphs more responsive",
            "fixed gini population graph",
            "added time period title to gini graph",
            "fixed coingecko raw price (API changed)",
        ],
    },
    {
        date: "15 JAN - 2023",
        title: "Changes",
        changes: [
            "added yup score page to check details of any EVM address score",
            "switch navigation in mobile",
            "fixed daily emission not loading for year 2023",
        ],
    },
    {
        date: "24 DEC - 2022",
        title: "Changes",
        changes: [
            "made follow/unfollow usable",
            "unified post types",
            "added the wnft image of mirror as post preview",
            "added setting to enable/disable feed personalization",
            "other fixes misc fixes",
            "added paination to wallet profile section",
        ],
    },
    {
        date: "22 DEC - 2022",
        title: "Changes",
        changes: [
            "migrated mobile + web yup live to farcaster v2",
            "added on yup web app the web3 content feed and farcaster feed if you are connected to farcaster",
            "added the ability to send a cast if you are connected to farcaster",
            "fixed menu for web app if you are viewing with a mobile device",
        ],
    },
    {
        date: "15 DEC - 6 DEC 2022",
        title: "Changes",
        changes: [
            "added meetings page for mobile",
            "added connect/disconnect to farcaster on settings on frontend",
            "various fixes and improvements",
            "added twitter feed",
        ],
    },
    {
        date: "1 DEC - 6 DEC 2022",
        title: "Changes",
        changes: [
            "changed mobile navigation structure",
            "better support for hardware back button",
            "minimize app on navigation back end",
            "added account settings page with edit / delete account",
            "added search page",
            "added info page on login/signup",
            "better handle wallet connection issues",
            "themed connection modal",
            "rf a bit the alert stack notifications still need some work",
            "added pull to refresh on account page",
            "unified and change splash screen for all android versions",
        ],
        milestone: true,
    },
    {
        date: "27 NOV 2022",
        title: "Changes",
        changes: [
            "made repo into a monorepo for mobile app",
            "inital mobile app with features login/signup/feeds/acitvity, etc",
            "added changeLog page on yup live to outline changes",
            "added community meetings page",
            "added json download for gini data",
            "made staking page more reactive",
            "added stake position on staking page",
            "added setting page with edit / delete account",
        ],
        milestone: true,
    },
    {
        date: "8 NOV 2022",
        title: "Changes",
        changes: ["added the default static metadata", "changed the dynamic metadata"],
        milestone: false,
    },
    {
        date: "7 NOV 2022",
        title: "Changes",
        changes: ["updated all dependencies to latest version"],
        milestone: false,
    },
    {
        date: "3 NOV 2022",
        title: "Changes",
        changes: [
            "refactor fetchWithAuth",
            "added auto login in extension if login/signup on yup live",
        ],
        milestone: false,
    },
    {
        date: "2 NOV 2022",
        title: "Changes",
        changes: [
            "remove link to my EVM wallet until later",
            "added changes required for new auth system",
        ],
        milestone: false,
    },
    {
        date: "7 OCT 2022",
        title: "Changes",
        changes: ["add hotname to sitemap", "change max vote"],
        milestone: false,
    },
    {
        date: "25 SEP 2022",
        title: "Changes",
        changes: ["misc UI fixes", "remove some hardcoded values", "fix some typos"],
        milestone: false,
    },
    {
        date: "30 SEP 2022",
        title: "Changes",
        changes: ["fix wallet connect network name"],
        milestone: false,
    },
    {
        date: "25 SEP 2022",
        title: "Changes",
        changes: ["fix wallet connect network name"],
        milestone: false,
    },
    {
        date: "22 SEP 2022",
        title: "Changes",
        changes: ["add web3socials page to check EVM for social accounts"],
        milestone: false,
    },
    {
        date: "16 SEP 2022",
        title: "Changes",
        changes: [
            "only allow polygon tx on staking page",
            "use paginatied api for collection view",
        ],
        milestone: false,
    },
    {
        date: "14 SEP 2022",
        title: "Changes",
        changes: ["added wallet profile page"],
        milestone: false,
    },
    {
        date: "30 AUG - 14 SEP 2022",
        title: "Changes",
        changes: [
            "deployed yup live v2",
            "added signup, signin, voting, posts, staking, feeds, etc",
            "various fixes & optimizations",
            "added SSG build step",
        ],
        milestone: true,
    },
    {
        date: "6 AUG 2022",
        title: "Changes",
        changes: ["revised sellers page"],
        milestone: false,
    },
    {
        date: "3 AUG 2022",
        title: "Changes",
        changes: ["replaced caption with urls in api calls"],
        milestone: false,
    },
    {
        date: "3 JUL 2022",
        title: "Changes",
        changes: ["convert dots to thumbs"],
        milestone: false,
    },
    {
        date: "18 JUN 2022",
        title: "Changes",
        changes: ["change account route due to permalink change"],
        milestone: false,
    },
    {
        date: "9 JUN 2022",
        title: "Changes",
        changes: ["added export to top sellers", "added headers to csv export"],
        milestone: false,
    },
    {
        date: "8 JUN ",
        title: "Changes",
        changes: [
            "added historic raw influence to raw influence page",
            "changed gini UI controls",
            "refactor d3 components",
            "added gini tren graph",
        ],
        milestone: false,
    },
    {
        date: "24 MAY 2022",
        title: "Changes",
        changes: ["add pacge to check raw influence"],
        milestone: false,
    },
    {
        date: "20 MAY 2022",
        title: "Changes",
        changes: ["changed banned icon", "made the check async"],
        milestone: false,
    },
    {
        date: "19 MAY 2022",
        title: "Changes",
        changes: ["fix check if user is really banned"],
        milestone: false,
    },
    {
        date: "18 MAY 2022",
        title: "Changes",
        changes: [
            "add gini data",
            "switch to live endpoints",
            "fixes to gini & misc fixes",
            "added expremiment python as frontend code",
        ],
        milestone: false,
    },
    {
        date: "9 MAY 2022",
        title: "Changes",
        changes: ["add link to users"],
        milestone: false,
    },
    {
        date: "7 MAY 2022",
        title: "Changes",
        changes: ["fix triming"],
        milestone: false,
    },
    {
        date: "5 MAY 2022",
        title: "Changes",
        changes: [
            "fix color table nav on light theme",
            "fix table name",
            "other misc fixes",
        ],
        milestone: false,
    },
    {
        date: "4 MAY 2022",
        title: "Changes",
        changes: ["add top sellers page"],
        milestone: false,
    },
    {
        date: "2 MAY 2022",
        title: "Changes",
        changes: ["add top earners page"],
        milestone: false,
    },
    {
        date: "2 APR 2022",
        title: "Changes",
        changes: ["feat pagination on hard reload"],
        milestone: false,
    },
    {
        date: "1 APR 2022",
        title: "Changes",
        changes: ["correct total supply and diluted mcap"],
        milestone: false,
    },
    {
        date: "30 MAR 2022",
        title: "Changes",
        changes: ["Add custom error page", "fixed emissions"],
        milestone: false,
    },
    {
        date: "21 MAR 2022",
        title: "Changes",
        changes: ["initial setup", "first build"],
        milestone: true,
    },
];

export const changes = [...recentChanges, ...oldChanges];