<script>
    import Header from "../components/Header.svelte"
    import Footer from "../components/Footer.svelte"
    import "../app.css"    
</script>

<div class="app bg-gray-50 dark:bg-slate-800 min-h-screen">
    <Header />

    <main>
        <slot />
    </main>

    <Footer/>
    
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 64rem;
        margin: 0 auto;
        box-sizing: border-box;
    }
</style>
