// 필요한 데이터의 'no'값 배열 ------------------------------------------
export function navArr(num) {
  const start = num * 10 + 1;
  const end = start + 9;
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

// DOM 구조(한 번만 생성함) ----------------------------------------
export function createMain() {
  const container = document.createElement("div");
  container.className = "main-container";
  const rows = [];

  for (let i = 0; i < 10; i++) {
    const row = document.createElement("div");
    row.className = "row";
    const no = document.createElement("div");
    no.className = "no";
    const en = document.createElement("div");
    en.className = "en";
    const ko = document.createElement("div");
    ko.className = "ko";

    row.append(no, en, ko);
    container.appendChild(row);

    rows.push({ no, en, ko });
  }

  return { container, rows };
}

// 바뀐 데이터에 따라 텍스트 값만 변경함 [DOM 재생성 (X)]
export function updateMain(rows, data, showKo) {
  rows.forEach((row, i) => {
    const item = data[i];
    if (!item) {
      row.no.textContent = "";
      row.en.textContent = "";
      row.ko.textContent = "";
      return;
    }

    row.no.textContent = item.no;
    row.en.textContent = item.en;
    row.ko.textContent = item.ko;
    row.ko.classList.toggle("hide-text", !showKo);
  });
}

// 네비게이션
export function navContent(onchange) {
  let num = 0;
  let total = 0; // ⭐ 전체 페이지 수

  const container = document.createElement("div");
  container.className = "nav-container";
  const current = document.createElement("div");
  current.className = "nav-current";
  const totalEl = document.createElement("div"); // ⭐ 전체 페이지 표시
  totalEl.className = "nav-total";
  const prevBtn = document.createElement("div");
  prevBtn.className = "nav-prevBtn";
  const nextBtn = document.createElement("div");
  nextBtn.className = "nav-nextBtn";

  current.textContent = num;
  prevBtn.textContent = "◀";
  nextBtn.textContent = "▶";

  function update() {
    current.textContent = num;
    totalEl.textContent = total; // ⭐ 이 줄 필요
    onchange?.(num); // onchange 있으면 실행, 없으면 하지마라 // if(onchange){onchange(num);}랑 거의 동일
  }

  prevBtn.addEventListener("click", () => {
    if (num > 0) {
      num--;
      update();
    }
  });
  nextBtn.addEventListener("click", () => {
    if (num < total - 1) {
      // ⭐ 마지막 페이지 제한
      num++;
      update();
    }
  });

  container.append(prevBtn, current, totalEl, nextBtn);

  return {
    element: container,
    setPage: (newNum) => {
      num = newNum;
      update();
    },
    setTotal: (dataLength) => {
      // ⭐ 외부에서 전체 개수 설정
      total = Math.ceil(dataLength / 10);
      update();
    },
  };
}
