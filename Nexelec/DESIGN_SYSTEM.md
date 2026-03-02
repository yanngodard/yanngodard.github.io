# 🎨 Navixis/Nexelec Design System

Guide complet des règles UI et visuelles pour maintenir la cohérence à travers tous les projets.

---

## 📐 Palette de Couleurs

### Couleurs Principales

```css
/* Couleur Primaire - Slate Blue */
--brand-primary: #718DA6;
--brand-primary-light: #F4F7FB;
--brand-primary-hover: hsl(115, 41%, 44%);

/* Couleur Secondaire - Blue */
--brand-secondary: #3b82f6;

/* Couleur Succès - Sage */
--brand-success: #d6dfd5;
--brand-success-dark: #2a8f3a;

/* Couleurs d'État */
--brand-warning: #f59e0b;
--brand-danger: #ef4444;
--brand-purple: #8b5cf6;
```

### Couleurs de Fond

```css
--bg-primary: #F4F7FB;        /* Light Blue Background */
--bg-secondary: #ffffff;       /* White */
--bg-sidebar: #ffffff;         /* White */
```

### Couleurs de Texte

```css
--text-primary: #212529;       /* Charcoal - Titres et texte important */
--text-secondary: #353535;     /* Dark Grey - Texte standard */
--text-muted: #9a9fa5;         /* Grey - Texte secondaire/labels */
```

### Couleurs UI

```css
--border-color: #e8ecef;       /* Bordures subtiles */
```

---

## 🔤 Typographie

### Police Principale

**Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`

**Import Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### Hiérarchie Typographique

| Élément | Taille | Poids | Utilisation |
|---------|--------|-------|-------------|
| **H1** | 36px | 300 (Light) | Titres de page principaux |
| **H2** | 20px | 600 (Semibold) | Sous-titres de section |
| **H3** | 14px | 700 (Bold) | Titres de groupe (uppercase) |
| **Body** | 14px | 400 (Regular) | Texte standard |
| **Small** | 13px | 500 (Medium) | Texte secondaire |
| **Tiny** | 11-12px | 600 (Semibold) | Labels, badges |

### Règles Typographiques

- **Line Height:** 1.5 (standard), 1.6 (texte long)
- **Letter Spacing:** 
  - Normal: 0
  - Labels/Uppercase: 0.5px - 1px
- **Anti-aliasing:** `-webkit-font-smoothing: antialiased;`

---

## 🎯 Logo & Identité

### Logo Principal

**Composition:**
- Icône: Éclair (⚡) dans un carré arrondi
- Texte: "Navixis" en Inter Bold

**Couleurs:**
```css
/* Fond de l'icône */
background: #718DA6;

/* Icône */
color: white;

/* Texte */
color: #212529;
```

### Dimensions du Logo

```css
.logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 4px;  /* var(--radius-sm) */
}

.logo span {
    font-size: 18px;
    font-weight: 700;
}
```

### Icône Lucide

**CDN:**
```html
<script src="https://unpkg.com/lucide@latest"></script>
```

**Initialisation:**
```javascript
lucide.createIcons();
```

**Icône du logo:**
```html
<i data-lucide="zap"></i>
```

---

## 📏 Espacements & Dimensions

### Border Radius

```css
--radius-sm: 4px;    /* Boutons, inputs, petits éléments */
--radius-md: 8px;    /* Cartes moyennes */
--radius-lg: 12px;   /* Grandes cartes */
--radius-xl: 16px;   /* Cartes spéciales */
```

### Ombres

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
```

### Espacements Standard

| Nom | Valeur | Utilisation |
|-----|--------|-------------|
| **xs** | 4px | Gaps minimaux |
| **sm** | 8px | Gaps entre éléments proches |
| **md** | 12px | Gaps standards |
| **lg** | 16px | Padding de cartes |
| **xl** | 20px | Padding de sections |
| **2xl** | 24px | Marges importantes |
| **3xl** | 32px | Séparation de sections |

---

## 🧩 Composants UI

### Boutons

#### Bouton Primaire
```css
.btn-primary {
    background: #718DA6;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 14px;
    box-shadow: 0 4px 6px -1px rgba(113, 141, 166, 0.2);
    transition: all 0.2s;
}

.btn-primary:hover {
    background: hsl(115, 41%, 44%);
    transform: translateY(-1px);
    box-shadow: 0 6px 8px -1px rgba(113, 141, 166, 0.3);
}
```

#### Bouton Secondaire
```css
.btn-secondary {
    background: #F4F7FB;
    color: #212529;
    border: 1px solid #e8ecef;
    padding: 10px 16px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 14px;
}

.btn-secondary:hover {
    background: #ffffff;
}
```

#### Bouton Icône
```css
.icon-btn {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid #e8ecef;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-btn:hover {
    background: #F4F7FB;
}
```

### Cartes

#### Carte Standard
```css
.card {
    background: white;
    border: 1px solid #e8ecef;
    border-radius: 12px;
    padding: 24px;
}
```

#### Carte Stat
```css
.stat-card {
    background: white;
    border: 1px solid #e8ecef;
    border-radius: 12px;
    padding: 24px;
}

.stat-value {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -1px;
}
```

### Badges

```css
.badge {
    padding: 2px 8px;
    background: #9a9fa5;
    color: white;
    font-size: 11px;
    border-radius: 12px;
    font-weight: 600;
}

.status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.status-badge.success {
    background: #F4F7FB;
    color: #718DA6;
}
```

