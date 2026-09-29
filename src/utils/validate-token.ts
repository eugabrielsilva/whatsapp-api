import { Request, Response, NextFunction } from 'express'

const AUTH_TOKEN = process.env.AUTH_TOKEN

const EXCLUDED_ROUTES = [
  '/test-hook',
  '/media/.+',
  '/manager(/.*)?'
]

export default function validateToken(req: Request, res: Response, next: NextFunction): void {
  if (!AUTH_TOKEN?.length) return next()

  if (EXCLUDED_ROUTES.some(route => req.path.match(new RegExp(`^${route}$`)))) {
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

  if (!token?.length || token !== AUTH_TOKEN) {
    res.status(403).json({
      status: false,
      error: 'Invalid auth token.'
    })
    return
  }

  return next()
}