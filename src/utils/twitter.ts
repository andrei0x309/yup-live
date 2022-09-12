/* eslint-disable @typescript-eslint/no-explicit-any */
export const loadTwitterFactory = async (window: any) => {
  await new Promise((resolve) => {
    window.twttr = (function (d, s) {
      if (window.twttr) return window.twttr
      const js = d.createElement(s) as any
      js.async = true
      js.defer = true
      js.src = 'https://platform.twitter.com/widgets.js'
      js.onLoad = resolve
      d.body.appendChild(js)

      const t = window.twttr || {}
      t._e = []
      t.ready = function (f: any) {
        t._e.push(f)
      }

      return t
    })(document, 'script')
  })
}

export const createTweetEmbed = async (id: string, theme = 'dark') => {
  await (window as any).twttr.widgets.createTweet(id, document.getElementById('container'), {
    theme
  })
}
