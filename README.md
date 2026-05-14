🛸 Rick & Morty Explorer — Ultimate Team Edition

> Explorá el multiverso como nunca antes. Una galería de personajes de Rick and Morty con estética de carta de EA Sports FC Ultimate Team, paginación dinámica y datos en tiempo real desde Rick & Morty API.

---

## 👥 Integrantes

| Nombre | GitHub |
|--------|--------|
| Di Pasquale Agustina | Yuima98 |
| Acevedo Alan | Acevedo-Alan |

---

## 🛠️ Tecnologías utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

- **HTML5** — estructura semántica y accesible
- **CSS3** — animaciones, grid layout y efectos visuales (scanlines, portal glow)
- **JavaScript (Vanilla)** — consumo de API, renderizado dinámico y paginación
- **Google Fonts** — tipografías Teko y Orbitron para la estética gaming
- **Rick and Morty API** — fuente de datos de personajes

---

## 📸 Capturas de pantalla

> _Agregá al menos 2 capturas en la carpeta `/screenshots` y actualizá las rutas abajo._

### Pantalla principal — Galería de personajes
![Pantalla principal](screenshots/home.png)

### Detalle de carta — Estilo Ultimate Team
![Detalle de carta](screenshots/card-detail.png)

---

## 🚀 Ejecutar el proyecto localmente

Este proyecto no requiere instalación de dependencias ni servidor backend. Es puro HTML/CSS/JS.

### Opción 1 — Abrir directamente en el navegador

```bash
# Cloná el repositorio
git clone https://github.com/Acevedo-Alan/rick-and-morty-explorer.git

# Entrá a la carpeta
cd rick-and-morty-explorer

# Abrí index.html en tu navegador
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Opción 2 — Live Server (recomendado para desarrollo)

Si tenés VS Code, instalá la extensión **Live Server** y hacé click derecho sobre `index.html` → _"Open with Live Server"_.

---

## 🌐 Deploy

🔗 [Ver proyecto en vivo](https://acevedo-alan.github.io/rick-and-morty-explorer)

---

## 🔌 API utilizada

**[The Rick and Morty API](https://rickandmortyapi.com)**

API REST pública y gratuita con información de todos los personajes, episodios y locaciones del universo de Rick and Morty.

| Endpoint utilizado | Descripción |
|--------------------|-------------|
| `GET /api/character` | Lista paginada de personajes |

### Ejemplo de respuesta

```json
{
  "info": { "count": 826, "pages": 42 },
  "results": [
    {
      "id": 1,
      "name": "Rick Sanchez",
      "status": "Alive",
      "species": "Human",
      "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg"
    }
  ]
}
```

> Datos provistos por [rickandmortyapi.com](https://rickandmortyapi.com) — sin autenticación requerida.

---

## 📁 Estructura del proyecto

```
rick-and-morty-explorer/
├── index.html          # Estructura principal
├── css/
│   └── styles.css      # Estilos y animaciones
├── js/
│   ├── api.js          # Consumo de la Rick and Morty API
│   ├── ui.js           # Renderizado de tarjetas y estados
│   └── main.js         # Lógica principal y paginación
└── README.md
```

---

<p align="center">
  Hecho con 💚 y mucho portal gun · Datos por <a href="https://rickandmortyapi.com">The Rick and Morty API</a>
</p>