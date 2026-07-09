/* =============================================
   JurisParaguay — Base de Datos de Códigos
   ============================================= */

const CATEGORIAS = [
  {
    id: 'civil-familia',
    nombre: 'Códigos Civiles, Comerciales y de Familia',
    icono: '🏗️',
    color: '#1a3a5c',
    codigos: [
      {
        id: 'codigo-civil',
        nombre: 'Código Civil',
        ley: 'Ley N° 1183/85',
        descripcion: 'Regula los derechos de las personas, obligaciones, contratos, bienes, herencias y las bases de las relaciones familiares.',
        links: [
          { label: '📄 Texto Oficial (CONATEL)', url: 'https://www.conatel.gov.py/conatel/wp-content/uploads/2019/10/ley-1183_1985-cdigo-civil-paraguayo.pdf' },
          { label: '🔗 Embajada del Paraguay', url: 'https://embapar.jp/archivos/codigo-civil-ley-1183-85/' }
        ],
        internalUrl: 'codigos/codigocivil/index.html'
      },
      {
        id: 'codigo-ninez',
        nombre: 'Código de la Niñez y la Adolescencia',
        ley: 'Ley N° 1680/01',
        descripcion: 'Establece la protección integral, los derechos y los deberes específicos de los menores de edad.',
        links: [
          { label: '🔗 VLEX Paraguay', url: 'https://py.vlex.com/vid/ley-n-1-680-631747725' },
          { label: '📚 CEDUNA', url: 'https://ceduna.jimdofree.com/codigos-y-leyes/' }
        ],
        internalUrl: 'codigos/codigoninez/index.html'
      }
    ]
  },
  {
    id: 'penal-ejecucion',
    nombre: 'Códigos Penales y de Ejecución',
    icono: '⚖️',
    color: '#7b1d1d',
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
          { label: '📚 BaseLegal.com.py', url: 'https://baselegal.com.py/' },
          { label: '📚 CEDUNA', url: 'https://ceduna.jimdofree.com/codigos-y-leyes/' }
        ],
        internalUrl: 'codigos/codigoejecucionpenal/index.html'
      }
    ]
  },
  {
    id: 'laboral',
    nombre: 'Códigos Laborales',
    icono: '👷',
    color: '#1a5c3a',
    codigos: [
      {
        id: 'codigo-laboral',
        nombre: 'Código Laboral',
        ley: 'Ley N° 213/93',
        descripcion: 'Rige los derechos laborales mínimos, contratos de trabajo, salarios, descansos y la actividad sindical.',
        links: [
          { label: '📚 CEDUNA', url: 'https://ceduna.jimdofree.com/codigos-y-leyes/' }
        ],
        internalUrl: 'codigos/codigolaboral/index.html'
      }
    ]
  },
  {
    id: 'procesos',
    nombre: 'Códigos de Procesos y Procedimientos',
    icono: '📋',
    color: '#3a1a5c',
    codigos: [
      {
        id: 'codigo-procesal-civil',
        nombre: 'Código Procesal Civil',
        ley: 'Ley N° 1337/88',
        descripcion: 'Dicta los pasos para tramitar demandas civiles, comerciales y de familia ante los juzgados.',
        links: [
          { label: '📄 Texto Oficial (Correo PY)', url: 'https://correoparaguayo.gov.py/sitio/wp-content/uploads/2023/09/Codigo-Procesal-Civil-1988.pdf' }
        ],
        internalUrl: 'codigos/codigoprocesalcivil/index.html'
      },
      {
        id: 'codigo-procesal-penal',
        nombre: 'Código Procesal Penal',
        ley: 'Ley N° 1286/98',
        descripcion: 'Modela la investigación fiscal y las etapas de los juicios de carácter penal.',
        links: [
          { label: '📚 BaseLegal.com.py', url: 'https://baselegal.com.py/' }
        ],
        internalUrl: 'codigos/codigoprocesalpenal/index.html'
      },
      {
        id: 'codigo-procesal-laboral',
        nombre: 'Código Procesal Laboral',
        ley: 'Ley N° 742/61',
        descripcion: 'Establece las normas de tramitación de los conflictos jurídicos entre empleadores y trabajadores.',
        links: [
          { label: '📚 CEDUNA', url: 'https://ceduna.jimdofree.com/codigos-y-leyes/' }
        ],
        internalUrl: 'codigos/codigoprocesallaboral/index.html'
      }
    ]
  },
  {
    id: 'institucional',
    nombre: 'Códigos Institucionales y de Organización',
    icono: '🏢',
    color: '#1a3a5c',
    codigos: [
      {
        id: 'codigo-organizacion-judicial',
        nombre: 'Código de Organización Judicial',
        ley: 'Ley N° 879/81',
        descripcion: 'Regula la estructura interna del Poder Judicial, las facultades de los jueces y el ejercicio de abogados y escribanos.',
        links: [
          { label: '📚 BaseLegal.com.py', url: 'https://baselegal.com.py/' }
        ],
        internalUrl: 'codigos/codigoorganizacionjudicial/index.html'
      },
      {
        id: 'codigo-electoral',
        nombre: 'Código Electoral',
        ley: 'Ley N° 834/96',
        descripcion: 'Organiza el sistema de votación, el funcionamiento de los partidos políticos y los procesos de elecciones públicas.',
        links: [
          { label: '📚 BaseLegal.com.py', url: 'https://baselegal.com.py/' }
        ],
        internalUrl: 'codigos/codigoelectoral/index.html'
      }
    ]
  },
  {
    id: 'navegacion-transporte',
    nombre: 'Navegación, Espacio y Transporte',
    icono: '🚢',
    color: '#0a4a6a',
    codigos: [
      {
        id: 'codigo-navegacion',
        nombre: 'Código de Navegación Fluvial y Marítima',
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
          { label: '🔗 Paraguay Justia', url: 'https://paraguay.justia.com/nacionales/leyes/' }
        ],
        internalUrl: 'codigos/codigoaeronautico/index.html'
      }
    ]
  },
  {
    id: 'sectorial',
    nombre: 'Códigos Sectoriales y de Recursos Naturales',
    icono: '🌿',
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
          { label: '📚 BaseLegal.com.py', url: 'https://baselegal.com.py/' }
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
      }
    ]
  }
];
