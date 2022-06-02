import { withSessionRoute } from 'lib/session'

type Data = {
  data: string
}

export default withSessionRoute(async (req: any, res: any) => {
  try {
    const body = await req.body
    req.session.token = body.jwt
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
