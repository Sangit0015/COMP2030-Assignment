 const modal = document.getElementById("registerModal");
      const openBtn = document.getElementById("openRegister");
      const closeBtn = document.getElementById("closeModal");

      openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "flex";
      });

      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });