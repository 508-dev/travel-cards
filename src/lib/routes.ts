export type AppRoute = "maker" | "card";

const normalizePath = (path: string): string => {
  if (!path || path === "/") {
    return "/";
  }

  return path.replace(/\/+$/, "");
};

export const getRouteFromPath = (path: string): AppRoute => {
  const normalized = normalizePath(path);

  if (normalized === "/card") {
    return "card";
  }

  return "maker";
};

export const getPathForRoute = (route: AppRoute): string => {
  return route === "card" ? "/card" : "/";
};
