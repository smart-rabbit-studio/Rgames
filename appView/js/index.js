

function scrollApps(id, direction) {
  const scrollContainer = document.getElementById(id); // 실제 스크롤 되는 요소
  if (!scrollContainer) return;

  const scrollAmount = scrollContainer.offsetWidth * 0.6;
  console.log(`[scrollApps] id=${id}, scrollLeft=${scrollContainer.scrollLeft}, scrollBy=${scrollAmount * direction}`);
  
  scrollContainer.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

function scrollToCategory(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// 전역 해시맵
const appMap = {};

// 앱 데이터 로딩
fetch('/apps.json')
  .then(res => res.json())
  .then(data => {
    for (const category in data) {
      data[category].forEach(app => {
        appMap[app.name.toLowerCase()] = {
          category: app.id,
          name: app.name
        };
      });
    }
    console.log("앱 데이터 로드됨", appMap);
  })
  .catch(err => {
    console.error("앱 데이터 로드 실패:", err);
  });

// 검색 처리 함수
function handleSearch() {
  const input = document.getElementById("search-input");
  const query = input.value.trim().toLowerCase();

  if (!query || !appMap[query]) {
    alert("앱을 찾을 수 없습니다.");
    return;
  }

  const { category, name } = appMap[query];

  // 상하 스크롤
  scrollToCategory(`category-${category}`);

  // 좌우 스크롤은 살짝 지연 (카테고리 이동 후)
  setTimeout(() => {
    scrollToApp(`${category}`, name);
  }, 400);
}

// 카테고리 영역으로 스크롤
function scrollToCategory(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// 앱 카드까지 좌우 스크롤 후 강조 효과
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
  const encodedApp = encodeURIComponent(appName);
  location.href = `/html/category/${category}.html?app=${encodedApp}`;
}

// 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");

  button.addEventListener("click", handleSearch);
  // input.addEventListener("keydown", e => {
  //   if (e.key === "Enter") handleSearch();
  // })
});