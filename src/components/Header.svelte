<script>
    import {
        Navbar,
        NavBrand,
        NavLi,
        NavUl,
        DarkMode,
        NavHamburger,
    } from "flowbite-svelte"

    import IoIosSettings from "svelte-icons/io/IoIosSettings.svelte"
</script>

<Navbar class="bg-white dark:bg-white">
    <NavBrand href="/">
            <img src="/redislogo.png" class="me-3 h-6" alt="Redis Logo" />
            <span
                class="self-center whitespace-nowrap text-sm font-semibold dark:text-slate-900 font-mono"
            >
                Cloud Insight
            </span>
    </NavBrand>
    <NavHamburger/>
    <DarkMode />
</Navbar>
