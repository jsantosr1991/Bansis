ALTER TABLE solicitudes_empleo
MODIFY COLUMN estado_solicitud enum('BORRADOR','PENDIENTE','EN_REVISION','APROBADO','RECHAZADO') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDIENTE',
MODIFY COLUMN company_id int DEFAULT NULL,
MODIFY COLUMN area varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
MODIFY COLUMN labor varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
MODIFY COLUMN fecha_ingreso date DEFAULT NULL,
MODIFY COLUMN usa_banco_guayaquil tinyint(1) DEFAULT NULL,
MODIFY COLUMN condiciones_transporte tinyint(1) DEFAULT NULL,
MODIFY COLUMN condiciones_vehiculo tinyint(1) DEFAULT NULL,
MODIFY COLUMN condiciones_licencia tinyint(1) DEFAULT NULL,
MODIFY COLUMN condiciones_acumulacion_decimos tinyint(1) DEFAULT NULL,
MODIFY COLUMN condiciones_semana_completa tinyint(1) DEFAULT NULL,
MODIFY COLUMN condiciones_solo_proceso tinyint(1) DEFAULT NULL,
MODIFY COLUMN condiciones_almuerzo tinyint(1) DEFAULT NULL,
MODIFY COLUMN fecha_nacimiento date DEFAULT NULL,
MODIFY COLUMN vacuna_covid_1 tinyint(1) DEFAULT NULL,
MODIFY COLUMN vacuna_covid_2 tinyint(1) DEFAULT NULL,
MODIFY COLUMN vacuna_covid_3 tinyint(1) DEFAULT NULL,
MODIFY COLUMN doc_cedula_cant int NOT NULL DEFAULT 0,
MODIFY COLUMN doc_certificado_votacion_cant int NOT NULL DEFAULT 0,
MODIFY COLUMN doc_libreta_militar_cant int NOT NULL DEFAULT 0,
MODIFY COLUMN doc_certificado_iess_cant int NOT NULL DEFAULT 0,
MODIFY COLUMN doc_certificado_laboral_cant int NOT NULL DEFAULT 0,
MODIFY COLUMN doc_fotos_cant int NOT NULL DEFAULT 0,
MODIFY COLUMN referencial_servicio_agua tinyint(1) DEFAULT NULL,
MODIFY COLUMN referencial_servicio_luz tinyint(1) DEFAULT NULL,
MODIFY COLUMN referencial_servicio_telefono tinyint(1) DEFAULT NULL,
MODIFY COLUMN estado_civil_demandas varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
MODIFY COLUMN estado_civil_compromisos_anteriores int DEFAULT NULL,
MODIFY COLUMN exp_sin_experiencia tinyint(1) DEFAULT NULL,
MODIFY COLUMN salud_operaciones tinyint(1) DEFAULT NULL,
MODIFY COLUMN salud_fracturas tinyint(1) DEFAULT NULL,
MODIFY COLUMN salud_quemaduras tinyint(1) DEFAULT NULL,
MODIFY COLUMN salud_accidentes_laborales tinyint(1) DEFAULT NULL,
MODIFY COLUMN fecha_entrevista datetime DEFAULT NULL,
MODIFY COLUMN aprobacion_fecha datetime DEFAULT NULL;

ALTER TABLE solicitudes_conyuges_anteriores
ADD COLUMN domicilio varchar(255) DEFAULT NULL,
ADD COLUMN ocupacion varchar(150) DEFAULT NULL,
ADD COLUMN edad int DEFAULT NULL,
ADD COLUMN genero varchar(20) DEFAULT NULL,
ADD COLUMN estado varchar(20) DEFAULT NULL,
MODIFY COLUMN nombre varchar(150) DEFAULT NULL;

ALTER TABLE solicitudes_cursos
ADD COLUMN duracion int DEFAULT NULL;

ALTER TABLE solicitudes_experiencias
ADD COLUMN area varchar(100) DEFAULT NULL,
ADD COLUMN jefe_inmediato varchar(150) DEFAULT NULL,
ADD COLUMN fecha_inicio date DEFAULT NULL,
ADD COLUMN fecha_fin date DEFAULT NULL;

ALTER TABLE solicitudes_familiares_empresa
ADD COLUMN area varchar(100) DEFAULT NULL;

ALTER TABLE solicitudes_hermanos
ADD COLUMN domicilio varchar(255) DEFAULT NULL,
ADD COLUMN edad int DEFAULT NULL;

ALTER TABLE solicitudes_hijos
ADD COLUMN discapacidad tinyint(1) NOT NULL DEFAULT '0',
ADD COLUMN descripcion_discapacidad varchar(255) DEFAULT NULL;

ALTER TABLE solicitudes_referencias_laborales
ADD COLUMN cargo varchar(150) DEFAULT NULL;

ALTER TABLE solicitudes_referencias_personales
ADD COLUMN empresa varchar(150) DEFAULT NULL,
ADD COLUMN cargo varchar(150) DEFAULT NULL;
