import type { RequestHandler } from "./$types"
import { getOAuthClient } from "$lib/auth/oauthClient"
import crypto from "crypto"

export const GET: RequestHandler = async ({ locals, cookies }) => {
    const client = await getOAuthClient()

    // Generate a random `state` parameter for CSRF protection
    const state = crypto.randomBytes(16).toString("hex")
    console.log("state", state)

    // Store the state in cookies for later verification
    cookies.set("oauth_state", state, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
    })

    console.log("/AUTH/LOGIN GET: client", client)
    client.redirect_uri = process.env.RI_CLOUD_IDP_REDIRECT_URI as string

    // Generate the authorization URL
    const authorizationUrl = client.authorizationUrl({
        scope: "openid email profile",
        state,
    })

    console.log("/AUTH/LOGIN GET: authorizationUrl", authorizationUrl)

    // Redirect the user to the authorization URL
    //return Response.redirect(authorizationUrl)
    // Redirect the user to the authorization URL
    return new Response(null, {
        status: 302,
        headers: {
            Location: authorizationUrl,
        },
    })
}
