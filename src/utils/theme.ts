const getThemeMode = () => {
  let theme = localStorage.getItem('theme')
  if (theme == null) {
    // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //   theme = 'dark'
    // } else {
    //   theme = 'light'
    // }
    theme = 'dark'
    localStorage.setItem('theme', theme)
  }
  return theme
}

export { getThemeMode }
