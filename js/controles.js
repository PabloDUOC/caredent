CAREDENT.initLayout("controles");

  const pacientes = CAREDENT.getPatients();
  const controles = pacientes
    .filter((p) => p.proximoControl)
    .map((p) => ({ paciente: p, ...p.proximoControl }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  let filtroEstado = "todos";

  function render() {
    const tbody = document.getElementById("tablaControles");
    const filtrados = controles.filter((c) => filtroEstado === "todos" || c.estado === filtroEstado);

    if (!filtrados.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No hay controles que coincidan con este filtro.</div></td></tr>`;
      return;
    }

    tbody.innerHTML = filtrados
      .map(
        (c) => `
      <tr>
        <td class="cell-name">${c.paciente.nombre} ${c.paciente.apellidos}</td>
        <td>${CAREDENT.formatDate(c.fecha)}</td>
        <td>${c.motivo}</td>
        <td>${CAREDENT.estadoBadgeHTML(c.estado)}</td>
        <td style="text-align:right">
          <a class="btn btn--ghost btn--sm" href="paciente.html?id=${c.paciente.id}">Consultar paciente</a>
        </td>
      </tr>`
      )
      .join("");
  }

  document.getElementById("filtros").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filtroEstado = chip.dataset.estado;
    document.querySelectorAll("#filtros .chip").forEach((c) => c.classList.toggle("is-active", c === chip));
    render();
  });

  render();
