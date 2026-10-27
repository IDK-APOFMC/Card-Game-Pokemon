export function setupPokemonCardInteractions(container) {
  const card = container.querySelector(".pokemon-card");
  const autoRotateButton = container.querySelector(".auto-rotate-button");
  const rotateStatus = container.querySelector(".rotate-status");

  let rotationX = 0;
  let rotationY = 0;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let dragging = false;
  let moved = false;
  let autoRotate = true;

  function applyTransform() {
    card.style.transform = `
      rotateX(${rotationX}deg)
      rotateY(${rotationY}deg)
    `;
  }

  function pauseAutoRotation() {
    autoRotate = false;
    card.style.animation = "none";
    autoRotateButton.textContent = "▶ Activar giro";
    autoRotateButton.setAttribute("aria-pressed", "false");
    rotateStatus.textContent = "Giro automático pausado";
  }

  function startAutoRotation() {
    autoRotate = true;
    card.style.transform = "";
    card.style.animation = "rotate-card 9s linear infinite";
    autoRotateButton.textContent = "⏸ Pausar giro";
    autoRotateButton.setAttribute("aria-pressed", "true");
    rotateStatus.textContent = "Giro automático activado";
  }

  autoRotateButton.addEventListener("click", () => {
    if (autoRotate) {
      pauseAutoRotation();
    } else {
      startAutoRotation();
    }
  });

  card.addEventListener("pointerdown", (event) => {
    if (autoRotate) {
      pauseAutoRotation();
    }

    dragging = true;
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
    lastX = event.clientX;
    lastY = event.clientY;
    card.setPointerCapture(event.pointerId);
  });

  card.addEventListener("pointermove", (event) => {
    if (!dragging) {
      return;
    }

    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;

    if (
      Math.abs(event.clientX - startX) > 8 ||
      Math.abs(event.clientY - startY) > 8
    ) {
      moved = true;
    }

    rotationY += deltaX * 0.6;
    rotationX -= deltaY * 0.4;
    rotationX = Math.max(-35, Math.min(35, rotationX));
    applyTransform();
    lastX = event.clientX;
    lastY = event.clientY;
  });

  card.addEventListener("pointerup", (event) => {
    if (!dragging) {
      return;
    }

    dragging = false;

    try {
      card.releasePointerCapture(event.pointerId);
    } catch {
      // No pasa nada.
    }

    if (!moved) {
      rotationY += 180;
      applyTransform();
    }
  });

  card.addEventListener("pointercancel", () => {
    dragging = false;
  });
}
