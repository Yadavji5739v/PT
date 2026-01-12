const tbody = document.getElementById("tableBody");

// ============================
// CREATE 12 ROWS
// ============================
for (let i = 1; i <= 12; i++) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${i}</td>
        <td><input class="team" placeholder="Team ${i}"></td>
        <td><input type="number" class="booyah" value="0"></td>
        <td><input type="number" class="kill" value="0"></td>
        <td><input type="number" class="pos" value="0"></td>
        <td class="total">0</td>
    `;

    tbody.appendChild(row);
}

// ============================
// LIVE TOTAL CALCULATION ONLY
// (NO SORTING HERE)
// ============================
function updateTotals(row) {
    const kill = +row.querySelector(".kill").value || 0;
    const pos  = +row.querySelector(".pos").value || 0;

    // TOTAL = Kill + Position
    row.querySelector(".total").innerText = kill + pos;
}

// ============================
// SORT + RANK (SAFE)
// ============================
function sortAndRank() {
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.forEach(r =>
        r.classList.remove("rank-1", "rank-2", "rank-3")
    );

    rows.sort((a, b) =>
        b.querySelector(".total").innerText -
        a.querySelector(".total").innerText
    );

    rows.forEach((row, index) => {
        row.children[0].innerText = index + 1;
        tbody.appendChild(row);

        if (index === 0) row.classList.add("rank-1");
        if (index === 1) row.classList.add("rank-2");
        if (index === 2) row.classList.add("rank-3");
    });
}

// ============================
// EVENT HANDLING (KEY FIX)
// ============================
tbody.addEventListener("input", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;

    // ONLY update total, DO NOT SORT
    updateTotals(row);
});

// Sort ONLY when user finishes editing (blur)
tbody.addEventListener("focusout", (e) => {
    if (e.target.matches(".kill, .pos")) {
        sortAndRank();
    }
});

// ============================
// EXPORT AS PNG (GROUP NAME)
// ============================
function exportPNG() {
    sortAndRank(); // ensure final ranking before export

    const poster = document.querySelector(".poster");
    const groupInput = document.getElementById("groupNumber");
    const groupNumber = groupInput ? groupInput.value : "Unknown";

    html2canvas(poster, {
        scale: 3,
        useCORS: true,
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = `Group-${groupNumber}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}