### Inputs

```css
input[type="text"],
input[type="email"],
textarea {
    padding: 10px 14px;
    border: 1px solid #e8ecef;
    border-radius: 4px;
    font-size: 14px;
    background: white;
    outline: none;
}

input:focus {
    border-color: #718DA6;
}
```

---

## 🎨 Chat IA (Eco-Pilot)

### Structure du Chat

```css
.chat-sidebar {
    width: 420px;
    background: white;
    border-left: 1px solid #e8ecef;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.05);
}

.chat-messages {
    padding: 20px;
    background: #f8f9fa;
    gap: 12px;
}
```

### Messages

```css
/* Message Bot */
.message.bot .message-content {
    background: white;
    border: none;
    padding: 14px 16px;
    border-radius: 12px;
    border-bottom-left-radius: 2px;
    font-size: 14px;
    line-height: 1.6;
}

/* Message User */
.message.user .message-content {
    background: #718DA6;
    color: white;
    padding: 14px 16px;
    border-radius: 12px;
    border-bottom-right-radius: 2px;
}
```

### Cartes de Recommandations

```css
.briefing-card {
    background: white;
    border: none;
    border-radius: 12px;
    padding: 16px;
    gap: 12px;
}

.briefing-item {
    padding: 14px;
    border-radius: 10px;
    background: #f5f7f9;
}

.btn-inline-validate {
    background: #8b9db3;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
}
```

---

## 📱 Navigation

### Sidebar

```css
.sidebar {
    width: 280px;
    background: white;
    border-right: 1px solid #e8ecef;
    padding: 24px 16px;
}

/* Item de navigation */
.main-nav li {
    padding: 10px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
}

.main-nav li:hover {
    background: #F4F7FB;
}

.main-nav li.active {
    background: #e9eff5;
    color: #718DA6;
    font-weight: 600;
}
```

### Titres de Section

```css
.nav-section-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #9a9fa5;
    padding: 0 12px;
    margin: 24px 0 8px;
}
```

---

## 🎯 Règles d'Utilisation

### ✅ À Faire

1. **Toujours utiliser la palette de couleurs définie**
   - Primaire: #718DA6 pour les actions principales
   - Texte: #212529 pour les titres, #353535 pour le corps

2. **Respecter la hiérarchie typographique**
   - H1 à 36px/300 pour les titres de page
   - Body à 14px/400 pour le texte standard

3. **Utiliser les espacements cohérents**
   - Padding de cartes: 24px
   - Gap entre éléments: 12px minimum
   - Marges de sections: 32px

4. **Appliquer les border-radius standards**
   - Petits éléments: 4px
   - Cartes: 12px
   - Badges: 12px (pill shape)

5. **Utiliser les ombres subtiles**
   - Préférer les ombres légères (0.05 opacity)
   - Éviter les ombres trop marquées

### ❌ À Éviter

1. **Ne pas utiliser de couleurs hors palette**
   - Éviter les bleus purs, rouges vifs non définis
   - Ne pas inventer de nouvelles nuances

2. **Ne pas mélanger les styles de boutons**
   - Un bouton primaire = une action principale par écran
   - Utiliser secondaire pour les actions alternatives

3. **Éviter les espacements incohérents**
   - Ne pas utiliser 15px, 17px, etc.
   - S'en tenir aux multiples de 4px

4. **Ne pas surcharger les ombres**
   - Maximum 1 ombre par élément
   - Préférer les bordures subtiles aux ombres marquées

5. **Ne pas négliger les états hover/active**
   - Toujours prévoir un feedback visuel
   - Utiliser transform: translateY(-1px) pour les boutons

---

## 📦 Fichiers de Référence

### CSS Variables (à copier dans vos projets)

```css
:root {
    /* Colors */
    --brand-primary: #718DA6;
    --brand-primary-light: #F4F7FB;
    --brand-primary-hover: hsl(115, 41%, 44%);
    --brand-secondary: #3b82f6;
    --brand-success: #d6dfd5;
    --brand-success-dark: #2a8f3a;
    --brand-warning: #f59e0b;
    --brand-danger: #ef4444;
    --brand-purple: #8b5cf6;

    /* Backgrounds */
    --bg-primary: #F4F7FB;
    --bg-secondary: #ffffff;
    --bg-sidebar: #ffffff;

    /* Text */
    --text-primary: #212529;
    --text-secondary: #353535;
    --text-muted: #9a9fa5;

    /* UI Elements */
    --border-color: #e8ecef;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05);

    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
}
```

---

## 🚀 Quick Start

### 1. Importer les dépendances

```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest"></script>
```

### 2. Initialiser les icônes

```javascript
// À la fin du body
lucide.createIcons();
```

### 3. Copier les CSS Variables

Copier le bloc `:root` ci-dessus dans votre fichier CSS principal.

### 4. Créer le logo

```html
<div class="logo">
    <div class="logo-icon">
        <i data-lucide="zap"></i>
    </div>
    <span>Navixis</span>
</div>
```

---

## 📞 Support

Pour toute question sur l'utilisation de ce design system, référez-vous aux fichiers sources :
- `style.css` - Styles principaux
- `style.v2.css` - Variante avec grille de devices
- `index.html` - Exemple d'implémentation

**Version:** 1.0  
**Dernière mise à jour:** Février 2026  
**Projet:** Navixis/Nexelec Smart Building Platform
