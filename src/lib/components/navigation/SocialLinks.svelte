<!-- SocialLinks.svelte -->
<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
  
    export let siteSettings: any;
  </script>
  
  <div
    class="flex w-full flex-row items-end justify-end gap-3 border-t-[.35rem] border-primary bg-gray-300 pr-16"
  >
    {#each siteSettings.expand.socials as item}
      {@const iconSrc = `${PUBLIC_POCKETBASE_URL}/api/files/${item.collectionId}/${item.id}/${item?.icon}`}
      {#if item.newTab}
        <Button href={item.path} target="_blank" variant="ghost" class="gap-2">
          <img src={iconSrc} class="h-4 w-4" alt={item.title} />
          {item.title}
        </Button>
      {:else}
        <Button href={item.path} variant="ghost" class="gap-2">
          <img src={iconSrc} class="h-4 w-4" alt={item.title} />
          {item.title}
        </Button>
      {/if}
    {/each}
  </div>