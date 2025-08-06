const rateLimitMap = new Map()

export const rateLimiter = (ip, limit, windowMs) => {
  const now = Date.now()
  const windowStart = now - windowMs

  const records = rateLimitMap.get(ip) || []
  const requestsInWindow = records.filter(timestamp => timestamp > windowStart)

  if (requestsInWindow.length >= limit) {
    return false // Rate limit exceeded
  }

  requestsInWindow.push(now)
  rateLimitMap.set(ip, requestsInWindow)

  return true // Allowed
}
