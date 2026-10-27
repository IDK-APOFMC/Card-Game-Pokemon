export function setupNavigation(app) {
  app.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      const viewName = button.dataset.view;

      app.querySelectorAll(".nav-button").forEach((navButton) => {
        const isActive = navButton.dataset.view === viewName;

        navButton.classList.toggle("is-active", isActive);
        navButton.setAttribute("aria-pressed", String(isActive));
      });

      app.querySelectorAll(".view-panel").forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.view === viewName);
      });
    });
  });
}
