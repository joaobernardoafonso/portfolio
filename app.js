console.log("app.js carregado");

document.addEventListener("DOMContentLoaded", function () {

    const video = document.getElementById("loop");
    const workBtn = document.getElementById("workBtn");
    const workPanel = document.getElementById("workPanel");
    const homeLink = document.getElementById("homeLink");
    const closePanel = document.getElementById("closePanel");
    const backdrop = document.getElementById("editorialBackdrop");
    const body = document.body;

    /* =========================
       LOOP DO VÍDEO
    ========================= */
    if (video) {
        video.addEventListener("ended", () => {
            video.currentTime = 0;
            video.play();
        });
    }

    /* =========================
       FUNÇÕES DE ESTADO
    ========================= */
    const openPanel = () => {
        body.classList.add("work-open");
    };

    const closePanelFn = () => {
        body.classList.remove("work-open");
        body.classList.remove("work-expanded"); // RESET TOTAL
    };

    /* =========================
       BOTÃO WORK (ABRE / FECHA)
    ========================= */
    if (workBtn) {
        workBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (body.classList.contains("work-open")) {
                closePanelFn();
            } else {
                openPanel();
            }
        });
    }

    /* =========================
       IMPEDIR FECHAR AO CLICAR NO PAINEL
    ========================= */
    if (workPanel) {
        workPanel.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }

    /* =========================
       BOTÃO X
       - se expanded → volta atrás
       - se normal → fecha painel
    ========================= */
    if (closePanel) {
        closePanel.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (body.classList.contains("work-expanded")) {
                body.classList.remove("work-expanded");
            } else {
                closePanelFn();
            }
        });
    }

    /* =========================
       BACKDROP → FECHA (RESET)
    ========================= */
    if (backdrop) {
        backdrop.addEventListener("click", closePanelFn);
    }

    /* =========================
       CLICAR FORA → FECHA (RESET)
    ========================= */
    document.addEventListener("click", function () {
        if (body.classList.contains("work-open")) {
            closePanelFn();
        }
    });

    /* =========================
       ESC → FECHA (RESET)
    ========================= */
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && body.classList.contains("work-open")) {
            closePanelFn();
        }
    });

    /* =========================
       ACORDEÃO PROJETOS
       (só um aberto de cada vez)
    ========================= */
    const projectTitles = document.querySelectorAll(".project-title");

    projectTitles.forEach(title => {
        title.addEventListener("click", function (e) {
            e.stopPropagation();

            const content = title.nextElementSibling;

            document.querySelectorAll(".project-content.active").forEach(open => {
                if (open !== content) {
                    open.classList.remove("active");
                    open.previousElementSibling.classList.remove("active");
                }
            });

            const isActive = content.classList.toggle("active");
            title.classList.toggle("active", isActive);
        });
    });

    /* =========================
       (MORE) → EXPANDE / RETRAI
       ISOLADO DO RESTO
    ========================= */
    const moreToggle = document.querySelector(".more-toggle");

    if (moreToggle) {
        moreToggle.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const expanded = body.classList.toggle("work-expanded");
            moreToggle.classList.toggle("active", expanded);
        });
    }

});
