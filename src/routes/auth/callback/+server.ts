import type { RequestHandler } from "./$types"
import { getOAuthClient } from "$lib/auth/oauthClient"

export const GET: RequestHandler = async ({ url, request, cookies }) => {
    const client = await getOAuthClient()
    const params = client.callbackParams(url)

    console.log("/CALLBACK GET: params", params)
    // Retrieve the stored state from cookies
    const storedState = cookies.get('oauth_state')
    // Clear the stored state cookie
    cookies.delete('oauth_state', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
    })

    // Validate the state parameter
    if (params.state !== storedState) {
        return new Response('Invalid state parameter', { status: 400 })
    }

    // Exchange the authorization code for tokens
    const tokenSet = await client.callback(
        process.env.RI_CLOUD_IDP_REDIRECT_URI as string,
        params
    )

    // Store tokens in cookies
    cookies.set('access_token', tokenSet.access_token, {
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'lax',
    })

    cookies.set('refresh_token', tokenSet.refresh_token, {
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'lax',
    })

    // Redirect to the dashboard or desired page
    return Response.redirect('/dashboard')
}
