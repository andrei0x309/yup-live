export const getStaticMetaFrame = (image: string) => {
    const meta = [
        {
            "name": "fc:frame",
            "content": "vNext"
        },
        {
            "name": "fc:frame:image",
            "content": image
        },
        {
            "name": "fc:frame:post_url",
            "content": 'https://yup.live'
        },
        {
            "name": "fc:frame:image:aspect_ratio",
            "content": "1.91:1"
        },
        {
            "name": "fc:frame:button:1",
            "content": "Visit Yup.live"
        },
        {
            "name": "fc:frame:button:1:action",
            "content": "link"
        },
        {
            "name": "fc:frame:button:1:target",
            "content": "https://yup.live"
        },
        {
            "name": "fc:frame:button:2",
            "content": "Join Yup"
        },
        {
            "name": "fc:frame:button:2:action",
            "content": "link"
        },
        {
            "name": "fc:frame:button:2:target",
            "content": "https://yup.live/sign-up"
        },
        {
            "name": "fc:frame:button:3",
            "content": "MiniApp"
        },
        {
            "name": "fc:frame:button:3:action",
            "content": "link"
        },
        {
            "name": "fc:frame:button:3:target",
            "content": 'https://warpcast.com/?composerActionURL=https%3A%2F%2Fapi.paragraph.xyz%2Ffarcaster%2Fv2%2Faction%3Furl%3Dhttps%3A%2F%2Fyup.live'
        },
    ] as { name: string, content: string }[];
    return meta;
};