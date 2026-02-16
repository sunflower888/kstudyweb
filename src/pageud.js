// 한 번만 생성
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

// ⬅️ DOM 재생성 ❌, 내용만 변경
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

// navArr (0, 1~10)
export function navArr(num) {
  const start = num * 10 + 1;
  const end = start + 9;
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

// 네비게이션
export function navContent(onchange) {
  let num = 0;

  const container = document.createElement("div");
  container.className = "nav-container";
  const current = document.createElement("div");
  current.className = "nav-current";
  const prevBtn = document.createElement("div");
  prevBtn.className = "nav-prevBtn";
  const nextBtn = document.createElement("div");
  nextBtn.className = "nav-nextBtn";

  current.textContent = num;
  prevBtn.textContent = "◀";
  nextBtn.textContent = "▶";

  function update() {
    current.textContent = num;
    onchange?.(num); // onchange 있으면 실행, 없으면 하지마라 // if(onchange){onchange(num);}랑 거의 동일
  }

  prevBtn.addEventListener("click", () => {
    if (num > 0) {
      num--;
      update();
    }
  });
  nextBtn.addEventListener("click", () => {
    num++;
    update();
  });

  container.append(prevBtn, current, nextBtn);

  return {
    element: container,
    setPage: (newNum) => {
      num = newNum;
      update();
    },
  };
}
