<script lang="ts">
    import {
        Navbar,
        NavBrand,
        NavUl,
        NavLi,
        Button,
        DarkMode,
        NavHamburger,
    } from "flowbite-svelte"

    import { page } from "$app/stores"
    import { goto } from "$app/navigation"

    let isAuthenticated = false

    $: {
        // Check if the user is authenticated based on the presence of accessToken
        const { accessToken } = $page.data
        isAuthenticated = !!accessToken
    }

    function handleLogin() {
        goto("/auth/login")
    }
    $: activeUrl = $page.url.pathname

    function handleLogout() {
        // Clear cookies or make a request to logout endpoint
        document.cookie = "access_token=; Max-Age=0; path=/;"
        document.cookie = "refresh_token=; Max-Age=0; path=/;"
        goto("/")
    }
</script>

<Navbar fluid={true} class="bg-white flex space-x-2 border-b border-gray-300 dark:bg-white">
    <NavBrand href="/">
        <img src="/redislogo.png" class="me-3 h-6" alt="Redis Logo" />
        <span class="text-lg font-normal mt-2 -ml-1 dark:text-slate-900 whitespace-nowrap">
            Cloud Insight >
        </span>
    </NavBrand>
    <NavHamburger />
    <NavUl {activeUrl} class="">
        <NavLi href="/console" nonActiveClass="redis-mono hover:text-red-500 text-black" activeClass="redis-mono text-red-500">Console</NavLi>
        <NavLi href="/download" nonActiveClass="redis-mono hover:text-red-500 text-black" activeClass="redis-mono text-red-500">Download</NavLi>
        <NavLi href="/alerts" nonActiveClass="redis-mono hover:text-red-500 text-black" activeClass="redis-mono text-red-500">Alerting</NavLi>
        <NavLi href="/settings" nonActiveClass="redis-mono hover:text-red-500 text-black" activeClass="redis-mono text-red-500">Settings</NavLi>
        <!-- <DarkMode /> -->
    </NavUl>
</Navbar>

<!-- <Navbar let:NavContainer class="py-0" fluid={true}>
    <NavContainer class="bg-white py-0 my-0 px-0">
        <NavBrand href="/" class="py-0">
            <img src="/redislogo.png" class="me-3 h-6" alt="Redis Logo" />
            <span class="text-xl dark:text-slate-900 redis-grotesk">
                Cloud Insight
            </span>
        </NavBrand>
        <NavHamburger />
        <NavUl>
            <NavLi>
                <Button
                    color="none"
                    class="redis-mono"
                    on:click={() => goto("/cloud-accounts")}
                >
                    Redis Cloud
                </Button>
            </NavLi>
            <NavLi>
                <DarkMode />
            </NavLi>
        </NavUl>
    </NavContainer>
</Navbar>  -->
