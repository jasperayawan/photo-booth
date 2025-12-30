/**
 * Photo Booth Embed Script
 * Usage:
 *   <script src="https://photobooth.app/embed.js"></script>
 *   <div id="photobooth-widget" data-theme="light" data-brand="Your Brand"></div>
 */

(function () {
  "use strict";

  const EMBED_URL = "https://photobooth.app/embed";

  function init() {
    const containers = document.querySelectorAll("#photobooth-widget, .photobooth-widget");

    containers.forEach((container) => {
      if (container.dataset.initialized === "true") return;

      const theme = container.dataset.theme || "light";
      const brand = container.dataset.brand || "Photo Booth";
      const filter = container.dataset.filter || "None";
      const frame = container.dataset.frame || "Classic";
      const controls = container.dataset.controls !== "false";
      const width = container.dataset.width || "100%";
      const height = container.dataset.height || "600px";

      const params = new URLSearchParams({
        theme,
        brand,
        filter,
        frame,
        controls: controls.toString(),
      });

      const iframe = document.createElement("iframe");
      iframe.src = `${EMBED_URL}?${params.toString()}`;
      iframe.style.width = width;
      iframe.style.height = height;
      iframe.style.border = "none";
      iframe.style.borderRadius = "12px";
      iframe.style.overflow = "hidden";
      iframe.allow = "camera; microphone";
      iframe.title = brand + " Photo Booth";

      container.appendChild(iframe);
      container.dataset.initialized = "true";

      // Listen for messages from the iframe
      window.addEventListener("message", (event) => {
        if (event.data.type === "photobooth-download") {
          // Dispatch custom event for parent page to handle
          container.dispatchEvent(
            new CustomEvent("photobooth:download", {
              detail: { imageUrl: event.data.imageUrl },
            })
          );
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose API for manual initialization
  window.PhotoBoothEmbed = {
    init: init,
    version: "3.0.0",
  };
})();
