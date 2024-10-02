<script lang="ts">
    import { enhance } from "$app/forms"
    import PasswordInput from "./PasswordInput.svelte"

    let username = ""
    let password = ""
    let rememberMe = false
    let error = ""

    async function handleSubmit(event: Event) {
        error = "" // Reset error message
        // Here you would typically handle the login logic
        // For now, we'll just simulate a login attempt
        if (username === "test" && password === "password") {
            console.log("Login successful")
            // Redirect or update app state here
        } else {
            error = "Invalid username or password"
        }
    }
</script>

<div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Log In</h2>

    <form on:submit|preventDefault={handleSubmit} use:enhance>
        {#if error}
            <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
            >
                <span class="block sm:inline">{error}</span>
            </div>
        {/if}

        <div class="mb-4">
            <label
                for="username"
                class="block mb-2 text-sm font-medium text-gray-600"
                >Username</label
            >
            <input
                type="text"
                id="username"
                bind:value={username}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        <div class="mb-4">
            <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-600"
                >Password</label
            >
            <PasswordInput bind:value={password} />
        </div>

        <div class="flex items-center justify-between mb-4">
            <label class="flex items-center">
                <input type="checkbox" bind:checked={rememberMe} class="mr-2" />
                <span class="text-sm text-gray-600">Remember me</span>
            </label>
            <a
                href="/auth/forgot-password"
                class="text-sm text-blue-500 hover:underline"
                >Forgot Password?</a
            >
        </div>

        <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
            Log In
        </button>
    </form>

    <div class="mt-4 text-center">
        <span class="text-sm text-gray-600">Don't have an account?</span>
        <a
            href="/auth/signup"
            class="text-sm text-blue-500 hover:underline ml-1">Sign Up</a
        >
    </div>
</div>
