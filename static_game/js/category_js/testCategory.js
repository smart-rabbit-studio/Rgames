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
        card.className = "bg-indigo-600 rounded-lg p-4 cursor-pointer hover:bg-indigo-500";
        card.textContent = app.name;
  
        card.onclick = () => {
          const url = `/category/test.html?category=${app.id}&app=${encodeURIComponent(app.name)}`;
          location.href = url;
        };
  
        listDiv.appendChild(card);
      });
  
      // 선택된 앱이 있으면 표시 및 실행
      if (selectedAppName) {
        const targetApp = categoryApps.find(app => app.name === selectedAppName);
  
        if (!targetApp) {
          appContentDiv.innerHTML = `<p class="text-red-400">앱 정보를 찾을 수 없습니다.</p>`;
          return;
        }
  
        selectedAppDiv.classList.remove("hidden");
  
        const htmlRes = await fetch(targetApp.path);
        if (!htmlRes.ok) throw new Error("앱 HTML 로딩 실패");
  
        const html = await htmlRes.text();
        appContentDiv.innerHTML = html;
  
        // 앱 JS 자동 로딩 시도
        const jsPath = targetApp.path.replace(/\.html$/, ".js");
        const script = document.createElement("script");
        script.src = jsPath;
        script.defer = true;
        script.onerror = () => console.warn("앱 JS 파일 없음 (무시됨)");
        document.body.appendChild(script);
      }
    } catch (err) {
      console.error("앱 목록 로딩 실패:", err);
      appContentDiv.innerHTML = `<p class="text-red-400">앱 데이터를 불러올 수 없습니다.</p>`;
    }
  });
  
  function goBackToMain() {
    location.href = "/main_page.html";
  }