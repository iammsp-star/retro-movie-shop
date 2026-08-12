# 📼 RETRO MOVIE SHOP — STREAMLIT VIDEO VAULT 📼
> *"BE KIND, REWIND! your one-stop digital video shop for Friday night movie magic."*

![Streamlit](https://img.shields.io/badge/Streamlit-1.61-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![React Three Fiber](https://img.shields.io/badge/R3F-8.16-blueviolet?style=for-the-badge&logo=three.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

```
  ____ _____ _____ ____   ___    __  __  ___  _   _ ___ _____   ____  _  _  ___  ____  
 |  _ \ ____|_   _|  _ \ / _ \  |  \/  |/ _ \| | | |_ _| ____| / ___|| || |/ _ \|  _ \ 
 | |_) |  _|   | | | |_) | | | | | |\/| | | | | | | || |  _|   \___ \| || | | | | |_) |
 |  _ <| |___  | | |  _ <| |_| | | |  | | |_| | |_| || | |___   ___) | __ | |_| |  __/ 
 |_| \_\_____| |_| |_| \_\\___/  |_|  |_|\___/ \___/|___|_____| |____/|_||_|\___/|_|   
                                                                                
                    [ OFFICIAL 1990S MEMBER HANDBOOK & SETUP GUIDE ]
```

---

## 📟 WELCOME TO RETRO MOVIE SHOP!

Step inside the neon-lit aisles of **Retro Movie Shop**, the virtual video store where it is perpetually 1998! Browse physical VHS tapes from your favorite **Bollywood & Hollywood** collections with interactive search, release year filters, Wikipedia integrations, and trailer videos.

### 🚀 RUNNING WITH STREAMLIT
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Launch Streamlit app
streamlit run app.py
```

Whether you're looking for explosive **Action**, mind-bending **Sci-Fi**, or spine-chilling **Horror**, click any VHS box to launch a dynamic camera zoom with motion blur, inspect high-res cover art, read plot summaries, and pop the trailer into the VCR.

---

## 🎟️ STORE MEMBERSHIP RULES (FEATURES)

- 🏬 **3D Store Floor Ambiance**: Complete with dark carpet geometry, soft shadow-casting directional lighting, neon shelf signage, and interactive `OrbitControls`.
- 📼 **Dynamic 3D VHS Boxes**: Custom `boxGeometry` meshes loaded with poster artwork on face index 4 via Drei's `useTexture`.
- 🎥 **GSAP Camera Zoom & Motion Blur**: Smooth camera position & target animation powered by GSAP with `back.out(1.7)` easing and dynamic `@react-three/postprocessing` Chromatic Aberration velocity blur.
- 🍿 **TMDB API & Zero-Config Catalog**: Connect your TMDB API key to dynamically fetch live trending hits, or enjoy the pre-packaged 90s classic fallback catalog (*Terminator 2*, *Blade Runner 2049*, *The Thing*, *The Matrix*, *Die Hard*).
- 📺 **Slide-In Feature Panel**: Right-side retro glassmorphism drawer detailing release year, star ratings, plot overview, and an embedded YouTube trailer VCR modal.
- 🕹️ **CRT Scanlines Filter**: Optional toggleable CRT scanlines filter for authentic cathode-ray tube television vibes.

---

## 🛠️ TECH STACK (THE VCR ENGINE)

| Technology | Purpose |
| :--- | :--- |
| **Next.js (App Router)** | Framework, SSR/Client hydration & dynamic routing |
| **React Three Fiber (R3F)** | React wrapper for Three.js 3D Canvas rendering |
| **@react-three/drei** | Essential R3F helpers (`OrbitControls`, `useTexture`, `Html`) |
| **@react-three/postprocessing** | Real-time Chromatic Aberration, Bloom & Vignette effects |
| **GSAP (GreenSock)** | Camera motion timelines, target easing & velocity blur impulses |
| **Tailwind CSS** | Retro neon tokens, glassmorphism panels, & CRT scanlines |
| **TMDB API (v3)** | Real-time movie poster, rating, & overview fetching |

---

## 📁 PROJECT ARCHITECTURE

```
retro-movie-shop/
├── src/
│   ├── app/
│   │   ├── layout.jsx            # Root layout with metadata & StoreProvider state
│   │   ├── page.jsx              # Main App entry with 3D Canvas & UI overlays
│   │   └── globals.css           # CRT scanlines, retro fonts & glowing utilities
│   ├── components/
│   ├── canvas/
│   │   ├── StoreScene.jsx        # 3D Canvas, Lights, Floor & OrbitControls
│   │   ├── Shelf.jsx             # 3D physical shelf structure & neon header sign
│   │   ├── MovieBox.jsx          # Interactive 3D VHS tape box mesh
│   │   └── Effects.jsx           # ChromaticAberration & Bloom postprocessor
│   └── ui/
│       ├── Header.jsx            # Store logo, shelf quick-jump & CRT toggle
│       ├── MovieDetailModal.jsx  # Right slide-in movie detail panel
│       ├── ControlsOverlay.jsx   # Reset Camera Overview floating button
│       └── TrailerModal.jsx      # Video trailer player modal
│   └── lib/
│       ├── tmdb.js               # TMDB API fetch client & mock 90s fallback catalog
│       └── store.js              # Global state & GSAP camera zoom controller
├── next.config.mjs               # Allowed remote poster image domains
├── tailwind.config.js            # Neon colors, shadows & CRT keyframes
└── jsconfig.json                 # `@/*` path alias mapping
```

---

## 📜 EMPLOYEE POLICY & LATE FEES

> ⚠️ **LATE FEE NOTICE**: Tapes kept past midnight on Sunday will incur a **$2.50 per day late fee**!
>
> 📼 **REWIND MANDATE**: Always rewind your VHS tapes before closing the browser tab. Using an external racecar cassette rewinder is encouraged.

---

## 📄 LICENSE

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with 💖, 90s nostalgia, React Three Fiber & GSAP.</sub>
</div>
