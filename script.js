const tbody = document.getElementById("tableBody");
let sortTimeout = null;

// CREATE 12 ROWS
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

// LIVE TOTAL UPDATE (NO SORT)
function updateTotalsOnly() {
    const rows = tbody.querySelectorAll("tr");

    rows.forEach(row => {
        const kill = +row.querySelector(".kill").value || 0;
        const pos = +row.querySelector(".pos").value || 0;

        // TOTAL = Kill + Position (Booyah excluded)
        row.querySelector(".total").innerText = kill + pos;
    });

    // Delay sorting until typing stops
    clearTimeout(sortTimeout);
    sortTimeout = setTimeout(sortAndRank, 300);
}

// SORT + RANK (SAFE, NO FOCUS LOSS)
function sortAndRank() {
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.forEach(row =>
        row.classList.remove("rank-1", "rank-2", "rank-3")
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

// LISTEN FOR INPUT (SMOOTH TYPING)
tbody.addEventListener("input", updateTotalsOnly);



// ==========================
// EXPORT AS PNG (DYNAMIC NAME)
// ==========================
function exportPNG() {
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
