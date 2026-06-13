// ===== AUTH UTILITIES =====

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

// SHA-256 hash using Web Crypto API
export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Decode JWT payload (no verification — client-side only)
export function decodeJWT(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch {
    return null
  }
}

// RoleMap: { [userId]: 'admin' | 'user' }
export function getRoleMap() {
  try {
    return JSON.parse(localStorage.getItem('inec_roleMap') || '{}')
  } catch {
    return {}
  }
}

export function setUserRole(userId, email) {
  const roleMap = getRoleMap()
  const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase())
  roleMap[userId] = isAdmin ? 'admin' : 'user'
  localStorage.setItem('inec_roleMap', JSON.stringify(roleMap))
  return roleMap[userId]
}

export function getUserRole(userId) {
  const roleMap = getRoleMap()
  return roleMap[userId] || 'user'
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('inec_user') || 'null')
  } catch {
    return null
  }
}

export function setCurrentUser(token) {
  const decoded = decodeJWT(token)
  if (!decoded) return null
  const role = setUserRole(decoded.userId || decoded.id, decoded.email)
  const user = { ...decoded, role }
  localStorage.setItem('inec_token', token)
  localStorage.setItem('inec_user', JSON.stringify(user))
  return user
}

export function logout() {
  localStorage.removeItem('inec_token')
  localStorage.removeItem('inec_user')
}

export function isAuthenticated() {
  return !!localStorage.getItem('inec_token')
}
