export default async function handler(req, res) {
  try {
    const { filterState = {}, extras = {} } = req.body || {}
    // Dynamic import the TS utility compiled to JS in the build - but in dev mode, we can import from src
    const util = await import('../../../lib/utils/filterUtils')
    const params = util.buildProductQueryParams(filterState, extras)
    res.status(200).json({ params: params.toString() })
  } catch (err) {
    console.error('Error in build-params debug route:', err)
    res.status(500).json({ error: err.message })
  }
}
