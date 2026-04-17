-- Script de Creación de Base de Datos para Ficha de Solicitud de Empleo

CREATE DATABASE IF NOT EXISTS bansis_rrhh;
USE bansis_rrhh;

-- 1. TABLA PRINCIPAL: solicitudes_empleo
CREATE TABLE IF NOT EXISTS solicitudes_empleo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_solicitud VARCHAR(50) UNIQUE, -- ID generado o UID
    estado_solicitud ENUM('PENDIENTE', 'EN_EVALUACION', 'APROBADO', 'RECHAZADO') DEFAULT 'PENDIENTE',

    -- SECCIÓN 1: DATOS ADMINISTRATIVOS
    company_id INT NOT NULL,
    area VARCHAR(100) NOT NULL, -- Campo, Empacadora, Administración
    labor VARCHAR(100) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    
    -- Info Bancaria
    usa_banco_guayaquil BOOLEAN DEFAULT FALSE,
    banco_numero_cuenta VARCHAR(20),
    banco_tipo_cuenta VARCHAR(20),
    banco_titular VARCHAR(120),
    
    -- Fechas de Control
    fecha_revision_guayaquil DATE,
    reingreso_fecha DATE,
    fecha_salida DATE,
    
    -- Condiciones
    condiciones_tipo_contrato VARCHAR(80),
    condiciones_transporte BOOLEAN DEFAULT FALSE,
    condiciones_recorrido VARCHAR(100),
    condiciones_recorrido_otro VARCHAR(100),
    condiciones_vehiculo BOOLEAN DEFAULT FALSE,
    condiciones_licencia BOOLEAN DEFAULT FALSE,
    condiciones_licencia_tipo VARCHAR(10),
    condiciones_acumulacion_decimos BOOLEAN DEFAULT FALSE,
    condiciones_semana_completa BOOLEAN DEFAULT FALSE,
    condiciones_solo_proceso BOOLEAN DEFAULT FALSE,
    condiciones_almuerzo BOOLEAN DEFAULT FALSE,
    
    -- Control Interno
    responsable_id INT,
    responsable_nombre VARCHAR(100),
    responsable_grupo VARCHAR(100),
    fecha_entrevista DATE,

    -- SECCIÓN 2: DATOS PERSONALES
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apodo VARCHAR(50),
    pais_nacimiento VARCHAR(100),
    pais_nacimiento_otro VARCHAR(100),
    provincia_nacimiento VARCHAR(100),
    provincia_nacimiento_otro VARCHAR(100),
    fecha_nacimiento DATE NOT NULL,
    edad INT,
    tipo_sangre VARCHAR(10),
    estatura DECIMAL(4,2),
    peso DECIMAL(5,2),
    religion VARCHAR(100),
    correo VARCHAR(150),
    vacuna_covid_1 BOOLEAN DEFAULT FALSE,
    vacuna_covid_2 BOOLEAN DEFAULT FALSE,
    vacuna_covid_3 BOOLEAN DEFAULT FALSE,
    afiliado_iess VARCHAR(10),

    -- SECCIÓN 3: DOCUMENTACIÓN (Cantidades)
    doc_cedula_cant INT DEFAULT 0,
    doc_certificado_votacion_cant INT DEFAULT 0,
    doc_libreta_militar_cant INT DEFAULT 0,
    doc_certificado_iess_cant INT DEFAULT 0,
    doc_certificado_laboral_cant INT DEFAULT 0,
    doc_fotos_cant INT DEFAULT 0,

    -- SECCIÓN 4: DATOS REFERENCIALES
    referencial_direccion VARCHAR(255),
    referencial_ciudad VARCHAR(100),
    referencial_telefono_principal VARCHAR(20),
    referencial_telefono_secundario VARCHAR(20),
    referencial_vivienda_material VARCHAR(100),
    referencial_vivienda_condicion VARCHAR(100),
    referencial_cantidad_familiares INT DEFAULT 0,
    referencial_familiares_relacion VARCHAR(255),
    referencial_telefono_emergencia VARCHAR(20),
    referencial_nombre_contacto_emergencia VARCHAR(150),
    referencial_servicio_agua BOOLEAN DEFAULT FALSE,
    referencial_servicio_luz BOOLEAN DEFAULT FALSE,
    referencial_servicio_telefono BOOLEAN DEFAULT FALSE,

    -- SECCIÓN 5: ESTADO CIVIL
    estado_civil VARCHAR(50),
    estado_civil_tiempo_valor INT,
    estado_civil_tiempo_unidad VARCHAR(20),
    estado_civil_tipo_matrimonio VARCHAR(50),
    estado_civil_demandas VARCHAR(10),
    estado_civil_compromisos_anteriores INT DEFAULT 0,

    -- SECCIÓN 6: DATOS FAMILIARES PRINCIPALES
    padre_nombre VARCHAR(150),
    padre_estado VARCHAR(20),
    padre_edad INT,
    padre_domicilio VARCHAR(255),
    padre_ocupacion VARCHAR(150),
    
    madre_nombre VARCHAR(150),
    madre_estado VARCHAR(20),
    madre_edad INT,
    madre_domicilio VARCHAR(255),
    madre_ocupacion VARCHAR(150),
    
    conyuge_nombre VARCHAR(150),
    conyuge_estado VARCHAR(20),
    conyuge_edad INT,
    conyuge_domicilio VARCHAR(255),
    conyuge_ocupacion VARCHAR(150),

    -- SECCIÓN 7: DATOS EDUCATIVOS
    edu_nivel_maximo VARCHAR(100),
    edu_inicial_institucion VARCHAR(150),
    edu_inicial_anio INT,
    edu_basica_institucion VARCHAR(150),
    edu_basica_grado VARCHAR(100),
    edu_basica_anio INT,
    edu_bachillerato_institucion VARCHAR(150),
    edu_bachillerato_titulo VARCHAR(150),
    edu_bachillerato_anio INT,
    edu_superior_institucion VARCHAR(150),
    edu_superior_tipo VARCHAR(50), -- Grado/Posgrado
    edu_superior_nivel VARCHAR(100),
    edu_superior_carrera VARCHAR(150),
    edu_superior_estado VARCHAR(50),
    edu_superior_anio INT,

    -- SECCIÓN 9: EXPERIENCIA LABORAL HEADER
    exp_sin_experiencia BOOLEAN DEFAULT FALSE,
    exp_descripcion_labores TEXT,

    -- SECCIÓN 11: SALUD PERSONAL
    salud_operaciones BOOLEAN DEFAULT FALSE,
    salud_operaciones_detalle TEXT,
    salud_fracturas BOOLEAN DEFAULT FALSE,
    salud_fracturas_detalle TEXT,
    salud_quemaduras BOOLEAN DEFAULT FALSE,
    salud_quemaduras_detalle TEXT,
    salud_accidentes_laborales BOOLEAN DEFAULT FALSE,
    salud_accidentes_laborales_detalle TEXT,
    salud_otros_antecedentes TEXT,
    salud_deporte VARCHAR(255),
    salud_actividad_social VARCHAR(255),

    -- SECCIÓN 13: APROBACIÓN FINAL
    aprobado_por VARCHAR(100),
    aprobacion_grupo VARCHAR(100),
    aprobacion_fecha DATE,

    -- AUDITORÍA
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. TABLAS RELACIONADAS (Uno a Muchos)

