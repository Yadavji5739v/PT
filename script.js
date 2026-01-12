const tbody = document.getElementById("tableBody");

// Create 12 rows
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

// AUTO CALCULATION FUNCTION
function autoCalculate() {
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.forEach(row => {
        const kill = +row.querySelector(".kill").value || 0;
        const pos = +row.querySelector(".pos").value || 0;

        // TOTAL = Kill + Position (Booyah excluded)
        row.querySelector(".total").innerText = kill + pos;

        row.classList.remove("rank-1", "rank-2", "rank-3");
    });

    // Sort by total points
    rows.sort((a, b) =>
        b.querySelector(".total").innerText -
        a.querySelector(".total").innerText
    );

    // Re-append & rank
    rows.forEach((row, index) => {
        row.children[0].innerText = index + 1;
        tbody.appendChild(row);

        if (index === 0) row.classList.add("rank-1");
        if (index === 1) row.classList.add("rank-2");
        if (index === 2) row.classList.add("rank-3");
    });
}

// LISTEN TO INPUT CHANGES (AUTO)
tbody.addEventListener("input", autoCalculate);

// EXPORT AS PNG
function exportPNG() {
    const poster = document.querySelector(".poster");

    html2canvas(poster, {
        scale: 3,
        useCORS: true,
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "group-standings.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}
