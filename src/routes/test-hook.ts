import express, { Request, Response } from 'express'

const router = express.Router()

router.post('/', (req: Request, res: Response) => {
  console.log(req.body)
  res.status(200).json({
    status: true,
    message: 'Hook received. Check the console.'
  })
})

export default router
