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
            "content": 'https://live.yup.io'
        },
        {
            "name": "fc:frame:image:aspect_ratio",
            "content": "1.91:1"
        },
        {
            "name": "fc:frame:button:1",
            "content": "Visit live.yup.io"
        },
        {
            "name": "fc:frame:button:1:action",
            "content": "link"
        },
        {
            "name": "fc:frame:button:1:target",
            "content": "https://live.yup.io"
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
            "content": "https://live.yup.io/sign-up"
        },
    ] as { name: string, content: string }[];
    return meta;
};