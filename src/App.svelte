<script lang="ts">
  import { onMount } from "svelte";
  import MakerView from "./views/MakerView.svelte";
  import CardView from "./views/CardView.svelte";
  import { getRouteFromPath, type AppRoute } from "./lib/routes";

  const initialPath =
    typeof window === "undefined" ? "/" : window.location.pathname;
  let route: AppRoute = getRouteFromPath(initialPath);

  const syncRoute = () => {
    route = getRouteFromPath(window.location.pathname);
  };

  onMount(() => {
    syncRoute();
    window.addEventListener("popstate", syncRoute);

    return () => {
      window.removeEventListener("popstate", syncRoute);
    };
  });
</script>

{#if route === "card"}
  <CardView />
{:else}
  <MakerView />
{/if}
