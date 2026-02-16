import wordData1 from "../file/words_basic.json" assert { type: "json" };
import wordData2 from "../file/owords_1.json" assert { type: "json" };
import wordData3 from "../file/owords_2.json" assert { type: "json" };
import { createMain, updateMain, navArr, navContent } from "./pageud.js";

let navNum = 0;
let showKo = true;

// ------------------ allData 객체 ------------------
const allData = {
  1: wordData1,
  2: wordData2,
  3: wordData3,
};

// 현재 사용하는 데이터
let currentData = wordData1; // 기본값

// 한 번만 생성
const { container: main, rows } = createMain(); // 구조분해할당
document.body.appendChild(main);

// 체크박스 -------------------------------------------------------
const check = document.createElement("input");
check.className = "check";
check.type = "checkbox";
check.checked = true;
document.body.appendChild(check);

// 체크박스 이벤트
check.addEventListener("change", () => {
  showKo = check.checked;
  render();
});

// 다크모드 체크박스 -----------------------------------------------
const darkMode = document.createElement("input");
darkMode.type = "checkbox";
darkMode.className = "darkMode";
document.body.appendChild(darkMode);

darkMode.addEventListener("change", () => {
  document.documentElement.classList.toggle("dark");

  if (darkMode.checked) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// 저장된 테마 적용
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
  darkMode.checked = true;
}

// ------------------ JSON 선택 input ------------------
const dataInput = document.createElement("input");
dataInput.type = "text";
dataInput.placeholder = "종류";
dataInput.className = "dataInput";
document.body.appendChild(dataInput);

const loadBtn = document.createElement("button");
loadBtn.textContent = "확인";
loadBtn.className = "loadBtn";
document.body.appendChild(loadBtn);

loadBtn.addEventListener("click", () => {
  const key = dataInput.value.trim(); // trim: 공백제거
  if (allData[key]) {
    currentData = allData[key];
    navNum = 0; // 페이지 초기화
    render();
  } else {
    alert("잘못된 번호입니다. 1, 2, 3 중 하나를 입력하세요.");
  }
});

// 페이지 데이터 계산 (10개만)
function mainData(num) {
  const nums = navArr(num);
  return currentData.filter((item) => nums.includes(Number(item.no)));
}

// 렌더 (DOM 재생성 (X), 내용만 변경)
function render() {
  const data = mainData(navNum);

  // updateMain(main, data, showKo);
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
    counter.setPage(pageNum); // 여기서 navContent 내부 상태와 동기화
    render();
  } else {
    alert("올바른 숫자를 입력하세요.");
  }
});

// ------------------ 초기 렌더 ------------------
render();

