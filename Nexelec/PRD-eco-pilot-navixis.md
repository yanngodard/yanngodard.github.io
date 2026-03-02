# PRD : Eco-Pilot – IA d'Optimisation Énergétique & Sanitaire

**Statut** : Validé / Version 1.1  
**Rôle** : Senior Product Manager & Strategic Product Lead  
**Dernière mise à jour** : 26 Janvier 2026

---

## 1. Vision & Positionnement Stratégique
Le secteur de l'immobilier tertiaire fait face à une triple pression : l'explosion des coûts de l'énergie, les exigences ESG des investisseurs et le respect du **Décret Tertiaire** (-40% d'ici 2030).
**Eco-Pilot** transforme la donnée brute de Navixis en décisions actionnables, automatisant la transition du simple monitoring vers le pilotage prédictif.

### Proposition de Valeur Unique (USP)
"Le premier copilote autonome qui réduit votre facture énergétique de 25% tout en garantissant un air sain, sans intervention humaine."

---

## 2. Analyse Personas & JTBD (Jobs To Be Done)

| Persona | Job To Be Done | Pain Points |
| :--- | :--- | :--- |
| **Asset Manager** | Valoriser le patrimoine et prouver la conformité ESG. | Manque de rapports consolidés, risque de sanctions (Loi ELAN). |
| **Facility Manager** | Maintenir le confort et l'efficacité opérationnelle. | Alertes trop nombreuses, interventions manuelles répétitives. |

---

## 3. Priorisation RICE des Fonctionnalités

| Fonctionnalité | Reach | Impact | Confidence | Effort | **RICE Score** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dashboard Health Score 2.0** | 100% | High | 90% | Med | **180** |
| **Prédiction Pic CO2 (IA)** | 80% | High | 80% | High | **120** |
| **Générateur ELAN Automatisé** | 60% | Massive | 100% | Med | **150** |
| **Contrôle GTB via MQTT/BACnet** | 40% | Massive | 70% | High | **80** |

---

## 4. User Stories Détaillées (INVEST)

### US#1 : Prédiction de Qualité de l'Air (P1)
**En tant que** Facility Manager,  
**je veux** que l'IA prédise un pic de CO2 15 minutes à l'avance,  
**afin de** lancer la ventilation forcée avant que le seuil de 1000ppm ne soit dépassé.

*   **Critères d'Acceptation :**
    *   Précision de la prédiction > 92%.
    *   Notification visuelle "orange" si seuil prédit > 800ppm.
    *   Log automatique de l'action corrective effectuée par l'IA.

### US#2 : Rapport de Conformité ELAN (P1)
**En tant qu'** Asset Manager,  
**je veux** exporter un PDF mensuel certifié,  
**afin de** de répondre aux audits de conformité du Décret Tertiaire sans effort manuel.

*   **Critères d'Acceptation :**
    *   Génération en < 5 secondes.
    *   Inclusion des économies de kWh et réduction de kg CO2.

---

## 5. Spécifications UX Design (UX Designer & UI/UX Pro Max)

*   **Micro-interactions** : États de survol fluides (200ms), squelettes de chargement (skeletons).
*   **Accessibilité** : Respect strict du WCAG 2.1 AA (contrastes > 4.5:1).
*   **Aha Moment** : Visualisation immédiate de l'argent économisé dès la connexion.

---

## 6. Roadmap Technique

*   **Q1 2026** : UI Refinement (Glassmorphism 2.0) & Intégration Chart.js optimisée.
*   **Q2 2026** : Moteur prédictif IA (Node.js + TensorFlow.js lightweight).
*   **Q3 2026** : Connecteurs BACnet natifs & API Publique.

---

## 7. Métriques de Succès (KPIs)
1.  **Réduction Facture Énergétique** : Moyenne de 22% visée pour les clients actifs.
2.  **Health Score Moyen** : Maintenir les bâtiments au-dessus de 80.
3.  **Taux d'Activation "Eco-Pilot"** : % d'utilisateurs ayant activé l'automatisation.
