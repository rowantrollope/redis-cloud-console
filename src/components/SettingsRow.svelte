<script lang="ts">
    
</script>

<div class="flex w-full items-center p-2 border-b hover:bg-gray-100 dark:hover:bg-slate-500">
    <div class="text-black"><slot name="left"></slot></div>
    <div class="grow"></div>
    <div class="grow text-right"><slot name="right"></slot></div>
</div>
