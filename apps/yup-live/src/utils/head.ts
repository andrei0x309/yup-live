export const deleteMeta = () => {
    if (document) {
        const allMeta = document.head.querySelectorAll(('meta'))
        allMeta.forEach(m => {
            if (m.name !== 'viewport') {
                m.parentElement?.removeChild(m)
            }
        })
    }
}
