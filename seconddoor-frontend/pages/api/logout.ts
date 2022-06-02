import { withSessionRoute } from 'lib/session'

type Data = {
  data: string
}

export default withSessionRoute(async (req: any, res: any) => {
  req.session.destroy()
  res.json(201)
})
