/// <reference lib="webworker" />
export type {};
declare let self: ServiceWorkerGlobalScope;

// @ts-ignore
const resources = self.__WB_MANIFEST;

self.addEventListener("install", function (event) {
  console.log("Hello world from the Service Worker 🤙");
});

self.addEventListener("message", function (event) {
    if (event.data.type == "reloadSession") {
        self.clients.matchAll().then(function (clients) {
            clients.forEach(function (client) {
                if (event.source && typeof event.source == typeof Client) {
                    if (client.id == (event.source as Client).id) return;
                }
                client.postMessage({ type: "reloadSession" })
            })
        })
    }
})