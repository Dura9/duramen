# 🚀 Guide d'installation Duramen — Pas à pas

> Aucune connaissance en code requise. Suivez chaque étape dans l'ordre.

---

## ÉTAPE 1 — Configurer Supabase (la base de données)

1. Allez sur **supabase.com** → connectez-vous
2. Cliquez sur votre projet "duramen"
3. Dans le menu de gauche, cliquez sur **SQL Editor** (icône de base de données)
4. Cliquez sur **New query**
5. Ouvrez le fichier **supabase_setup.sql** (inclus dans ce dossier)
6. Copiez tout le contenu et collez-le dans l'éditeur
7. Cliquez sur le bouton vert **Run**
8. Vous devez voir "Success. No rows returned" → c'est bon ✅

---

## ÉTAPE 2 — Créer un compte GitHub et uploader le code

1. Allez sur **github.com** → connectez-vous
2. Cliquez sur le **+** en haut à droite → **New repository**
3. Nom du repository : **duramen**
4. Laissez tout par défaut → cliquez **Create repository**
5. Sur la page qui s'affiche, cliquez sur **uploading an existing file**
6. Glissez-déposez **tous les fichiers du dossier duramen** dans la zone
7. Cliquez **Commit changes** (bouton vert)

---

## ÉTAPE 3 — Configurer les clés secrètes (IMPORTANT)

Dans le fichier **.env.local**, remplacez les valeurs :

```
VITE_SUPABASE_URL=https://VOTRE-URL.supabase.co
VITE_SUPABASE_ANON_KEY=eyJVOTRE-CLE-ANON...
VITE_OPENROUTER_KEY=sk-or-v1-VOTRE-CLE...
```

**⚠️ Ne partagez jamais ce fichier publiquement.**

---

## ÉTAPE 4 — Déployer sur Vercel

1. Allez sur **vercel.com** → connectez-vous avec GitHub
2. Cliquez **Add New Project**
3. Sélectionnez votre repository **duramen**
4. Cliquez **Import**
5. Avant de cliquer Deploy, cliquez sur **Environment Variables**
6. Ajoutez les 3 variables une par une :
   - **Name** : `VITE_SUPABASE_URL` → **Value** : votre URL Supabase
   - **Name** : `VITE_SUPABASE_ANON_KEY` → **Value** : votre clé anon
   - **Name** : `VITE_OPENROUTER_KEY` → **Value** : votre clé OpenRouter
7. Cliquez **Deploy**
8. Attendez 2 minutes → Vercel vous donne un lien **duramen.vercel.app** ✅

---

## ÉTAPE 5 — Configurer l'authentification Supabase

1. Retournez sur **supabase.com** → votre projet
2. Dans le menu gauche : **Authentication** → **URL Configuration**
3. Dans **Site URL**, entrez votre URL Vercel : `https://duramen.vercel.app`
4. Dans **Redirect URLs**, ajoutez : `https://duramen.vercel.app/**`
5. Cliquez **Save**

---

## ✅ Votre application est en ligne !

Testez en allant sur votre lien Vercel. Créez un compte et suivez l'onboarding.

---

## En cas de problème

- Page blanche → vérifiez les variables d'environnement dans Vercel
- Erreur de connexion → vérifiez l'URL Supabase dans Authentication
- Coach IA ne répond pas → vérifiez votre clé OpenRouter

Pour toute question, les erreurs apparaissent dans Vercel → votre projet → **Functions** → **Logs**.
