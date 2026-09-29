import express, { Request, Response } from 'express'
import { GetHistoryResponse } from '../@types/response'
import Queue from '../utils/queue'

const router = express.Router()

router.get('/', async (req: Request, res: Response<GetHistoryResponse>) => {
    res.status(200).json({
        status: true,
        data: Queue.history
    })
})

export default router
