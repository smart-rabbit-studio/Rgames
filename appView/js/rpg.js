document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(location.search);
    const selectedApp = params.get("app");
    const selectedCategory = params.get("category");
  
    const toolListDiv = document.getElementById("tool-list"); // 있을 경우만 사용
    const selectedAppDiv = document.getElementById("selected-app");
    const appContentDiv = document.getElementById("app-content");
  
    let appsByCategory = {};
  
    // apps.json 로드
    try {
      const res = await fetch("/apps.json");
      const data = await res.json();
      appsByCategory = data;
    } catch (err) {
      console.error("apps.json 로드 실패:", err);
      appContentDiv.innerHTML = `<p class="text-red-400">앱 목록을 불러오지 못했습니다.</p>`;
      return;
    }
  
    // 앱 목록 화면일 경우만 처리
    if (toolListDiv) {
      const category = "tools"; // 현재 페이지 카테고리명
      const toolGameList = appsByCategory[category] || [];
  
      toolGameList.forEach(app => {
        const appCard = document.createElement("div");
        appCard.className = "bg-indigo-600 rounded-lg p-4 cursor-pointer hover:bg-indigo-500";
        appCard.textContent = app.name;
  
        appCard.onclick = () => {
          const url = `/html/game/game.html?category=${app.id}&app=${encodeURIComponent(app.name)}`;
          location.href = url;
        };
  
        toolListDiv.appendChild(appCard);
      });
    }
  
    // 앱 실행 화면 처리
    if (selectedApp && selectedCategory && appsByCategory[selectedCategory]) {
      const appInfo = appsByCategory[selectedCategory].find(app => app.name === selectedApp);
  
      if (!appInfo) {
        appContentDiv.innerHTML = `<p class="text-red-400">앱 정보를 찾을 수 없습니다.</p>`;
        return;
      }
  
      selectedAppDiv.classList.remove("hidden");
  
      try {
        const res = await fetch(appInfo.path);
        if (!res.ok) throw new Error("앱 HTML 로드 실패");
  
        const html = await res.text();
        appContentDiv.innerHTML = html;
  
        // JS 파일 로드 (선택)
        const jsPath = appInfo.path.replace("index.html", "index.js");
        const script = document.createElement("script");
        script.src = jsPath;
        script.defer = true;
        script.onerror = () => console.warn("앱 JS 로딩 실패 (무시됨)");
        document.body.appendChild(script);
  
      } catch (err) {
        appContentDiv.innerHTML = `<p class="text-red-400">"${selectedApp}" 앱을 불러올 수 없습니다.</p>`;
        console.error(err);
      }
    }
  });
  