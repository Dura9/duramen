const COLORS = ['#4A7C6F', '#D4A855', '#5cb8a0', '#e85c0d', '#fff', '#a8d8cf']

export function launchConfetti(count = 60) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.className = 'confetti-piece'
    el.style.left = Math.random() * 100 + 'vw'
    el.style.top = '-10px'
    el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)]
    el.style.width = (Math.random() * 8 + 6) + 'px'
    el.style.height = (Math.random() * 8 + 6) + 'px'
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
    el.style.animationDuration = (Math.random() * 2 + 1.5) + 's'
    el.style.animationDelay = (Math.random() * 0.6) + 's'
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 4000)
  }
}
