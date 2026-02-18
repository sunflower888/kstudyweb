import { createMain, updateMain, navArr, navContent } from "./sub.js";

const dataCache = {};
let currentData = [];
let navNum = 0;
let showKo = true;

const dataMap = {
  1: "./file/words_basic.json",
  2: "./file/owords_1.json",
  3: "./file/owords_2.json",
};

// 데이터 캐싱 ---------------------------------------------------------
async function getData(key) {
  if (dataCache[key]) {
    return dataCache[key];
  }

  const path = dataMap[key];
  if (!path) return null;

  const res = await fetch(path);
  if (!res.ok) throw new Error("JSON 로드 실패");

  const data = await res.json();
  dataCache[key] = data; // 캐싱: 가져온 거 또 쓰려고 잠깐 저장해 둠
  return data;
}

// DOM 구조(한 번만 생성함) ----------------------------------------
const { container: main, rows } = createMain();
document.body.appendChild(main);

// 체크박스 -------------------------------------------------------
const check = document.createElement("input");
check.className = "check";
check.type = "checkbox";
check.checked = true;
document.body.appendChild(check);

check.addEventListener("change", () => {
  showKo = check.checked;
  render();
});

// 다크모드(체크박스) -----------------------------------------------
const darkMode = document.createElement("input");
darkMode.type = "checkbox";
darkMode.className = "darkMode";
document.body.appendChild(darkMode);

darkMode.addEventListener("change", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", darkMode.checked ? "dark" : "light");
});

// 저장된 테마 적용
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
  darkMode.checked = true;
}

// 종류 ------------------------------------------------------------------
const dataInput = document.createElement("input");
dataInput.type = "text";
dataInput.placeholder = "종류";
dataInput.className = "dataInput";
document.body.appendChild(dataInput);

const loadBtn = document.createElement("button");
loadBtn.textContent = "확인";
loadBtn.className = "loadBtn";
document.body.appendChild(loadBtn);

loadBtn.addEventListener("click", async () => {
  const key = dataInput.value.trim();
  const data = await getData(key);

  if (!data) {
    alert("잘못된 번호입니다. 1, 2 중 하나를 입력하세요.");
    return;
  }

  currentData = data;
  navNum = 0;
  counter.setPage(0); // 네비게이션 숫자도 0으로 초기화
  render();
});

// 메인 데이터 --------------------------------------------------------------------------------------------------------
function mainData(num) {
  const nums = navArr(num);
  return currentData.filter((item) => nums.includes(Number(item.no)));
}

// 렌더 --------------------------------------------------
function render() {
  const data = mainData(navNum);
  updateMain(rows, data, showKo);
}

// 네비게이션 ------------------------------------------------
const counter = navContent((num) => {
  navNum = num;
  render();
});

document.body.appendChild(counter.element);

// ------------------ 네비게이션 직접 이동 ------------------
const navInput = document.createElement("input");
navInput.type = "number";
navInput.placeholder = "페이지";
navInput.className = "navInput";
document.body.appendChild(navInput);

const goBtn = document.createElement("button");
goBtn.textContent = "확인";
goBtn.className = "goBtn";
document.body.appendChild(goBtn);

goBtn.addEventListener("click", () => {
  const pageNum = Number(navInput.value.trim());
  if (!isNaN(pageNum)) {
    navNum = pageNum;
    counter.setPage(pageNum);
    render();
  } else {
    alert("올바른 숫자를 입력하세요.");
  }
});

// ================== ⭐ 초기 데이터 1번만 로드 ==================
(async function init() {
  currentData = await getData(1); // 기본 데이터
  render();
})();

