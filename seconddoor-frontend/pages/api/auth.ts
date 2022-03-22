// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import withSession from 'lib/session'

type Data = {
  data: string
}

export default withSession(async (req: NextApiRequest<Any>, res: NextApiResponse<Data>) => {
  try {
    const body = await req.body
    console.log('body', body)
    req.session.set('token', body.jwt)
    await req.session.save()
    res.json({ data: 'Authenticated' })
  } catch (error: any) {
    const { response } = error
    console.log('error', error)
    res
      .status(response?.status || 500)
      .json({ data: 'Unauthorised' })
  }
})
