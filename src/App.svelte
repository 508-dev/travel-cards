<script lang="ts">
  import { onMount } from "svelte";
  import CardBuilder from "./views/CardBuilder/CardBuilder.svelte";
  import CardView from "./views/CardView/CardView.svelte";
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
  <CardBuilder />
{/if}
