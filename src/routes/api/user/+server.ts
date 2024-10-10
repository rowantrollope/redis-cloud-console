import { json, type RequestHandler } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { userID } = await request.json()

    if (!userID) {
        return json({ error: "User ID is required" }, { status: 400 })
    }

    // Set the new user_id cookie
    cookies.set("user_id", userID, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
    })

    return json({ success: true })
}
