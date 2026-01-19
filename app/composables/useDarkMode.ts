export const useDarkMode = () => {
  const isDark = useState('darkMode', () => false)

  const initDarkMode = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('darkMode')
      if (stored !== null) {
        isDark.value = stored === 'true'
      }
      applyDarkMode()
    }
  }

  const applyDarkMode = () => {
    if (import.meta.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    if (import.meta.client) {
      localStorage.setItem('darkMode', String(isDark.value))
      applyDarkMode()
    }
  }

  if (import.meta.client) {
    onMounted(() => {
      initDarkMode()
    })
  }

  return { isDark, toggleDarkMode }
}