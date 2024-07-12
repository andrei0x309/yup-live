export const recentChanges = [
    {
        date: "12 July - 2024",
        title: "Changes",
        changes: [
            'updated web and mobile dependencies',
            'Migrate to Ionic 8 on mobile',
            'migrate to capacitor 6 on mobile',
            'deleted deprecated NFTs and bluesky feeds',
            'added threads feed',
            'removed the score from the display and replaced that with pro account status',
            'added ability to add favorite farcaster channels',
            'added workflow to announce commits and new versions'
        ]
    },
    {
        date: "25 June - 2024",
        title: "Changes",
        changes: [
            'delete gated info from signup',
            'change farcaster channel in post to be displayed as /channel.id',
            'enable long cast post for farcaster'
        ]
    },
    {
        date: "02 June - 2024",
        title: "Changes",
        changes: [
            'cross post modal perf improvements',
            'deprecate profile menu buttons for wallet and collection',
            'deprecate search posts'
        ]
    },
    {
        date: "24 May - 2024",
        title: "Changes",
        changes: [
            'deprecated wallet page from web3Profile and yup profile on yup web/android',
            'added new multi-login method that supports team accounts',
        ]
    },
    {
        date: "22 May - 2024",
        title: "Changes",
        changes: [
            'deprecated wallet and collection page from yup profile on yup live web',
        ]
    },
    {
        date: "21 May - 2024",
        title: "Changes",
        changes: [
            'removed yup-score from yup live web/mobile',
            'small crosspost improvements',
        ],
    },
    {
        date: "14 May - 2024",
        title: "Changes",
        changes: [
            'removed the staking page from yup live mobile because it was deprecated',
            'replaced the staking page with the claim page on yup live mobile',
            'on a farcaster post if user dosen\'t have farcaster handle FID will be shown instead of the handle',
        ],
    },
    {
        date: "13 May - 2024",
        title: "Changes",
        changes: [
            'added exit liqudity on deprecated staking page that ca be accesed at /stake route'
        ],
    },
    {
        date: "12 May - 2024",
        title: "Changes",
        changes: [
            'deprecated polygon staking page on yup live web',
            'replaced staking links with claim links on yup live web',
            'added support for claiming yup rewards on yup live web',
        ],
    },
    {
        date: "30 April - 2024",
        title: "Changes",
        changes: [
            'improved edge case for handeling images in farcaster posts',
        ],
    },
    {
        date: "15 April - 2024",
        title: "Changes",
        changes: [
            'loaded all supported EVM chains in wallet lib',
            'added unfollow notification type',
            'added a test page to claim content rewards',
            'changed some routes in yup live web dropdown',
        ],
    },
    {
        date: "27 March - 2024",
        title: "Changes",
        changes: [
            'added frontend implementation for farcaster tx frames',
        ],
    },
    {
        date: "24 March - 2024",
        title: "Changes",
        changes: [
            'Added new Android version',
            'Added the ability to navigate to any channel from the farcaster post',
            'Migrated wallet libs to latest version',
            'Reduced targetSdkVersion to 33 to avoid issues with some devices',
            'Fixed page enter hook for staking page on yup live mobile',
            'enabled CB since it looks like it is working with the latest libs',
        ],
    },
    {
        date: "21 March - 2024",
        title: "Changes",
        changes: [
            'smaller improvements on staking page',
            'do full reload on user switch on mobile',
            'fix link of bsky profiles on web3profile page'
        ],
    },
    {
        date: "09 March - 2024",
        title: "Changes",
        changes: [
            'new Android version',
            'added switch accounts on yup live mobile in settings',
            'added farcaster channels page on yup live mobile',
            'tested multiple lens profile selection',
            'refactored lens connection'
        ],
    },
    {
        date: "08 March - 2024",
        title: "Changes",
        changes: [
            'added message on score page when score will not be calculated to avoid user confusion',
            'added some effect on post loading to reduce CLS'
        ],
    },
    {
        date: "05 March - 2024",
        title: "Changes",
        changes: [
            'new Android version',
            'better post body mention support',
            'better farcaster frames support',
            'various style changes',
            'added login with desktop web app',
        ],
    },
    {
        date: "04 March - 2024",
        title: "Changes",
        changes: [
            'enable choosing lens profile if user has multiple lens profiles on both web and mobile',
            'new Android version',
            'nuke all app storage on logout, to protect user privacy',
            'allow owner to delete their own posts on mobile as well',
            'improved web3profile display, added external links to all social handles',
            'added back 404 page on yup live web',
            'added channel display to farcaster posts',
            'tested feed endpoint for loading posts from specific channels, added some channels on yup live web',
            'made posts clickable',
            'changed to always show the parent post',
            'added navigation over quoted posts',
            'changed the way cross-post-modal is triggered to improve performance',
            'deleted warpcast preview links as they are deprecated in favor of embed casts',
            'changed scroll behavior on yup live web on navigation',
            'decoupled reply button from post modal',
            'added dynamic body text mentions',
        ],
    },
    {
        date: "26 Feb - 2024",
        title: "Changes",
        changes: [
            'new Android version',
            'improved progressive media loading',
            'added video support for crossposting on web app too',
            'improved hardware back button handling',
        ],
    },
    {
        date: "25 Feb - 2024",
        title: "Changes",
        changes: [
            'new Android version',
            'other minor crosspost improvements',
            'added infinite scroll to comments',
            'display improvements for quoted farcaster and videos',
            'added breakify on post body',
        ],
    },
    {
        date: "24 Feb - 2024",
        title: "Changes",
        changes: [
            'frame optimizations',
            'crosspost improvements',
        ],
    },
    {
        date: "17 Feb - 2024",
        title: "Changes",
        changes: [
            'minor frame changes',
            'minor design changes',
            'linkify URLs in posts',
        ],
    },
    {
        date: "10 Feb - 2024",
        title: "Changes",
        changes: [
            'updated deps',
            'improved error handling',
            'updated android native deps',
            'added basic frames',
            'added basic reposts',
            'added post to fc channels',
            'added support for HW back button to close lightbox',
            'enabled coinbase wallet only for yup live web app'
        ],
    },
    {
        date: "24 January - 2024",
        title: "Changes",
        changes: [
            'improved display on staking page on yup live mobile',
            'improved image preview on yup live mobile',
            'improved update prompt on yup live mobile',
        ]
    },
    {
        date: "21 January - 2024",
        title: "Changes",
        changes: [
            'added support for copy paste image when creating a post on yup live web',
            'added list of scheduled posts on yup live web',
            'added support for scheduling posts on yup live web',
            'added support for canceling scheduled posts on yup live web',
            'improved lens connection without using lens client',
            'improved tweet display',
            'added crosspost icons to posts that are crossposted',
            'restyled general link preview',
            'added additional external embeds',
            'added scheduled support for yup live mobile',
            'added notification when app is updated',
        ]
    },
    {
        date: "18 January - 2024",
        title: "Changes",
        changes: [
            'removed dayjs in favor of native implementation',
        ]
    },
    {
        date: "16 January - 2024",
        title: "Changes",
        changes: [
            'new android version 1.2.2',
            'optimized cross-post modal',
            'improved support for crossposting videos on Android',
            'small UI improvements',
        ]
    },
    {
        date: "13 January - 2024",
        title: "Changes",
        changes: [
            'optimized avatar loading with viewport observer',
            'removed community meetings from yup live mobile',
        ]
    },
    {
        date: "12 January - 2024",
        title: "Changes",
        changes: [
            'added more support for blocking/reporting users and posts',
            'updated farcaster connect to use only warpcast as is no more support for arbitrary connect with wallet',
            'released new version of yup live mobile 1.2.1',
            'verified, updated & tested connecting accounts to: lens, twitter, blueksy, farcaster'
        ]
    },
    {
        date: "10 January - 2024",
        title: "Changes",
        changes: [
            'updated to latest turbo repo',
            'updated avatars api to 7.x',
            'migrated from windicss(deprecated) to latest tailwindcss',
        ]
    },
    {
        date: "2 January - 2024",
        title: "Changes",
        changes: [
            'restricted access to yup live desktop to only people that get access through polygon contract',
            'updated web3modal to latest major 3.x.x, updated all ethereum libs & wallet interaction utils to work with new libs',
            'removed threads connect/disconnect because is not supported at the moment by backend',
            'updated yup live web to latest major vite 5.x.x',
            'updated turborepo to latest major stable pkg manager yarn 4.x.x',
            'updated to latest vue 3.4.x',
            'changed runtime environment to node 20.10.0',
        ]
    },
    {
        date: "9 August - 2023",
        title: "Changes",
        changes: [
            'improved push token handling',
            'added edge cases to handle youtube embeds'
        ],
    },
    {
        date: "7 August - 2023",
        title: "Changes",
        changes: [
            'improved cross post modal',
            'refactored lens connection',
            'improved parsing of media',
            'added coinbase wallet support',
            'optimized, reduced and updated all dependencies',
            'updated gradle to latest 8.1.0',
            'changed icon to match splash screen',
            'replace latest yup tweets with latest yup lens posts on yup.live home page',
            'released 1.1.28 version',
            'refactored alert system',
            'enabled viewing of bsky profiles since backend now supports it'
        ],
    },
]


