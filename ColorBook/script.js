const animals = [
  { letter: "أ", name: "أسد" }, { letter: "ب", name: "بقره" }, { letter: "ت", name: "تمساح" },
  { letter: "ث", name: "ثور" }, { letter: "ج", name: "جمل" }, { letter: "ح", name: "حصان" },
  { letter: "خ", name: "خروف" }, { letter: "د", name: "ديك" }, { letter: "ذ", name: "ذئب" },
  { letter: "ر", name: "راكون" }, { letter: "ز", name: "زرافه" }, { letter: "س", name: "سلحفاه" },
  { letter: "ش", name: "شبل" }, { letter: "ص", name: "صقر" }, { letter: "ض", name: "ضفدع" },
  { letter: "ط", name: "طاوس" }, { letter: "ظ", name: "ظبي" }, { letter: "ع", name: "عنكبوت" },
  { letter: "غ", name: "غراب" }, { letter: "ف", name: "فار" }, { letter: "ق", name: "قرد" },
  { letter: "ك", name: "كلب" }, { letter: "ل", name: "لاما" }, { letter: "م", name: "ماعز" },
  { letter: "ن", name: "نحله" }, { letter: "هـ", name: "هره" }, { letter: "و", name: "وحيد القرن" },
  { letter: "ي", name: "يمامه" }
];

const container = document.getElementById("book-container");

animals.forEach(animal => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${animal.letter}</h2>
    <canvas width="180" height="180"></canvas>
    <p>${animal.name}</p>
    <div class="tools">
      <label>🎨 اللون: <input type="color" class="color-picker" value="#000000"></label>
      <label>✏️ الحجم: <input type="range" class="brush-size" min="1" max="20" value="3"></label>
    </div>
    <button class="clear-btn">مسح</button>
  `;
  container.appendChild(card);

  const canvas = card.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const colorPicker = card.querySelector(".color-picker");
  const brushSize = card.querySelector(".brush-size");
  const clearBtn = card.querySelector(".clear-btn");

  const img = new Image();
  img.src = `images/${animal.name}.png`;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  let painting = false;

  function startPosition(x, y) {
    painting = true;
    draw(x, y);
  }

  function endPosition() {
    painting = false;
    ctx.beginPath();
  }

  function draw(x, y) {
    if (!painting) return;
    ctx.lineWidth = brushSize.value;
    ctx.strokeStyle = colorPicker.value;
    ctx.lineCap = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  // Mouse events
  canvas.addEventListener("mousedown", e => {
    const rect = canvas.getBoundingClientRect();
    startPosition(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    draw(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.addEventListener("mouseup", endPosition);
  canvas.addEventListener("mouseleave", endPosition);

  // Touch events with prevention of default scrolling and zooming
  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    startPosition(touch.clientX - rect.left, touch.clientY - rect.top);
  }, { passive: false });

  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    draw(touch.clientX - rect.left, touch.clientY - rect.top);
  }, { passive: false });

  canvas.addEventListener("touchend", e => {
    e.preventDefault();
    endPosition();
  }, { passive: false });

  clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  });
});

const toggleThemeBtn = document.getElementById("toggle-theme");
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
