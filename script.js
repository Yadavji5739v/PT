const tbody = document.getElementById("tableBody");

// ============================
// CREATE 12 ROWS
// ============================
for (let i = 1; i <= 12; i++) {
    const row = document.createElement("tr");
    row.dataset.index = i; // for stable sorting

    row.innerHTML = `
        <td>${i}</td>
        <td><input class="team" placeholder="Team ${i}"></td>
        <td><input type="number" class="booyah" min="0" max="50" value="0"></td>
        <td><input type="number" class="kill" min="0" max="999" value="0"></td>
        <td><input type="number" class="pos" min="0" max="999" value="0"></td>
        <td class="total">0</td>
    `;

    tbody.appendChild(row);
}

// ============================
// LIVE TOTAL CALCULATION ONLY
// (NO SORTING HERE)
// ============================
function updateTotals(row) {
    let killInput = row.querySelector(".kill");
    let posInput  = row.querySelector(".pos");

    // Clamp values between 0 and 999
    let kill = Math.max(0, Math.min(999, parseInt(killInput.value) || 0));
    let pos  = Math.max(0, Math.min(999, parseInt(posInput.value) || 0));

    killInput.value = kill;
    posInput.value = pos;

    // TOTAL = Kill + Position (Booyah excluded)
    row.querySelector(".total").innerText = kill + pos;
}

// ============================
// SORT + RANK (TOTAL BASED ONLY)
// ============================
function sortAndRank() {
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.forEach(r =>
        r.classList.remove("rank-1", "rank-2", "rank-3")
    );

    rows.sort((a, b) => {
        const totalDiff =
            b.querySelector(".total").innerText -
            a.querySelector(".total").innerText;

        if (totalDiff !== 0) return totalDiff;

        // Stable sort for equal points
        return a.dataset.index - b.dataset.index;
    });

    rows.forEach((row, index) => {
        row.children[0].innerText = index + 1;
        tbody.appendChild(row);

        if (index === 0) row.classList.add("rank-1");
        if (index === 1) row.classList.add("rank-2");
        if (index === 2) row.classList.add("rank-3");
    });
}

// ============================
// EVENT HANDLING (SMOOTH INPUT)
// ============================
tbody.addEventListener("input", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;

    if (e.target.matches(".kill, .pos")) {
        updateTotals(row);
    }
});

// Sort ONLY after user finishes editing
tbody.addEventListener("focusout", (e) => {
    if (e.target.matches(".kill, .pos")) {
        sortAndRank();
    }
});

// ============================
// EXPORT AS PNG (GROUP NUMBER)
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
