document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const employeeId = Number(params.get("id")); // ← ここを修正！
  if (isNaN(employeeId)) return;

  // 相対パス：detail.html は employee フォルダ内にあるので一つ上の階層から
  fetch("../employee/employees.json")
    .then((res) => res.json())
    .then((data) => {
      const employee = data.find(emp => emp.id === employeeId);
      if (!employee) {
        console.error("該当の社員が見つかりません");
        return;
      }

      // 画像の設定
      const photoEl = document.getElementById("employee-photo");
      if (photoEl) {
        photoEl.src = `../assets/images/interview/${employee.photo}`;
        photoEl.alt = employee.name;
      }

      // 基本情報の表示
      document.getElementById("employee-name").textContent = employee.name;
      document.getElementById("employee-role").textContent = employee.role || employee.department || "役職情報なし";
      document.getElementById("employee-mbti").textContent = `MBTI: ${employee.mbti}`;

      // インタビュー内容（Q&A）を表示
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
    })
    .catch((err) => {
      console.error("社員データの取得に失敗しました", err);
    });
});