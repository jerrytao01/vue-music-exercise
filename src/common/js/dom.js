export function addClass (el, className) {
  el.classList.add(className)
}

export function getData (el, name, val) {
  const fullName = 'data-' + name
  return val ? el.setAttribute(fullName, val) : el.getAttribute(fullName)
}
