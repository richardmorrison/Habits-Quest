export const Router = (() => {
  let onRoute = () => {};
  let defaultRoute = "today";

  function parseHash(){
    const h = location.hash.replace("#", "").trim();
    return h || defaultRoute;
  }

  function go(route){
    location.hash = route;
  }

  function handle(){
    onRoute(parseHash());
  }

  function init({ defaultRoute: d, onRoute: cb }){
    defaultRoute = d || defaultRoute;
    onRoute = cb || onRoute;
    window.addEventListener("hashchange", handle);
    handle();
  }

  return { init, go };
})();
