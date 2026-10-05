# Bascule de q-guard.app : WordPress.com → GitHub Pages, DNS chez OVH

> Préparé le 2026-10-05. Même méthode que pour q-bot.eu (voir le CLAUDE.md de qbot-website,
> section DNS) : le site est déjà servi par GitHub sous le vrai nom, la zone OVH est préparée
> pendant qu'elle « dort », puis on bascule les serveurs de noms.

## Où en est-on

- **Domaine acheté chez OVH** (depuis le 2023-11-07, **expire le 2026-11-07** : vérifier le
  renouvellement automatique), mais **délégué à `ns1/ns2/ns3.wordpress.com`** : toute la zone,
  site ET messagerie, vit chez WordPress.com. La zone OVH n'est donc pas utilisée aujourd'hui,
  on peut la modifier sans aucun effet en ligne.
- **La messagerie @q-guard.app est chez Microsoft 365** (MX Outlook, DKIM, autodiscover). C'est
  le point qui compte : si ces enregistrements manquent dans la zone OVH au moment de la
  bascule, **les mails cessent d'arriver**.
- Pas de DNSSEC publié au registre (aucun DS) : rien à défaire de ce côté.
- GitHub Pages connaît déjà `q-guard.app` comme domaine du dépôt, la prod (`main`) est prête
  (sans `noindex`, formulaires branchés sur FormSubmit).

## Ce que tu fais chez OVH

### 1. Préparer la zone (sans effet tant que l'étape 2 n'est pas faite)

OVH → *Noms de domaine* → `q-guard.app` → onglet *Zone DNS*.
S'il n'y a pas de zone, *Créer une zone DNS* (sans cocher « www »).
Puis *Modifier en mode textuel* : **garder les lignes `$TTL`, `SOA` et `NS` qu'OVH affiche**,
supprimer le reste et coller :

```
@                     IN A      185.199.108.153
@                     IN A      185.199.109.153
@                     IN A      185.199.110.153
@                     IN A      185.199.111.153
@                     IN AAAA   2606:50c0:8000::153
@                     IN AAAA   2606:50c0:8001::153
@                     IN AAAA   2606:50c0:8002::153
@                     IN AAAA   2606:50c0:8003::153
www                   IN CNAME  q-leap.github.io.
@                     IN MX 0   qguard-app0c.mail.protection.outlook.com.
@                     IN TXT    "v=spf1 include:spf.protection.outlook.com -all"
@                     IN TXT    "MS=ms40901918"
autodiscover          IN CNAME  autodiscover.outlook.com.
selector1._domainkey  IN CNAME  selector1-qguard-app0c._domainkey.qleap365.onmicrosoft.com.
selector2._domainkey  IN CNAME  selector2-qguard-app0c._domainkey.qleap365.onmicrosoft.com.
_dmarc                IN TXT    "v=DMARC1;p=none;"
```

D'où ça vient : relevé sur `ns1.wordpress.com` le 2026-10-05. Seuls changements par rapport à
WordPress : les A pointent vers GitHub au lieu de WordPress, `www` vers `q-leap.github.io`, et
le SPF perd `include:_spf.wpcloud.com` (les envois de WordPress, qui disparaît).

**À faire avant de continuer** : ouvrir aussi la zone côté WordPress.com (*Upgrades → Domains →
q-guard.app → DNS records*) et vérifier qu'il n'y a rien d'autre (un TXT de vérification Google,
un sous-domaine…). Une zone ne se liste pas de l'extérieur : je n'ai pu interroger que les noms
usuels. Tout enregistrement en plus doit être recopié dans le bloc ci-dessus.

Puis vérifier depuis ce dépôt, avec un des serveurs OVH affichés dans l'onglet *Serveurs DNS*
(ex. `dns109.ovh.net`) :

```sh
tools/check-switch.sh before dns109.ovh.net
```

Tout doit être `ok`.

### 2. Basculer les serveurs de noms (le seul geste qui a un effet)

Onglet *Serveurs DNS* → *Modifier les serveurs DNS* → remplacer `ns1/ns2/ns3.wordpress.com` par
les deux serveurs OVH (bouton *Réinitialiser la configuration DNS* / « utiliser les DNS OVH »).

La propagation prend de quelques minutes à quelques heures. Pendant ce temps, une partie des
visiteurs voit encore WordPress, l'autre GitHub : c'est sans gravité, le contenu est le même et
la messagerie marche des deux côtés puisque les enregistrements sont identiques.

**Ne rien supprimer chez WordPress.com pendant ce temps** — et plus tard non plus sans regarder :
`q-leap.eu` y est aussi hébergé.

### 3. Après la bascule

```sh
tools/check-switch.sh after
```

- **Certificat HTTPS** : `.app` impose HTTPS dans tous les navigateurs, il n'y a pas de repli en
  HTTP. Tant que GitHub n'a pas émis le certificat (en général quelques minutes après que le DNS
  pointe vers lui), les visiteurs qui arrivent sur GitHub voient une erreur de certificat. Si au
  bout de 30 minutes `gh api repos/Q-LEAP/qguard-website/pages` ne montre toujours aucun
  `https_certificate`, retirer et remettre le domaine (c'est ce qui a débloqué q-bot.eu) :

  ```sh
  echo '{"cname":null}'          | gh api --method PUT repos/Q-LEAP/qguard-website/pages --input -
  echo '{"cname":"q-guard.app"}' | gh api --method PUT repos/Q-LEAP/qguard-website/pages --input -
  ```

  **Après chaque pose du domaine, relancer le déploiement** (`gh workflow run pages.yml -R
  Q-LEAP/qguard-website --ref main`) : avec un déploiement par workflow, GitHub répond 404 sous
  le nouveau nom jusqu'au déploiement suivant (constaté le 2026-10-05).

  Puis, certificat `approved` : `echo '{"https_enforced":true}' | gh api --method PUT repos/Q-LEAP/qguard-website/pages --input -`
- **Formulaires** : envoyer un message depuis https://q-guard.app/contact/. Le premier envoi
  déclenche un courrier d'activation de FormSubmit à `contact@q-leap.eu` : cliquer le lien,
  sinon rien n'est transmis. Vérifier ensuite que le message arrive.
- **reCAPTCHA** : la clé est liée à `q-guard.app`, le widget doit s'afficher sans erreur.
- **Messagerie** : envoyer un mail à une adresse @q-guard.app et en recevoir un.
- **Search Console** (facultatif) : propriété de type Domaine, validée par un TXT ajouté dans la
  zone OVH.

## Consulter le site

- **En local** : `python3 -m http.server 8765` à la racine du dépôt, puis http://localhost:8765/
  (la branche extraite est celle qu'on voit).
- **À distance** : https://q-leap.github.io/qguard-preview/ — `dev` à la racine, la proposition
  `alternative` sous `/alternative/`, jamais indexé. Publié par `.github/workflows/preview.yml`
  dans le dépôt `Q-LEAP/qguard-preview`, car `q-leap.github.io/qguard-website/` redirige
  désormais vers `q-guard.app`.
- **Production** : https://q-guard.app (branche `main`), WordPress tant que l'étape 2 n'est pas
  faite.

## Retour arrière

Remettre `ns1.wordpress.com`, `ns2.wordpress.com`, `ns3.wordpress.com` dans l'onglet *Serveurs
DNS* d'OVH : le site WordPress et la messagerie reviennent tels qu'avant, à condition que rien
n'ait été supprimé chez WordPress.com.
