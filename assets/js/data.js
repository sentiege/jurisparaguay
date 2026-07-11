/* =============================================
   JurisParaguay — Base de Datos de Códigos
   ============================================= */

const CATEGORIAS = [
  {
    id: 'civil-familia',
    nombre: 'Civil, Comercial y Familia',
    svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    color: '#1a3a5c',
    codigos: [
      {
        id: 'codigo-civil',
        nombre: 'Código Civil',
        ley: 'Ley N° 1183/85',
        descripcion: 'Regula los derechos de las personas, obligaciones, contratos, bienes, herencias y las bases de las relaciones familiares.',
        links: [
          { label: 'Texto Oficial (CONATEL)', url: 'https://www.conatel.gov.py/conatel/wp-content/uploads/2019/10/ley-1183_1985-cdigo-civil-paraguayo.pdf' },
          { label: 'Embajada del Paraguay', url: 'https://embapar.jp/archivos/codigo-civil-ley-1183-85/' }
        ],
        internalUrl: 'codigos/codigocivil/index.html'
      },
      {
        id: 'codigo-ninez',
        nombre: 'Código de la Niñez y la Adolescencia',
        ley: 'Ley N° 1680/01',
        descripcion: 'Establece la protección integral, los derechos y los deberes específicos de los menores de edad.',
        links: [
          { label: 'VLEX Paraguay', url: 'https://py.vlex.com/vid/ley-n-1-680-631747725' },
          { label: 'CEDUNA', url: 'https://ceduna.jimdofree.com/codigos-y-leyes/' }
        ],
        internalUrl: 'codigos/codigoninez/index.html'
      },
      {
        id: 'ley-1',
        nombre: 'Ley de Matrimonio Civil',
        ley: 'Ley N° 1/54',
        descripcion: 'Regula el matrimonio civil, sus requisitos, efectos, nulidades y el régimen de bienes entre cónyuges.',
        links: [],
        internalUrl: 'codigos/leyes/ley-1/index.html'
      },
      {
        id: 'ley-45',
        nombre: 'Ley de Adopciones',
        ley: 'Ley N° 45/91',
        descripcion: 'Establece el régimen legal de la adopción plena en el Paraguay, sus requisitos, procedimientos y efectos jurídicos.',
        links: [],
        internalUrl: 'codigos/leyes/ley-45/index.html'
      },
      {
        id: 'ley-861',
        nombre: 'Ley General de Bancos, Financieras y Otras Entidades de Crédito',
        ley: 'Ley N° 861/96',
        descripcion: 'Regula la organización, funcionamiento, supervisión y liquidación de las entidades del sistema financiero nacional.',
        links: [],
        internalUrl: 'codigos/leyes/ley-861/index.html'
      },
      {
        id: 'ley-1034',
        nombre: 'Ley del Comerciante',
        ley: 'Ley N° 1034/83',
        descripcion: 'Define al comerciante, regula los actos de comercio, los registros mercantiles y las obligaciones contables.',
        links: [],
        internalUrl: 'codigos/leyes/ley-1034/index.html'
      },
      {
        id: 'ley-1294',
        nombre: 'Ley de Marcas',
        ley: 'Ley N° 1294/98',
        descripcion: 'Protege los signos distintivos, marcas de productos y servicios, denominaciones de origen y la competencia desleal.',
        links: [],
        internalUrl: 'codigos/leyes/ley-1294/index.html'
      },
      {
        id: 'ley-1328',
        nombre: 'Ley de Derecho de Autor y Derechos Conexos',
        ley: 'Ley N° 1328/98',
        descripcion: 'Protege las obras literarias, artísticas y científicas, así como los derechos de artistas, productores y organismos de radiodifusión.',
        links: [],
        internalUrl: 'codigos/leyes/ley-1328/index.html'
      },
      {
        id: 'ley-4868',
        nombre: 'Ley de Comercio Electrónico',
        ley: 'Ley N° 4868/13',
        descripcion: 'Regula las transacciones comerciales realizadas por medios electrónicos, la firma digital y los documentos electrónicos.',
        links: [],
        internalUrl: 'codigos/leyes/ley-4868/index.html'
      },
      {
        id: 'ley-5542',
        nombre: 'Ley de Defensa del Consumidor y el Usuario',
        ley: 'Ley N° 5542/15',
        descripcion: 'Establece los derechos de los consumidores y usuarios, y las obligaciones de los proveedores de bienes y servicios.',
        links: [],
        internalUrl: 'codigos/leyes/ley-5542/index.html'
      },
      {
        id: 'ley-6480',
        nombre: 'Ley de Empresa por Acciones Simplificadas (EAS)',
        ley: 'Ley N° 6480/20',
        descripcion: 'Crea la figura de la Empresa por Acciones Simplificadas, un nuevo tipo societario de constitución ágil y digital.',
        links: [],
        internalUrl: 'codigos/leyes/ley-6480/index.html'
      }
    ]
  },
  {
    id: 'penal-ejecucion',
    nombre: 'Penal y Ejecución de Penas',
    svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    color: '#6b2020',
    codigos: [
      {
        id: 'codigo-penal',
        nombre: 'Código Penal',
        ley: 'Ley N° 1160/97',
        descripcion: 'Define los delitos, crímenes y las sanciones aplicables a los infractores en el territorio nacional.',
        links: [],
        internalUrl: 'codigos/codigopenal/index.html'
      },
      {
        id: 'codigo-ejecucion-penal',
        nombre: 'Código de Ejecución Penal',
        ley: 'Ley N° 5162/14',
        descripcion: 'Regula el cumplimiento de las penas y las condiciones de los reclusos en los centros penitenciarios.',
        links: [
          { label: 'BaseLegal.com.py', url: 'https://baselegal.com.py/' },
          { label: 'CEDUNA', url: 'https://ceduna.jimdofree.com/codigos-y-leyes/' }
        ],
        internalUrl: 'codigos/codigoejecucionpenal/index.html'
      },
      {
        id: 'ley-5659',
        nombre: 'Ley de Buen Trato y Protección contra el Castigo Físico',
        ley: 'Ley N° 5659/16',
        descripcion: 'Promueve la crianza positiva y prohíbe el castigo físico o cualquier tipo de violencia como método de corrección hacia niños, niñas y adolescentes.',
        links: [],
        internalUrl: 'codigos/leyes/ley-5659/index.html'
      }
    ]
  },
  {
    id: 'laboral',
    nombre: 'Derecho Laboral',
    svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>',
    color: '#1a5c3a',
    codigos: [
      {
        id: 'codigo-laboral',
        nombre: 'Código Laboral',
        ley: 'Ley N° 213/93',
        descripcion: 'Rige los derechos laborales mínimos, contratos de trabajo, salarios, descansos y la actividad sindical.',
        links: [
          { label: 'CEDUNA', url: 'https://ceduna.jimdofree.com/codigos-y-leyes/' }
        ],
        internalUrl: 'codigos/codigolaboral/index.html'
      }
    ]
  },
  {
    id: 'procesos',
    nombre: 'Procesos y Procedimientos',
    svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    color: '#3a1a5c',
    codigos: [
      {
        id: 'codigo-procesal-civil',
        nombre: 'Código Procesal Civil',
        ley: 'Ley N° 1337/88',
        descripcion: 'Dicta los pasos para tramitar demandas civiles, comerciales y de familia ante los juzgados.',
        links: [
          { label: 'Texto Oficial (Correo PY)', url: 'https://correoparaguayo.gov.py/sitio/wp-content/uploads/2023/09/Codigo-Procesal-Civil-1988.pdf' }
        ],
        internalUrl: 'codigos/codigoprocesalcivil/index.html'
      },
      {
        id: 'codigo-procesal-penal',
        nombre: 'Código Procesal Penal',
        ley: 'Ley N° 1286/98',
        descripcion: 'Modela la investigación fiscal y las etapas de los juicios de carácter penal.',
        links: [
          { label: 'BaseLegal.com.py', url: 'https://baselegal.com.py/' }
        ],
        internalUrl: 'codigos/codigoprocesalpenal/index.html'
      },
      {
        id: 'codigo-procesal-laboral',
        nombre: 'Código Procesal Laboral',
        ley: 'Ley N° 742/61',
        descripcion: 'Establece las normas de tramitación de los conflictos jurídicos entre empleadores y trabajadores.',
        links: [
          { label: 'CEDUNA', url: 'https://ceduna.jimdofree.com/codigos-y-leyes/' }
        ],
        internalUrl: 'codigos/codigoprocesallaboral/index.html'
      }
    ]
  },
  {
    id: 'institucional',
    nombre: 'Institucional y Electoral',
    svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',
    color: '#1a3a5c',
    codigos: [
      {
        id: 'codigo-organizacion-judicial',
        nombre: 'Código de Organización Judicial',
        ley: 'Ley N° 879/81',
        descripcion: 'Regula la estructura interna del Poder Judicial, las facultades de los jueces y el ejercicio de abogados y escribanos.',
        links: [
          { label: 'BaseLegal.com.py', url: 'https://baselegal.com.py/' }
        ],
        internalUrl: 'codigos/codigoorganizacionjudicial/index.html'
      },
      {
        id: 'codigo-electoral',
        nombre: 'Código Electoral',
        ley: 'Ley N° 834/96',
        descripcion: 'Organiza el sistema de votación, el funcionamiento de los partidos políticos y los procesos de elecciones públicas.',
        links: [
          { label: 'BaseLegal.com.py', url: 'https://baselegal.com.py/' }
        ],
        internalUrl: 'codigos/codigoelectoral/index.html'
      },
      {
        id: 'ley-1337',
        nombre: 'Ley Orgánica del Poder Ejecutivo',
        ley: 'Ley N° 1337/99',
        descripcion: 'Organiza la estructura del Poder Ejecutivo, los Ministerios, Secretarías y entidades del Estado central.',
        links: [],
        internalUrl: 'codigos/leyes/ley-1337/index.html'
      },
      {
        id: 'ley-1535',
        nombre: 'Ley de Administración Financiera del Estado',
        ley: 'Ley N° 1535/99',
        descripcion: 'Regula la administración de los recursos públicos, el presupuesto, la tesorería y el control de las finanzas del Estado.',
        links: [],
        internalUrl: 'codigos/leyes/ley-1535/index.html'
      },
      {
        id: 'ley-2051',
        nombre: 'Ley de Contrataciones Públicas',
        ley: 'Ley N° 2051/03',
        descripcion: 'Establece el régimen jurídico de las adquisiciones y contrataciones del Estado paraguayo y sus entidades.',
        links: [],
        internalUrl: 'codigos/leyes/ley-2051/index.html'
      },
      {
        id: 'ley-3966',
        nombre: 'Ley Orgánica Municipal',
        ley: 'Ley N° 3966/10',
        descripcion: 'Regula la organización, competencias, finanzas y funcionamiento de los gobiernos municipales del Paraguay.',
        links: [],
        internalUrl: 'codigos/leyes/ley-3966/index.html'
      },
      {
        id: 'ley-5074',
        nombre: 'Ley de Obras Públicas (Régimen Especial)',
        ley: 'Ley N° 5074/13',
        descripcion: 'Modifica y amplía el régimen de obras públicas, habilitando financiamientos especiales para infraestructura vial, portuaria y energética.',
        links: [],
        internalUrl: 'codigos/leyes/ley-5074/index.html'
      },
      {
        id: 'ley-7445',
        nombre: 'Ley de la Función Pública',
        ley: 'Ley N° 7445/24',
        descripcion: 'Regula el ingreso, permanencia, derechos, deberes, carrera y retiro de los funcionarios públicos del Estado paraguayo.',
        links: [],
        internalUrl: 'codigos/leyes/ley-7445/index.html'
      }
    ]
  },
  {
    id: 'navegacion-transporte',
    nombre: 'Navegación y Transporte Aéreo',
    svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 0117 2.18 2 2 0 0119 4v3"/><path d="M14 6l4-4 4 4M18 2v8"/></svg>',
    color: '#0a4a6a',
    codigos: [
      {
        id: 'codigo-navegacion',
        nombre: 'Código de Navegación Fluvial',
        ley: 'Ley N° 476/57',
        descripcion: 'Establece la legislación de las aguas interiores paraguayas, el tráfico fluvial, embarcaciones y la seguridad náutica.',
        links: [],
        internalUrl: 'codigos/codigonavegacion/index.html'
      },
      {
        id: 'codigo-aeronautico',
        nombre: 'Código Aeronáutico',
        ley: 'Ley N° 1860/02',
        descripcion: 'Regula las actividades de aviación civil, infraestructura aeroportuaria y el tránsito en el espacio aéreo nacional.',
        links: [
          { label: 'Paraguay Justia', url: 'https://paraguay.justia.com/nacionales/leyes/' }
        ],
        internalUrl: 'codigos/codigoaeronautico/index.html'
      }
    ]
  },
  {
    id: 'sectorial',
    nombre: 'Recursos Naturales y Comercio Exterior',
    svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3z"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
    color: '#2d5a1a',
    codigos: [
      {
        id: 'codigo-rural',
        nombre: 'Código Rural',
        ley: 'Ley N° 1248/31',
        descripcion: 'Rige los asuntos de la vida en el campo, el ganado, límites de propiedades rurales y la agricultura.',
        links: [],
        internalUrl: 'codigos/codigorural/index.html'
      },
      {
        id: 'codigo-aduanero',
        nombre: 'Código Aduanero',
        ley: 'Ley N° 2422/04',
        descripcion: 'Dicta las normas para la fiscalización, control del paso de mercancías por fronteras y el cobro de aranceles al comercio exterior.',
        links: [
          { label: 'BaseLegal.com.py', url: 'https://baselegal.com.py/' }
        ],
        internalUrl: 'codigos/codigoaduanero/index.html'
      },
      {
        id: 'codigo-mineria',
        nombre: 'Código de Minería',
        ley: 'Ley N° 3180/07',
        descripcion: 'Establece el marco jurídico para la exploración y explotación de los recursos minerales del suelo paraguayo.',
        links: [],
        internalUrl: 'codigos/codigomineria/index.html'
      },
      {
        id: 'codigo-sanitario',
        nombre: 'Código Sanitario',
        ley: 'Ley N° 836/80',
        descripcion: 'Fija los principios de la salud pública, control de enfermedades, alimentos, fármacos y la vigilancia médica nacional.',
        links: [],
        internalUrl: 'codigos/codigosanitario/index.html'
      },
      {
        id: 'ley-125',
        nombre: 'Ley Tributaria',
        ley: 'Ley N° 125/91',
        descripcion: 'Establece el régimen tributario general del Paraguay: impuesto a la renta, al valor agregado y tributos selectivos al consumo.',
        links: [],
        internalUrl: 'codigos/leyes/ley-125/index.html'
      },
      {
        id: 'ley-294',
        nombre: 'Ley de Evaluación de Impacto Ambiental',
        ley: 'Ley N° 294/93',
        descripcion: 'Establece la obligación de evaluación ambiental previa para obras y actividades susceptibles de afectar el ambiente.',
        links: [],
        internalUrl: 'codigos/leyes/ley-294/index.html'
      },
      {
        id: 'ley-1561',
        nombre: 'Ley del Sistema Nacional del Ambiente',
        ley: 'Ley N° 1561/00',
        descripcion: 'Crea el Sistema Nacional del Ambiente y el Consejo Nacional del Ambiente (CONAM) para la gestión ambiental del país.',
        links: [],
        internalUrl: 'codigos/leyes/ley-1561/index.html'
      },
      {
        id: 'ley-1863',
        nombre: 'Estatuto Agrario',
        ley: 'Ley N° 1863/02',
        descripcion: 'Regula el régimen de la tierra rural, la reforma agraria, el acceso a la tierra y las relaciones agrarias en el Paraguay.',
        links: [],
        internalUrl: 'codigos/leyes/ley-1863/index.html'
      },
      {
        id: 'ley-6380',
        nombre: 'Ley de Modernización y Simplificación Tributaria',
        ley: 'Ley N° 6380/19',
        descripcion: 'Moderniza el sistema tributario paraguayo: IRE, IVA, IRP y renta del capital, sustituyendo parcialmente la Ley 125/91.',
        links: [],
        internalUrl: 'codigos/leyes/ley-6380/index.html'
      }
    ]
  },
  {
    id: 'constitucional',
    nombre: 'Fundamento Constitucional',
    svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    color: '#7a1a1a',
    codigos: [
      {
        id: 'constitucion-nacional',
        nombre: 'Constitución Nacional',
        ley: '20 de junio de 1992',
        descripcion: 'Ley suprema de la República del Paraguay. Establece la organización del Estado, los derechos y garantías fundamentales de todas las personas.',
        links: [
          { label: 'Texto Oficial (CSJ)', url: 'https://www.csj.gov.py/textos/constitucion.pdf' },
          { label: 'OEA', url: 'https://www.oas.org/juridico/spanish/par_res3.htm' }
        ],
        internalUrl: 'codigos/constitucion/index.html'
      }
    ]
  },
  {
    id: 'leyes-interes',
    nombre: 'Leyes de Interés',
    svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    color: '#7a3a1a',
    codigos: [
      {
        id: 'ley-5777',
        nombre: 'Ley Integral de Protección de las Mujeres',
        ley: 'Ley N° 5777/16',
        descripcion: 'Establece la protección integral de las mujeres contra toda forma de violencia, incluyendo el femicidio, violencia doméstica y acoso.',
        links: [],
        internalUrl: 'codigos/leyes/ley-5777/index.html'
      }
    ]
  }
];