CREATE TABLE IF NOT EXISTS solicitudes_hermanos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    nombre VARCHAR(150),
    genero VARCHAR(20),
    estado VARCHAR(20),
    ocupacion VARCHAR(150),
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_empleo(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS solicitudes_hijos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    nombre VARCHAR(150),
    genero VARCHAR(20),
    estado VARCHAR(20),
    edad INT,
    ocupacion VARCHAR(150),
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_empleo(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS solicitudes_conyuges_anteriores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    nombre VARCHAR(150),
    causa_separacion VARCHAR(255),
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_empleo(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS solicitudes_cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    institucion VARCHAR(150),
    nombre_curso VARCHAR(150),
    anio INT,
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_empleo(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS solicitudes_experiencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    empresa VARCHAR(150),
    cargo VARCHAR(100),
    tiempo VARCHAR(50),
    causa_salida VARCHAR(255),
    sueldo_ultima_remun DECIMAL(10,2),
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_empleo(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS solicitudes_referencias_laborales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    empresa VARCHAR(150),
    contacto_nombre VARCHAR(150),
    telefono VARCHAR(20),
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_empleo(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS solicitudes_referencias_personales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    nombre VARCHAR(150),
    telefono VARCHAR(20),
    ocupacion VARCHAR(150),
    tiempo_conocerse VARCHAR(50),
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_empleo(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS solicitudes_familiares_empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    nombre VARCHAR(150),
    empresa VARCHAR(100),
    cargo VARCHAR(100),
    parentesco VARCHAR(50),
    telefono VARCHAR(20),
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_empleo(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS solicitudes_observaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    tipo VARCHAR(50), -- RRHH, Administración, etc.
    comentario TEXT,
    usuario_nombre VARCHAR(100),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_empleo(id) ON DELETE CASCADE
);
