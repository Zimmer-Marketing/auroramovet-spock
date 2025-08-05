<script lang="ts">
	import { createEventDispatcher, onDestroy } from "svelte";

    const dispatch = createEventDispatcher();

  interface Props {
    page?: number;
  }

  let { page = $bindable(1) }: Props = $props();

    function viewportAction(e) {
        console.log(e);
        const observer = new IntersectionObserver(
            (entries) => {
                if(entries[0].isIntersecting) {
                    if (page < 1) {
                        page++;
                    }
                    dispatch('loadMore', page);
                }
            }
        )
        observer.observe(e);
    }



</script>

<element use:viewportAction></element>


  
