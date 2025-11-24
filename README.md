# 🍽️ PetitsPlats 2.0 — Moteur de Recherche (JavaScript)

Projet réalisé dans le cadre de la formation *Développeur javascript React OpenClassrooms*.  
Objectif : développer un moteur de recherche performant, sans framework, basé sur un index optimisé et des filtres dynamiques.

![Aperçu du site](./assets/Home-page.png)

# ✨ Fonctionnalités principales

## 🔍 Recherche principale

- Recherche plein texte dès **3 caractères**
- Normalisation : minuscules, accents retirés…
- Résultats instantanés
- Moteur basé sur un **index optimisé**

---

## 🏷️ Gestion des tags (ingrédients, appareils, ustensiles)

- Ajout dynamique
- Suppression via icône 
- Filtres croisés
- Mise à jour automatique des dropdowns

---

## 📂 Dropdowns dynamiques

- Ouverture/fermeture animée
- Liste filtrée en temps réel

# 🧠 Moteur de recherche — fonctionnement interne

## 1️⃣ Construction d’un index optimisé

À l’initialisation :

- nom + description + ingrédients  
➡ Concaténés dans `fullTextRecipe`  
➡ Normalisés dans `textRecherche`  
➡ Stockés dans `StateRecipes.TableauIndex`

## 2️⃣ Algorithme de recherche principal

- Si < 3 caractères → erreur  
- Sinon → recherche dans l’index  
- Application des filtres actifs

---

# ✨ Hébergememnt

Le site est hégergé sur [[Github Pages](url)]([url](https://danickdela.github.io/PetitsPlats2.0/))


# ⚙️ Installation

## 1. Cloner le projet
```bash
git clone https://github.com/danickdela/PetitsPlats2.0.git
cd PetitsPlats2.0

🧰 Technologies
HTML5, CSS3 + TailwindCSS, JavaScript ES6+

🚀 Améliorations possibles

Index inversé
Version mobile enrichie
Pagination..


👤 Auteur

Danick Delaroche — Projet OpenClassrooms 2025
PetitsPlats 2.0

📄 Licence : Libre d’utilisation à des fins pédagogiques.
