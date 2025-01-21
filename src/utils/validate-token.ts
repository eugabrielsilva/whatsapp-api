import { Request, Response, NextFunction } from 'express'

function validateToken(req: Request, res: Response, next: NextFunction): void {
  const authToken = process.env.AUTH_TOKEN
  if (!authToken?.length) return next()

  const excludedRoutes = ['/test-hook', '/media/*']

  if (excludedRoutes.some(route => req.path.match(new RegExp(`^${route}$`)))) {
    return next()
  }

  const authHeader = req.headers['authorization']

  if (!authHeader?.length) {
    res.status(401).json({
      status: false,
      error: 'Missing auth token.'
    })
    return
  }

  const token = authHeader.split(' ')[1]

  if (!token?.length || token !== authToken) {
    res.status(403).json({
      status: false,
      error: 'Invalid auth token.'
    })
    return
  }

  return next()
}

export default validateToken
