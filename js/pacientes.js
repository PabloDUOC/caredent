CAREDENT.initLayout("pacientes");

  let pacientes = CAREDENT.getPatients();
  let filtroTexto = "";
  let filtroEstado = "todos";

  function render() {
    const tbody = document.getElementById("tablaPacientes");
    const texto = filtroTexto.trim().toLowerCase();

    const filtrados = pacientes.filter((p) => {
      const coincideTexto =
        !texto ||
        `${p.nombre} ${p.apellidos}`.toLowerCase().includes(texto) ||
        p.rut.toLowerCase().includes(texto);
      const coincideEstado = filtroEstado === "todos" || p.estado === filtroEstado;
      return coincideTexto && coincideEstado;
    });

    if (!filtrados.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No se encontraron pacientes con ese criterio de búsqueda.</div></td></tr>`;
      return;
    }

    tbody.innerHTML = filtrados
      .map(
        (p) => `
      <tr>
        <td class="cell-name">${p.nombre} ${p.apellidos}</td>
        <td>${p.rut}</td>
        <td>${CAREDENT.formatDate(p.ultimaAtencion)}</td>
        <td>${CAREDENT.estadoBadgeHTML(p.estado)}</td>
        <td style="text-align:right">
          <a class="btn btn--ghost btn--sm" href="paciente.html?id=${p.id}">Ver paciente</a>
        </td>
      </tr>`
      )
      .join("");
  }

  document.getElementById("buscador").addEventListener("input", (e) => {
    filtroTexto = e.target.value;
    render();
  });

  document.getElementById("filtros").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filtroEstado = chip.dataset.estado;
    document.querySelectorAll("#filtros .chip").forEach((c) => c.classList.toggle("is-active", c === chip));
    render();
  });

  render();