export const oldChanges = [
    {
        date: "4 August - 2023",
        title: "Changes",
        changes: [
            'added horizontal chips to account page',
            'added threads icon to profile card for connected',
            'small ui changes for yup live notifications',
        ],
    },
    {
        date: "3 August - 2023",
        title: "Changes",
        changes: [
            'added auto-retry for failed platforms on post',
            'added thread platform connecting, disconnecting, posting, and post type support',
            'move post button in yup-live mobile to top beside cancel button',
            'various style changes, especially web3Profile card to better fit if user has many socials',
            'refactored embeds & addded new external embeds'
        ],
    },
    {
        date: "1 August - 2023",
        title: "Changes",
        changes: [
            'enabled push notifications on yup live mobile',
            'addedd settings for push notifications on yup live mobile',
            'added update system on yup live mobile to direct users to update or force them if needed',
            'added script to publish new version of yup live mobile json on yup live web',
            'on link socials click user is directed directly on linking socials section with the motivation to link socials',
            'improved clear notifications on yup live mobile',
            'added additional checks on bsky',
            'added additional version number display on yup live mobile',
            'added additional settings button in side many for easy access',
            'added suport for displaying mention, repost, comment notifications on yup live mobile',
            'added get lens comments from YUP DB instead of lens API',
            'revamped link preview on yup live mobile',
            'disabled push for types reward and repost as they are not implemented yet on backend',
            'added support for image preview to support gallery',
            'updated wallet lib, add additional autoConnect to prevent wagmi bug `connectorNotFoundError`, improved performance on preparing wallet interaction',
            'changed dev server to https to test websockets',
            'added basic lightbox to images displayed as gallery/single',
            'refactored post types farcaster, lens, bsky to use same logic for filling and fetching post body and comments',
            'fixed emissions data storage location',
            'added option to basic share link to sharte to yup live mobile',
            'added custom svg icon for notifications on yup live mobile',
            're-enabled reward and repost push notifications on yup live mobile',
            'added avatar of user in cross post modal',
            'wrote native service to be able to get push from expo when app is closed',
            'updated all dependecies',
            'Updated FAQ on YUP Live Android',
            'various performance and refactorings',
            'added version number on connect page on yup live mobile',
        ],
    },
    {
        date: "21 July - 2023",
        title: "Changes",
        changes: [
            'fix twitter post type due to change to twitter post format',
            'added new post button/link socials in header if user is logged in on web app',
            'change a bit the design of cross post modal on web app and mobile',
            'added cross post/link socials button to navigation on yup live mobile and removed the ones on profile',
            'WIP reversed expo notification system to be able to get later push notifications on mobile',
            'changed profile to show connected platforms on yup live mobile',
            'changed target compilation for android to 33 and minSDK to 22'
        ],
    },
    {
        date: "20 July - 2023",
        title: "Changes",
        changes: [
            'optimized & changed splash screen from yup live mobile',
            'added support for loading older notifs on yup live web',
            'migrated to lastest capacitor 5 on yup live mobile',
            'changed voting component to a more simple like component that shows num of likes instead of weight and also will delete vote if clicked again + will show if action is pending and if acction succeded',
            'migrating wallet functionality to work with WalletConnect V2 for login, signup',
            'changed main wallet lib to wgami core changed all tx from stake, connect, etc to use wgami core',
            'moved all common stake logic to shared util',
            'new yup live extension version with the following changes: *migrated from windicss to tailwindcss, *migrated to web3-notifications and adapted them *changed like component, *changed injected overlay to support new like component and delete vote',
            'released new web, desktop and mobile version'
        ],
    },
    {
        date: "14 July - 2023",
        title: "Changes",
        changes: [
            'migrate notification system to web3-notifications',
            'increase precision with 2 decimals to show correct token price',
            'made notification components shared between yup-live and yup-live-mobile',
            'replaced crypto feed with blue sky feed in mobile and web versions',
            'released new web, desktop and mobile version',
            'added support for connecting and disconnecting to blueSky on yup-live web',
            'added additional createdAt check since some posts are missing old field',
            'added bsky handle in web3Profile',
            'added support for connecting and disconnecting to blue sky on yup live mobile',
            'added support on yup live web to delete your own posts',
            'fix: prevent double images for farcaster posts',
            'added check in feed if posts are null since was deleted on backend'
        ],
    },
    {
        date: "4 July - 2023",
        title: "Changes",
        changes: [
            'added basic support for viewing blue sky post type',
            'added review login additional check',
            'added check in case APRs api are not available',
        ],
    },
    {
        date: "6 May - 2023",
        title: "Changes",
        changes: [
            'Login wallet timeout increeased to 90s from 15s to allow cold wallet users to login',
            'Change release tag of desktop to not conflict with main branch',
            'Moved staking abis to shared package',
            'Added staking page to yup live mobile',
            'Removed unused followers page on yup-live mobile',
            'Moved staking input component to shared package',
            'fix don\'t show reply button for farcaster if user is not connected to farcaster',
        ],
    },
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

export const updateNotify = ({
    stackAlertSuccess,
    router
}:
    {
        stackAlertSuccess?: (message: string, update?: boolean, router?: any) => void
        router?: any
    }
) => {
    const lastUpdate = localStorage.getItem('lastUpdate')
    const sendUpdate = lastUpdate !== recentChanges[0].date
    if (sendUpdate) {
        stackAlertSuccess && stackAlertSuccess('App Updated, click to check update!', true, router)
        localStorage.setItem('lastUpdate', recentChanges[0].date)
    }

}
