import express, { Request, Response } from 'express'
import path from 'path'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'src/manager/index.html'))
})

router.post('/login', async (req: Request, res: Response) => {
    const { token } = req.body

    if (token === process.env.AUTH_TOKEN) {
        res.status(200).json({ status: true, message: 'Login successful.' })
    } else {
        res.status(401).json({ status: false, error: 'Invalid password.' })
    }
});

export default router
