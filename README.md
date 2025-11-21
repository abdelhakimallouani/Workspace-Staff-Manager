# WorkSphere - Workspace Staff Manager

![WorkSphere](https://img.shields.io/badge/Status-Complete-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

Une application web innovante pour la gestion visuelle et interactive du personnel dans les espaces de travail.

## 🌟 Live Demo

**[Accéder à l'application](https://abdelhakimallouani.github.io/Workspace-Staff-Manager/)**

## 📋 Description du Projet

WorkSphere est une application web développée pour l'entreprise WorkSphere permettant de gérer visuellement et en temps réel la répartition du personnel sur un plan d'étage. L'application intègre des contraintes métier liées aux rôles et zones autorisées pour chaque employé.

### 🎯 Objectifs Principaux

- **Gestion Visuelle** : Ajout, déplacement et suppression d'employés directement sur le plan
- **Contrôle d'Accès** : Respect des restrictions par rôle et zone
- **Interface Responsive** : Expérience fluide sur tous les appareils
- **Centralisation** : Gestion unifiée des données du personnel et de la visualisation spatiale

## 🚀 Fonctionnalités

### 👥 Gestion des Employés
- ✅ Ajout d'employés via formulaire modal
- ✅ Prévisualisation de la photo en temps réel
- ✅ Validation des données avec REGEX
- ✅ Gestion des expériences professionnelles (formulaire dynamique)
- ✅ Validation des dates d'expérience

### 🏢 Gestion des Zones
- **6 zones configurables** :
  - Salle de conférence
  - Réception
  - Salle des serveurs
  - Salle de sécurité
  - Salle du personnel
  - Salle d'archives

### 🔒 Restrictions par Rôle
- **Réception** → Uniquement les Réceptionnistes
- **Salle des serveurs** → Uniquement les Techniciens IT
- **Salle de sécurité** → Uniquement les Agents de sécurité
- **Manager** → Accès à toutes les zones
- **Nettoyage** → Accès partout sauf Salle d'archives
- **Autres rôles** → Accès libre aux zones non restreintes

### 📱 Interface Utilisateur
- ✅ Design moderne avec Flexbox et Grid CSS
- ✅ Animations CSS fluides
- ✅ Interface responsive (Desktop, Tablet, Mobile)
- ✅ Palette de couleurs cohérente
- ✅ Icônes intuitives

### 🔧 Fonctionnalités Avancées
- ✅ Bouton "X" pour retirer les employés des zones
- ✅ Profil détaillé des employés
- ✅ Bouton "+" pour ajouter des employés éligibles
- ✅ Indication visuelle des zones vides obligatoires
- ✅ Limitations du nombre d'employés par zone

## 🛠️ Technologies Utilisées

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Layout** : Flexbox & CSS Grid
- **Validation** : REGEX pour les formulaires
- **Responsive Design** : Media Queries
- **Hébergement** : GitHub Pages

## 📁 Structure du Projet

Workspace-Staff-Manager/
│
├── index.html # Page principale
├── style.css # Styles CSS
├── main_jsjs # Logique JavaScript
├── README.md # Documentation
└── assets/ # Ressources (images, icônes)


## 🎨 Design Responsive

L'application supporte les tailles d'écran suivantes :

### Portrait
- **Grand écran** : > 1280px
- **Petit écran** : 1024px - 1279px
- **Tablette** : 768px - 1023px
- **Mobile** : ≤ 767px

### Paysage
- **Mobile** : 768px - 1023px
- **Tablette** : 1024px - 1279px

## 🚀 Installation et Utilisation

### Utilisation Directe
1. Accédez à la [demo en ligne](https://abdelhakimallouani.github.io/Workspace-Staff-Manager/)
2. Commencez à ajouter des employés via le bouton "Add New Worker"
3. Déplacez les employés entre les zones selon leurs rôles

### Développement Local
```bash
# Cloner le repository
git clone https://github.com/abdelhakimallouani/Workspace-Staff-Manager.git

# Ouvrir le projet
cd Workspace-Staff-Manager

# Ouvrir index.html dans un navigateur
