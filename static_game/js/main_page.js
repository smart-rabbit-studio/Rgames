function scrollApps(id, direction) {
    const scrollContainer = document.getElementById(id);
    if (!scrollContainer) return;
    const scrollAmount = scrollContainer.offsetWidth * 0.6;
    scrollContainer.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  }
  
  function scrollToCategory(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  const appMap = {};
  
  fetch('/apps.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("category-container");
  
      for (const category in data) {
        const apps = data[category];
  
        const section = document.createElement("section");
        section.id = `category-${category}`;
        section.className = "w-full scroll-mt-24 bg-white/10 backdrop-blur-sm rounded-xl shadow border border-white/10 px-4 py-4";
        section.innerHTML = `
          <div class="flex items-center gap-2 mb-3 px-1 border-l-4 border-pink-400 pl-3">
            <h2 class="text-xl sm:text-2xl font-bold text-white">${getCategoryEmoji(category)} ${category}</h2>
          </div>
          <div class="relative h-[10rem] group">
            <button onclick="scrollApps('${category}', -1)" class="scroll-button left-0">←</button>
            <button onclick="scrollApps('${category}', 1)" class="scroll-button right-0">→</button>
            <div class="overflow-hidden">
              <div id="${category}" class="flex overflow-x-auto h-full scroll-smooth gap-4 px-4 pb-2"></div>
            </div>
          </div>
        `;
        container.appendChild(section);
  
        const appContainer = section.querySelector(`#${category}`);
        apps.forEach(app => {
          appMap[app.name.toLowerCase()] = { category: app.id, name: app.name };
  
          const card = document.createElement("div");
          card.className = "min-w-[7rem] sm:min-w-[8rem] md:min-w-[9rem] aspect-square bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 shadow-lg border border-white/30 animate-[floating_3s_infinite]";
          card.innerHTML = `
            <div class="w-[70%] aspect-square bg-white bg-opacity-90 rounded-xl flex items-center justify-center shadow-lg mt-[6%]">
              <img src="${app.icon}" class="w-[60%]" />
            </div>
            <p class="mt-2 font-semibold text-white tracking-wide text-[85%]">${app.name}</p>
          `;
          card.onclick = () => openApp(app.id, app.name);
          appContainer.appendChild(card);
        });
      }
    })
    .catch(err => {
      console.error("apps.json 로드 실패:", err);
    });
  
  function handleSearch() {
    const input = document.getElementById("search-input");
    const query = input.value.trim().toLowerCase();
    if (!query || !appMap[query]) {
      alert("앱을 찾을 수 없습니다.");
      return;
    }
  
    const { category, name } = appMap[query];
    scrollToCategory(`category-${category}`);
    setTimeout(() => scrollToApp(`${category}`, name), 400);
  }
  
  function scrollToApp(containerId, appName) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const appElements = container.querySelectorAll("p");
    for (const p of appElements) {
      if (p.textContent.trim() === appName) {
        const card = p.closest("div");
        if (card) {
          card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
          card.classList.add("ring-2", "ring-pink-400");
          setTimeout(() => card.classList.remove("ring-2", "ring-pink-400"), 1500);
        }
        break;
      }
    }
  }
  
  function openApp(category, appName) {
    fetch('/apps.json')
      .then(res => res.json())
      .then(data => {
        const appList = data[category];
        const app = appList.find(a => a.name === appName);
        if (!app || !app.id) {
          alert("앱 경로를 찾을 수 없습니다.");
          return;
        }
        location.href = `/category/${app.id}.html?category=${app.id}&app=${app.name}`;
      })
      .catch(() => {
        alert("앱 정보를 불러오는 데 실패했습니다.");
      });
  }
  
  function getCategoryEmoji(category) {
    fetch('/apps.json')
      .then(res => res.json())
      .then(data => {
        const appList = data[category];
        const app = appList.find(a => a.id === category);
        if (!app || !app.id) {
          alert("앱 경로를 찾을 수 없습니다.");
          return;
        }
        return `/icons/category_icon/${app.id}.img`;
      })
      .catch(() => {
        alert("앱 정보를 불러오는 데 실패했습니다.");
      });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search-input");
    const button = document.getElementById("search-button");
    button.addEventListener("click", handleSearch);
  });
  