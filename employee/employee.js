document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
  const employeeId = idParam !== null ? Number(idParam) : null;
  const dataPath = employeeId === null
    ? "employee/employees.json"
    : "../employee/employees.json";

      fetch(dataPath)
    .then((res) => res.json())
    .then((data) => {
            if (employeeId === null) {
        const grid = document.querySelector(".employee-grid");
        const loadMoreBtn = document.getElementById("load-more-btn");
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
        const perLoad = 3;

        const createCard = (emp) => {
          const card = document.createElement("div");
          card.className = "employee-card fade-in";
          card.innerHTML = `
            <div class="image-wrapper" style="background-image: url('assets/images/interview/${emp.photo}');">
              <span class="employee-caption">${emp.caption}</span>
              <div class="employee-info-overlay">
                <span class="mbti-label ${getMbtiClass(emp.mbti)}">${emp.mbti}</span>
                <h4 class="employee-name">${emp.name}</h4>
                <p class="employee-role">${emp.role || emp.department || ""}</p>
                <a href="employee/detail.html?id=${emp.id}" class="detail-link">詳細を見る</a>
              </div>
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
          if (currentIndex >= data.length) {
            loadMoreBtn.style.display = "none";
          }
        };

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
    })
    .catch((err) => {
      console.error("社員データの取得に失敗しました", err);
    });
    });