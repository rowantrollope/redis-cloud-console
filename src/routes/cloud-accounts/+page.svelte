<script lang="ts">
    import RedisCloudAccountPanel from "../../components/CloudAccount/RedisCloudAccountPanel.svelte"

</script>

<div class="flex flex-col gap-2 items-start w-full justify-start p-4">
    <h1 class="text-left text-2xl font-bold">Cloud Accounts</h1>

    <div class="flex flex-col gap-2 items-start w-full">
        <div class="p-4 flex flex-col w-full">
            <RedisCloudAccountPanel />
        </div>
    </div>
</div>
