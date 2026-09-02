CAREDENT.initLayout("pacientes");
  CAREDENT.initTabs();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const p = CAREDENT.getPatientById(id);

  if (!p) {
    document.getElementById("notFound").style.display = "block";
  } else {
    document.getElementById("pacienteWrap").style.display = "block";

    const nombreCompleto = `${p.nombre} ${p.apellidos}`;
    document.getElementById("topTitle").textContent = nombreCompleto;
    document.title = `Caredent — ${nombreCompleto}`;

    document.getElementById("phAvatar").textContent = (p.nombre[0] + p.apellidos[0]).toUpperCase();
    document.getElementById("phNombre").textContent = nombreCompleto;
    document.getElementById("phRut").textContent = p.rut;
    document.getElementById("phTelefono").textContent = p.telefono;
    document.getElementById("phEstado").innerHTML = CAREDENT.estadoBadgeHTML(p.estado);

    const edad = calcularEdad(p.fechaNacimiento);
    document.getElementById("phEdad").textContent = edad ? `${edad} años` : "Edad no disponible";

    // Información
    document.getElementById("infoNombre").textContent = nombreCompleto;
    document.getElementById("infoRut").textContent = p.rut;
    document.getElementById("infoNacimiento").textContent = CAREDENT.formatDate(p.fechaNacimiento);
    document.getElementById("infoTelefono").textContent = p.telefono;
    document.getElementById("infoCorreo").textContent = p.correo;
    document.getElementById("infoDireccion").textContent = p.direccion || "—";
    document.getElementById("infoUltima").textContent = CAREDENT.formatDate(p.ultimaAtencion);
    document.getElementById("infoEstado").innerHTML = CAREDENT.estadoBadgeHTML(p.estado);

    // Ficha clínica
    document.getElementById("fichaGrupo").textContent = p.fichaClinica.grupoSanguineo;
    document.getElementById("fichaFecha").textContent = CAREDENT.formatDate(p.fichaClinica.fechaCreacion);
    document.getElementById("fichaObs").textContent = p.fichaClinica.observaciones;
    document.getElementById("fichaMedicos").textContent = p.antecedentes.medicos;
    document.getElementById("fichaOdonto").textContent = p.antecedentes.odontologicos;
    document.getElementById("fichaAlergias").textContent = p.antecedentes.alergias;

    // Diagnósticos
    const diagWrap = document.getElementById("listaDiagnosticos");
    diagWrap.innerHTML = p.diagnosticos.length
      ? p.diagnosticos.map(d => `
        <div class="record-card">
          <div class="record-card__head">
            <div class="record-card__title">${d.descripcion}</div>
            <div class="record-card__date">${CAREDENT.formatDate(d.fecha)}</div>
          </div>
          <div class="record-card__body">Registrado por ${d.profesional}.</div>
        </div>`).join("")
      : `<div class="empty-state">Aún no se han registrado diagnósticos para este paciente.</div>`;

    // Tratamientos
    const tratWrap = document.getElementById("listaTratamientos");
    tratWrap.innerHTML = p.tratamientos.length
      ? p.tratamientos.map(t => `
        <div class="record-card">
          <div class="record-card__head">
            <div class="record-card__title">${t.nombre} <span class="cell-sub">· ${t.id}</span></div>
            ${CAREDENT.estadoBadgeHTML(t.estado)}
          </div>
          <div class="record-card__body">${t.descripcion}<br><span class="cell-sub">Inicio: ${CAREDENT.formatDate(t.fechaInicio)} · Profesional: ${t.profesional}</span></div>
        </div>`).join("")
      : `<div class="empty-state">Aún no se han registrado tratamientos para este paciente.</div>`;

    // Atenciones
    const atenWrap = document.getElementById("listaAtenciones");
    atenWrap.innerHTML = p.atenciones.length
      ? p.atenciones.map(a => `
        <div class="record-card">
          <div class="record-card__head">
            <div class="record-card__title">${a.motivo}</div>
            <div class="record-card__date">${CAREDENT.formatDate(a.fecha)}</div>
          </div>
          <div class="record-card__body">${a.notas}<br><span class="cell-sub">Atendido por ${a.profesional}</span></div>
        </div>`).join("")
      : `<div class="empty-state">Aún no se han registrado atenciones para este paciente.</div>`;

    // Seguimiento — línea de tiempo
    const timelineWrap = document.getElementById("timelineSeguimiento");
    timelineWrap.innerHTML = p.seguimiento.length
      ? p.seguimiento.map(s => `
        <div class="timeline-item ${s.futuro ? "is-future" : ""}">
          <div class="timeline-item__date">${CAREDENT.formatDate(s.fecha)}${s.futuro ? " · Programado" : ""}</div>
          <div class="timeline-item__title">${s.titulo}</div>
          <div class="timeline-item__body">${s.descripcion}</div>
        </div>`).join("")
      : `<div class="empty-state">Sin evolución registrada todavía.</div>`;

    const proximoWrap = document.getElementById("cardProximoControl");
    if (p.proximoControl) {
      proximoWrap.innerHTML = `
        <div class="record-card__head">
          <div class="record-card__title">${p.proximoControl.motivo}</div>
          ${CAREDENT.estadoBadgeHTML(p.proximoControl.estado)}
        </div>
        <div class="record-card__body">Fecha programada: ${CAREDENT.formatDate(p.proximoControl.fecha)}</div>`;
    } else {
      proximoWrap.innerHTML = `<div class="text-muted">No hay un próximo control agendado para este paciente.</div>`;
    }
  }

  function calcularEdad(fechaISO) {
    if (!fechaISO) return null;
    const nacimiento = new Date(fechaISO);
    if (isNaN(nacimiento)) return null;
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  }
