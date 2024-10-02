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

    function handleLogout() {
        // Clear cookies or make a request to logout endpoint
        document.cookie = "access_token=; Max-Age=0; path=/;"
        document.cookie = "refresh_token=; Max-Age=0; path=/;"
        goto("/")
    }
</script>

<!-- <Navbar fluid={true}>
    <NavContainer class="bg-green-500 w-full">
        <div class="bg-green-500 w-full">
            Hello
        </div>
    </NavContainer>
</Navbar> -->

<div class="bg-white flex space-x-2 pl-4">
    <NavBrand href="/" class="py-0">
        <img src="/redislogo.png" class="me-3 h-6" alt="Redis Logo" />
        <span class="text-xl dark:text-slate-900 redis-grotesk">
            Cloud Console
        </span>
    </NavBrand>
    <div class="grow"></div>
    <NavHamburger />
    <NavUl>
        <NavLi>
            <Button
                color="none"
                class="redis-mono"
                on:click={() => goto("/cloud-accounts")}
            >
                Cloud Accounts
            </Button>
        </NavLi>
        <NavLi>
            <Button
                color="none"
                class="redis-mono"
                on:click={() => goto("/cloud-accounts")}
            >
                Alerting
            </Button>
        </NavLi>
        <NavLi>
            <Button
                color="none"
                class="redis-mono"
                on:click={() => goto("/cloud-accounts")}
            >
                Reports
            </Button>
        </NavLi>
        <NavLi>
            <Button
                color="none"
                class="redis-mono"
                on:click={() => goto("/cloud-accounts")}
            >
                Statistics
            </Button>
        </NavLi>
        <NavLi>
            <DarkMode />
        </NavLi>
    </NavUl>
</div>

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
