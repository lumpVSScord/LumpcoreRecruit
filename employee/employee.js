document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  const employeeId = idParam !== null ? Number(idParam) : null;
  const dataPath = employeeId === null
    ? "employee/employees.json"
    : "../employee/employees.json";

  const initialize = (data) => {
    if (employeeId === null) {
      const grid = document.querySelector(".employee-grid");
      const loadMoreBtn = document.getElementById("load-more-btn");
      const section = document.getElementById("employee-interviews");
      if (!grid || !loadMoreBtn) return;

      const getMbtiClass = (mbti) => {
        const analysts = ["INTJ", "INTP", "ENTJ", "ENTP"];
        const diplomats = ["INFJ", "INFP", "ENFJ", "ENFP"];
        const sentinels = ["ISTJ", "ISFJ", "ESTJ", "ESFJ"];
        const explorers = ["ISTP", "ISFP", "ESTP", "ESFP"];
        if (analysts.includes(mbti)) return "mbti-analyst";
        if (diplomats.includes(mbti)) return "mbti-diplomat";
        if (sentinels.includes(mbti)) return "mbti-sentinel";
        if (explorers.includes(mbti)) return "mbti-explorer";
        return "";
      };

      let currentIndex = 0;
      const perLoad = window.matchMedia('(max-width: 768px)').matches ? 4 : 3;

      const createCard = (emp) => {
        const card = document.createElement("a");
        card.className = "employee-card fade-in";
        card.href = `employee/detail.html?id=${emp.id}`;
        card.innerHTML = `
            <div class="image-wrapper" style="background-image: url('assets/images/interview/${emp.photo}');">
              <span class="role-tag">${emp.role}</span>
              <span class="join-date">${emp.joinedDate}</span>
              <div class="employee-info">
                <div class="employee-name-overlay">
                  <h4 class="employee-name">${emp.name}</h4>
                </div>
                <span class="mbti-label ${getMbtiClass(emp.mbti)}">${emp.mbti}</span>
              </div>
              <span class="detail-link">夢忠人を知る <i class="fas fa-arrow-up-right-from-square"></i></span>
            </div>`;
        return card;
      };


      const loadMore = () => {
        const slice = data.slice(currentIndex, currentIndex + perLoad);
        slice.forEach((emp) => {
          const card = createCard(emp);
          grid.appendChild(card);
          requestAnimationFrame(() => card.classList.add("visible"));
        });
        currentIndex += slice.length;
        loadMoreBtn.style.display = currentIndex >= data.length ? "none" : "block";
      };

      if (section) {
        section.classList.remove("hidden");
        section.classList.add("visible");
      }
      loadMoreBtn.style.display = "block";
      loadMoreBtn.addEventListener("click", loadMore);
      loadMore();
    } else {
      const employee = data.find((emp) => emp.id === employeeId);
      if (!employee) {
        console.error("該当の社員が見つかりません");
        return;
      }

      const photoEl = document.getElementById("employee-photo");
      if (photoEl) {
        photoEl.src = `../assets/images/interview/${employee.photo}`;
        photoEl.alt = employee.name;
      }

      document.getElementById("employee-name").textContent = employee.name;
      document.getElementById("employee-role").textContent = employee.role || employee.department || "役職情報なし";
      document.getElementById("employee-mbti").textContent = `MBTI: ${employee.mbti}`;

      const backLink = document.getElementById("back-to-index");
      if (backLink) {
        backLink.setAttribute("aria-label", "トップページの社員インタビュー一覧へ戻る");
      }

      const nextLink = document.getElementById("next-employee-link");
      if (nextLink) {
        const currentIndex = data.findIndex((emp) => emp.id === employeeId);
        if (currentIndex !== -1) {
          const nextEmployee = data[(currentIndex + 1) % data.length];
          nextLink.href = `detail.html?id=${nextEmployee.id}`;
          nextLink.setAttribute("aria-label", `${nextEmployee.name}のインタビューへ移動`);

          const nextTitle = nextLink.querySelector(".nav-title");
          if (nextTitle) {
            nextTitle.textContent = `次の社員：${nextEmployee.name}`;
          }

          const nextSubtitle = nextLink.querySelector(".nav-subtitle");
          if (nextSubtitle) {
            nextSubtitle.textContent = `${nextEmployee.role}のインタビューを見る`;
          }
        }
      }

      const interviewContainer = document.getElementById("employee-interview");
      if (Array.isArray(employee.interview)) {
        employee.interview.forEach((qa) => {
          const block = document.createElement("div");
          block.className = "qa-block";

          const q = document.createElement("div");
          q.className = "question";
          q.textContent = "Q. " + qa.q;

          const a = document.createElement("div");
          a.className = "answer";
          a.textContent = qa.a;
          block.appendChild(q);
          block.appendChild(a);
          interviewContainer.appendChild(block);
        });
      }
    }
  };

  const loadData = () => {
    fetch(dataPath)
      .then((res) => res.json())
      .then(initialize)
      .catch((err) => {
        console.error("社員データの取得に失敗しました", err);
      });
  };

  if (employeeId === null) {
    const section = document.getElementById("employee-interviews");
    if (!section) return;
    section.classList.remove("hidden");
    section.classList.add("visible");
    loadData();
  } else {
    loadData();
  }
});