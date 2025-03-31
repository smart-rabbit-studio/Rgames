// /js/category_js/test.js

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const selectedAppName = params.get("app");
  const categoryId = "test";

  const listDiv = document.getElementById("test-list");
  const selectedAppDiv = document.getElementById("selected-app");
  const appContentDiv = document.getElementById("app-content");

  try {
    const res = await fetch("/apps.json");
    const apps = await res.json();
    const categoryApps = apps[categoryId] || [];

    // 앱 목록 출력
    categoryApps.forEach(app => {
      const card = document.createElement("div");
      card.className =
        "bg-indigo-600 rounded-lg p-4 cursor-pointer hover:bg-indigo-500 transition-all";
      card.textContent = app.name;

      // 클릭 시 앱 실행 화면만 렌더링 (SPA 방식)
      card.onclick = async () => {
        await loadApp(app, categoryApps);
        // 주소창 업데이트 (선택사항)
        history.pushState(null, "", `?app=${encodeURIComponent(app.name)}`);
      };

      listDiv.appendChild(card);
    });

    // 첫 진입 시 URL에 선택된 앱이 있다면 자동 로딩
    if (selectedAppName) {
      const targetApp = categoryApps.find(app => app.name === selectedAppName);
      if (targetApp) {
        await loadApp(targetApp, categoryApps);
      } else {
        appContentDiv.innerHTML = `<p class="text-red-400">앱 정보를 찾을 수 없습니다.</p>`;
      }
    }
  } catch (err) {
    console.error("앱 목록 로딩 실패:", err);
    appContentDiv.innerHTML = `<p class="text-red-400">앱 데이터를 불러올 수 없습니다.</p>`;
  }

  // 메인으로 돌아가기 버튼
  window.goBackToMain = function () {
    location.href = "/main_page.html";
  };

  // 앱 로딩 함수 (중복 제거 및 SPA 방식 적용)
  async function loadApp(app, categoryApps) {
    try {
      const htmlRes = await fetch(app.path);
      if (!htmlRes.ok) throw new Error("앱 HTML 로딩 실패");

      const html = await htmlRes.text();
      selectedAppDiv.classList.remove("hidden");
      appContentDiv.innerHTML = html;

      // 이전 스크립트 제거 (중복 방지)
      const existingScript = document.getElementById("dynamic-app-script");
      if (existingScript) existingScript.remove();

      // 앱 JS 자동 로딩 시도
      const jsPath = app.path.replace(/\.html$/, ".js");
      const script = document.createElement("script");
      script.id = "dynamic-app-script";
      script.src = jsPath;
      script.defer = true;
      script.onerror = () => console.warn("앱 JS 파일 없음 (무시됨)");
      document.body.appendChild(script);
    } catch (err) {
      console.error("앱 실행 실패:", err);
      appContentDiv.innerHTML = `<p class="text-red-400">앱 실행 중 오류가 발생했습니다.</p>`;
    }
  }
});
