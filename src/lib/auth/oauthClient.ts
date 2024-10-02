import { Issuer, type Client } from "openid-client"

let client: Client

export async function getOAuthClient(): Promise<Client> {
    if (client) return client

    const issuerUrl = process.env.RI_CLOUD_IDP_ISSUER as string

    // Replace the issuer URL with the Redis Cloud's OAuth2 provider URL
    const issuer = await Issuer.discover(issuerUrl) // Update this URL accordingly
   // console.log("getOAuthClient", issuer)

    console.log("Calling isser.client")
    client = new issuer.Client({
        client_id: process.env.RI_CLOUD_IDP_CLIENT_ID as string,
        // client_secret: process.env.OAUTH_CLIENT_SECRET as string,
        redirect_uris: [process.env.RI_CLOUD_IDP_REDIRECT_URI as string],
        response_types: ["code"],
    })
    console.log("client", client)

    return client
}
