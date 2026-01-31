# 📊 Retail Performance Dashboard

Una aplicación web completa para rastrear KPIs de rendimiento de múltiples tiendas retail en tiempo real.

## 🚀 Características

### KPIs Rastreados
- **UPT** (Units Per Transaction)
- **Tell Primark** (% Satisfacción del cliente)
- **Reusable Bags** (Bolsas reutilizables vendidas)
- **Soiled & Damaged** (% S&D)
- **RAS** (Rate of Sale %)
- **SCO Usage** (% Uso de Self-Checkout)
- **SOH** (Stock on Hand)
- **Store vs Depot Available** (NOOS %)

### Funcionalidades Principales
✅ Dashboard global con resumen de todas las tiendas  
✅ Páginas individuales de tienda con métricas detalladas  
✅ Gráficos interactivos (Chart.js)  
✅ Filtros por tienda  
✅ Recomendaciones AI basadas en KPIs  
✅ Exportación de datos a CSV  
✅ Integración opcional con Google Sheets  
✅ Diseño responsive y profesional  

## 📁 Estructura del Proyecto

```
retail-performance-app/
│
├── index.html              # Dashboard global
├── store.html              # Página de detalle de tienda
├── style.css               # Estilos CSS
├── README.md               # Esta documentación
│
├── data/
│   └── stores.json         # Datos de tiendas
│
└── js/
    ├── data.js             # Carga de datos
    ├── kpis.js             # Cálculos de KPIs
    ├── charts.js           # Renderizado de gráficos
    ├── ai.js               # Recomendaciones AI
    ├── app.js              # Lógica principal
    └── script.js           # Integración Google Sheets (opcional)
```

## 🛠️ Instalación y Uso

### Opción 1: Abrir directamente en navegador
1. Descarga o clona este repositorio
2. Abre `index.html` en tu navegador web
3. ¡Listo! La aplicación funcionará con datos de ejemplo

### Opción 2: Servidor local (recomendado)
```bash
# Usando Python
python -m http.server 8000

# O usando Node.js
npx http-server

# Luego abre http://localhost:8000 en tu navegador
```

### Opción 3: Deploy en Netlify

#### Deploy Rápido:
1. Crea una cuenta en [Netlify](https://netlify.com)
2. Arrastra la carpeta `retail-performance-app` a Netlify
3. ¡Tu dashboard estará online en segundos!

#### Deploy desde Git:
```bash
# Inicializa git
git init
git add .
git commit -m "Initial commit"

# Sube a GitHub
git remote add origin https://github.com/tu-usuario/retail-dashboard.git
git push -u origin main

# En Netlify:
# 1. New site from Git
# 2. Selecciona tu repositorio
# 3. Deploy!
```

## 🔧 Configuración

### Personalizar Datos de Tiendas

Edita `data/stores.json` o actualiza directamente en `js/data.js`:

```json
{
  "name": "Tu Tienda",
  "sales": {
    "budget": 150000,
    "last_year": 120000
  },
  "soh": 200,
  "reusable_bags": 75,
  "tell_primark": 85,
  "store_vs_depot": 50,
  "growth_up": 25,
  "ras": 6,
  "s_and_d": 4
}
```

### Integración con Google Sheets (Opcional)

1. **Crea un proyecto en Google Cloud:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Crea un nuevo proyecto

2. **Habilita Google Sheets API:**
   - En APIs & Services, habilita "Google Sheets API"

3. **Crea credenciales API:**
   - Crea una API key
   - Copia la clave

4. **Configura tu hoja de cálculo:**
   - Columnas requeridas: Store Name, Budget, Last Year Sales, SOH, Reusable Bags, Tell Primark, Store vs Depot, Growth Up, RAS, S&D
   - Haz la hoja pública (Anyone with link can view)

5. **Actualiza configuración en `js/script.js`:**
   ```javascript
   const GOOGLE_SHEETS_CONFIG = {
       apiKey: 'TU_API_KEY',
       spreadsheetId: 'TU_SPREADSHEET_ID',
       range: 'Sheet1!A1:J100'
   };
   ```

6. **Añade script en HTML:**
   ```html
   <script src="https://apis.google.com/js/api.js"></script>
   <script>
       gapi.load('client', initGoogleSheetsAPI);
   </script>
   ```

### Integración con API de IA (Futuro)

El código ya está preparado para integrar OpenAI o Google Gemini:

```javascript
// En ai.js, descomentar y configurar:
async function getOpenAIRecommendations(stores) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer TU_API_KEY'
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{
                role: 'user',
                content: `Analiza estos datos retail: ${JSON.stringify(stores)}`
            }]
        })
    });
    return await response.json();
}
```

## 📊 Uso de la Aplicación

### Dashboard Principal (`index.html`)
- **Tarjetas KPI:** Vista general de métricas promedio
- **Filtro por tienda:** Selecciona tiendas específicas
- **Gráficos:** Comparación visual entre tiendas
- **Tabla resumen:** Todas las tiendas con sus KPIs principales
- **Botón AI:** Genera recomendaciones automáticas
- **Exportar CSV:** Descarga datos en formato CSV

### Página de Tienda (`store.html`)
- **Métricas detalladas** de la tienda seleccionada
- **Rendimiento diario** (simulado)
- **Gráficos específicos** de la tienda
- **Recomendaciones AI** personalizadas
- **Tabla de métricas** completa

## 🎨 Personalización de Diseño

Edita `style.css` para cambiar colores y estilos:

```css
:root {
    --primary-color: #0070f3;      /* Color principal */
    --success-color: #00c851;      /* Color de éxito */
    --warning-color: #ff8800;      /* Color de advertencia */
    --danger-color: #ff4444;       /* Color de peligro */
}
```

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 💻 Desktop
- 📱 Tablets
- 📱 Mobile

## 🔮 Próximas Mejoras

- [ ] Integración real con OpenAI/Gemini
- [ ] Autenticación de usuarios
- [ ] Base de datos backend
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Comparación de períodos
- [ ] Predicciones con ML

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📧 Soporte

Para preguntas o problemas, abre un issue en GitHub.

---

**Desarrollado con ❤️ para equipos retail**# retail-performance-app
