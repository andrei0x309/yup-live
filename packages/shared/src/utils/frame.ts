export const getStaticMetaFrame = (image: string) => {
    const meta = [
        {
            "name": "fc:frame",
            "content": "vNext"
        },
        {
            "name": "fc:frame:image",
            "content": "https://moxie-frames.airstack.xyz/MoxieBalance/starting.png?v=1"
        },
        {
            "name": "fc:frame:post_url",
            "content": "https://moxie-frames.airstack.xyz/mb/frame?r="
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
    ] as { name: string, content: string }[];
    return meta;
};