import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EDITOR = 'Dura Tech'
const CONTACT_EMAIL = 'duramenplus@gmail.com'
const LAST_UPDATE = 'Juin 2026'

// ─── COMPOSANTS DE MISE EN FORME ──────────────────────────────────────────────
function H({ children }) {
  return <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginTop: 28, marginBottom: 10 }}>{children}</h2>
}
function P({ children }) {
  return <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, marginBottom: 12 }}>{children}</p>
}
function Li({ children }) {
  return (
    <li style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, marginBottom: 8, paddingLeft: 4 }}>{children}</li>
  )
}
function Ul({ children }) {
  return <ul style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ul>
}

// ─── CONTENU : CGU ────────────────────────────────────────────────────────────
function CGU() {
  return (
    <div>
      <P><em>Dernière mise à jour : {LAST_UPDATE}</em></P>

      <P>
        Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et
        l'utilisation de l'application Duramen (ci-après « l'Application »). En créant un compte et
        en utilisant l'Application, tu acceptes sans réserve les présentes CGU.
      </P>

      <H>1. Objet de l'Application</H>
      <P>
        Duramen est une application de <strong>bien-être et d'accompagnement comportemental</strong>{' '}
        destinée aux hommes adultes souhaitant améliorer le contrôle de leur éjaculation à travers
        des exercices, un suivi de progression et un coach conversationnel.
      </P>
      <P>
        Duramen <strong>n'est pas un dispositif médical</strong>, ne pose aucun diagnostic et ne se
        substitue en aucun cas à une consultation auprès d'un professionnel de santé (médecin
        généraliste, urologue, sexologue ou psychologue).
      </P>

      <H>2. Conditions d'accès — Public majeur uniquement</H>
      <P>
        L'Application est strictement réservée aux personnes <strong>âgées de 18 ans ou plus</strong>.
        En créant un compte, tu déclares être majeur. Toute utilisation par un mineur est interdite.
      </P>

      <H>3. Compte utilisateur</H>
      <P>
        La création d'un compte nécessite une adresse e-mail valide et un mot de passe. Tu es
        responsable de la confidentialité de tes identifiants et de toute activité réalisée depuis
        ton compte. Tu t'engages à fournir des informations exactes lors du questionnaire initial.
      </P>

      <H>4. Avertissement médical important</H>
      <P>
        Les contenus, exercices et conseils proposés par l'Application et par le coach conversationnel
        « Alex » sont fournis à titre <strong>éducatif et informatif</strong>. Ils ne constituent pas
        un avis médical.
      </P>
      <Ul>
        <Li>Consulte un médecin avant de commencer tout programme si tu as des doutes sur ta santé.</Li>
        <Li>En cas de douleur, de trouble de l'érection persistant ou de détresse psychologique, consulte sans tarder un professionnel de santé.</Li>
        <Li>Le questionnaire d'orientation peut te recommander un avis médical : cette recommandation doit être prise au sérieux.</Li>
      </Ul>

      <H>5. Coach conversationnel (IA)</H>
      <P>
        Le coach « Alex » repose sur une intelligence artificielle. Ses réponses sont générées
        automatiquement et peuvent comporter des imprécisions. Elles ne remplacent jamais l'avis d'un
        professionnel. Le nombre de messages quotidiens peut être limité.
      </P>

      <H>6. Utilisation acceptable</H>
      <P>Tu t'engages à ne pas :</P>
      <Ul>
        <Li>utiliser l'Application à des fins illégales ou contraires à l'ordre public ;</Li>
        <Li>tenter d'accéder aux comptes d'autres utilisateurs ou aux systèmes de l'Application ;</Li>
        <Li>reproduire, revendre ou exploiter commercialement le contenu sans autorisation.</Li>
      </Ul>

      <H>7. Propriété intellectuelle</H>
      <P>
        L'ensemble des contenus de l'Application (textes, exercices, design, marque Duramen) est
        protégé par le droit de la propriété intellectuelle. Toute reproduction non autorisée est
        interdite.
      </P>

      <H>8. Responsabilité</H>
      <P>
        L'Application est fournie « en l'état ». L'éditeur ne saurait être tenu responsable des
        résultats obtenus, qui dépendent de l'assiduité de chacun, ni d'un usage non conforme aux
        présentes CGU ou aux recommandations médicales.
      </P>

      <H>9. Modification et résiliation</H>
      <P>
        Tu peux supprimer ton compte à tout moment depuis la page « Compte ». L'éditeur se réserve le
        droit de modifier les présentes CGU ; les utilisateurs seront informés de toute modification
        substantielle.
      </P>

      <H>10. Droit applicable</H>
      <P>
        Les présentes CGU sont soumises au droit français. Pour toute question :{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--primary)' }}>{CONTACT_EMAIL}</a>.
      </P>
    </div>
  )
}

