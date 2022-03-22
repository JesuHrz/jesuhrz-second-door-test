import type { NextApiRequest, NextApiResponse } from 'next'
import withSession from 'lib/session'

export default withSession(async (req: NextApiRequest<Any>, res: NextApiResponse<Data>) => {
  req.session.destroy()
  res.json(201)
})