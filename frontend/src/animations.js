// Custom animation utilities for TaskFlow Pro

export const fadeIn = (element, duration = 300) => {
  element.style.opacity = '0'
  element.style.transition = `opacity ${duration}ms ease-in-out`
  
  requestAnimationFrame(() => {
    element.style.opacity = '1'
  })
}

export const slideInFromLeft = (element, duration = 500) => {
  element.style.transform = 'translateX(-100%)'
  element.style.opacity = '0'
  element.style.transition = `all ${duration}ms ease-out`
  
  requestAnimationFrame(() => {
    element.style.transform = 'translateX(0)'
    element.style.opacity = '1'
  })
}

export const slideInFromRight = (element, duration = 500) => {
  element.style.transform = 'translateX(100%)'
  element.style.opacity = '0'
  element.style.transition = `all ${duration}ms ease-out`
  
  requestAnimationFrame(() => {
    element.style.transform = 'translateX(0)'
    element.style.opacity = '1'
  })
}

export const slideInFromBottom = (element, duration = 500) => {
  element.style.transform = 'translateY(50px)'
  element.style.opacity = '0'
  element.style.transition = `all ${duration}ms ease-out`
  
  requestAnimationFrame(() => {
    element.style.transform = 'translateY(0)'
    element.style.opacity = '1'
  })
}

export const pulse = (element, duration = 1000) => {
  element.style.animation = `pulse ${duration}ms ease-in-out`
}

export const bounce = (element, duration = 600) => {
  element.style.animation = `bounce ${duration}ms ease`
}

export const shake = (element, duration = 500) => {
  element.style.animation = `shake ${duration}ms ease-in-out`
}

// Add CSS keyframes to document
const addKeyframes = () => {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `
  document.head.appendChild(style)
}

// Initialize animations
addKeyframes()