// ─── CONTENU : POLITIQUE DE CONFIDENTIALITÉ ───────────────────────────────────
function Privacy() {
  return (
    <div>
      <P><em>Dernière mise à jour : {LAST_UPDATE}</em></P>

      <P>
        La présente Politique de Confidentialité décrit comment Duramen (ci-après « nous ») collecte,
        utilise et protège tes données personnelles, conformément au Règlement Général sur la
        Protection des Données (RGPD).
      </P>

      <H>1. Responsable du traitement</H>
      <P>
        Le responsable du traitement des données est l'éditeur de l'Application, {EDITOR}. Pour toute
        demande relative à tes données :{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--primary)' }}>{CONTACT_EMAIL}</a>.
      </P>

      <H>2. Données collectées</H>
      <P>Nous collectons les données suivantes :</P>
      <Ul>
        <Li><strong>Données d'identification</strong> : adresse e-mail, prénom.</Li>
        <Li><strong>Données de santé sensibles</strong> : réponses au questionnaire (profil, fréquence, ressenti, habitudes), considérées comme données sensibles au sens de l'article 9 du RGPD.</Li>
        <Li><strong>Données d'usage</strong> : exercices complétés, progression, série (streak), humeur déclarée.</Li>
        <Li><strong>Échanges avec le coach IA</strong> : messages envoyés à « Alex ».</Li>
      </Ul>

      <H>3. Base légale et consentement</H>
      <P>
        Le traitement de tes données de santé repose sur ton <strong>consentement explicite</strong>,
        donné lors de la création de ton compte et du questionnaire. Tu peux retirer ce consentement à
        tout moment en supprimant ton compte.
      </P>

      <H>4. Finalités du traitement</H>
      <Ul>
        <Li>te proposer un programme personnalisé et adapté à ton profil ;</Li>
        <Li>assurer le suivi de ta progression ;</Li>
        <Li>permettre le fonctionnement du coach conversationnel ;</Li>
        <Li>t'envoyer, avec ton accord, des rappels par notification.</Li>
      </Ul>

      <H>5. Hébergement et sous-traitants</H>
      <P>
        Tes données sont hébergées par <strong>Supabase</strong> (base de données et authentification)
        et l'Application est déployée via <strong>Vercel</strong>. Les échanges avec le coach IA sont
        traités via <strong>OpenRouter</strong>. Ces prestataires agissent en qualité de sous-traitants
        et présentent des garanties de sécurité conformes au RGPD.
      </P>

      <H>6. Durée de conservation</H>
      <P>
        Tes données sont conservées tant que ton compte est actif. En cas de suppression de ton compte,
        elles sont effacées de nos bases dans un délai raisonnable.
      </P>

      <H>7. Sécurité</H>
      <P>
        Nous mettons en œuvre des mesures techniques appropriées : chiffrement des échanges (HTTPS),
        authentification sécurisée, isolation des données par utilisateur (Row Level Security). Tes
        clés et identifiants sensibles ne sont jamais exposés publiquement.
      </P>

      <H>8. Tes droits</H>
      <P>Conformément au RGPD, tu disposes des droits suivants :</P>
      <Ul>
        <Li>droit d'accès, de rectification et d'effacement de tes données ;</Li>
        <Li>droit à la limitation et à l'opposition au traitement ;</Li>
        <Li>droit à la portabilité de tes données ;</Li>
        <Li>droit de retirer ton consentement à tout moment.</Li>
      </Ul>
      <P>
        Tu peux exercer la plupart de ces droits directement depuis l'Application (modification du
        profil, suppression du compte) ou en nous écrivant à{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--primary)' }}>{CONTACT_EMAIL}</a>.
        Tu disposes également du droit d'introduire une réclamation auprès de la CNIL.
      </P>

      <H>9. Confidentialité renforcée</H>
      <P>
        Compte tenu de la nature intime des données traitées, nous nous engageons à ne jamais vendre,
        louer ni partager tes données à des fins publicitaires. Tes réponses et tes échanges avec le
        coach restent strictement confidentiels.
      </P>

      <H>10. Notifications</H>
      <P>
        Les notifications push sont facultatives et soumises à ton autorisation. Tu peux les
        désactiver à tout moment depuis la page « Compte » ou les réglages de ton appareil.
      </P>
    </div>
  )
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────
export default function Legal() {
  const navigate = useNavigate()
  const { doc } = useParams()
  const [tab, setTab] = useState(doc === 'confidentialite' ? 'privacy' : 'cgu')

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }} className="fade-in">

      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, var(--primary) 0%, #3a6359 100%)',
        padding: '52px 20px 20px',
        position: 'relative',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: 10, padding: '7px 12px', fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}
        >
          <i className="ti ti-arrow-left"></i> Retour
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', fontWeight: 500 }}>
          Informations légales
        </h1>
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', gap: 8, padding: '16px 20px 0' }}>
        {[
          { id: 'cgu',     label: 'Conditions d\'utilisation' },
          { id: 'privacy', label: 'Confidentialité' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 12, fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
              border: `1.5px solid ${tab === t.id ? 'var(--primary)' : 'var(--border)'}`,
              background: tab === t.id ? 'var(--primary-light)' : 'var(--bg-card)',
              color: tab === t.id ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div style={{ padding: '20px 24px', paddingBottom: 'calc(90px + env(safe-area-inset-bottom, 0px))' }}>
        {tab === 'cgu' ? <CGU /> : <Privacy />}
      </div>
    </div>
  )
}
