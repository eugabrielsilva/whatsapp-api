import express, { Request, Response } from 'express'
import { logger } from '../utils/format'
import { CreatedResponse } from '../@types/response'

const router = express.Router()

router.post('/', (req: Request, res: Response<CreatedResponse>) => {
  logger('info', 'Hook received in test route:', req.body)
  res.status(200).json({
    status: true,
    message: 'Hook received. Check the console logs.'
  })
})

export default router
