import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'

const EDITOR = 'Dura Tech'
const CONTACT_EMAIL = 'duramenplus@gmail.com'
const LAST_UPDATE = { fr: 'Juin 2026', en: 'June 2026' }

// ─── COMPOSANTS DE MISE EN FORME ──────────────────────────────────────────────
function H({ children }) {
  return <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginTop: 28, marginBottom: 10 }}>{children}</h2>
}
function P({ children }) {
  return <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, marginBottom: 12 }}>{children}</p>
}
function Li({ children }) {
  return <li style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, marginBottom: 8, paddingLeft: 4 }}>{children}</li>
}
function Ul({ children }) {
  return <ul style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ul>
}
function Mail() {
  return <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--primary)' }}>{CONTACT_EMAIL}</a>
}

// ─── CGU ──────────────────────────────────────────────────────────────────────
function CGU({ lang }) {
  if (lang === 'en') return (
    <div>
      <P><em>Last updated: {LAST_UPDATE.en}</em></P>
      <P>These Terms of Use (the "Terms") govern access to and use of the Duramen application (the "App"). By creating an account and using the App, you fully accept these Terms.</P>
      <H>1. Purpose of the App</H>
      <P>Duramen is a <strong>wellness and behavioral coaching</strong> application for adult men who wish to improve control over their ejaculation through exercises, progress tracking and a conversational coach.</P>
      <P>Duramen <strong>is not a medical device</strong>, makes no diagnosis and is in no way a substitute for consulting a healthcare professional (general practitioner, urologist, sex therapist or psychologist).</P>
      <H>2. Access conditions — Adults only</H>
      <P>The App is strictly reserved for people <strong>aged 18 or over</strong>. By creating an account, you declare that you are of legal age. Any use by a minor is prohibited.</P>
      <H>3. User account</H>
      <P>Creating an account requires a valid email address and a password. You are responsible for keeping your credentials confidential and for all activity carried out from your account. You agree to provide accurate information in the initial questionnaire.</P>
      <H>4. Important medical disclaimer</H>
      <P>The content, exercises and advice provided by the App and by the conversational coach "Alex" are provided for <strong>educational and informational purposes</strong>. They do not constitute medical advice.</P>
      <Ul>
        <Li>Consult a doctor before starting any program if you have any doubts about your health.</Li>
        <Li>In case of pain, persistent erectile difficulty or psychological distress, consult a healthcare professional without delay.</Li>
        <Li>The orientation questionnaire may recommend a medical opinion: this recommendation should be taken seriously.</Li>
      </Ul>
      <H>5. Conversational coach (AI)</H>
      <P>The coach "Alex" is powered by artificial intelligence. Its responses are generated automatically and may contain inaccuracies. They never replace a professional's opinion. The number of daily messages may be limited.</P>
      <H>6. Acceptable use</H>
      <P>You agree not to:</P>
      <Ul>
        <Li>use the App for illegal purposes or purposes contrary to public order;</Li>
        <Li>attempt to access other users' accounts or the App's systems;</Li>
        <Li>reproduce, resell or commercially exploit the content without authorization.</Li>
      </Ul>
      <H>7. Intellectual property</H>
      <P>All content of the App (texts, exercises, design, Duramen brand) is protected by intellectual property law. Any unauthorized reproduction is prohibited.</P>
      <H>8. Liability</H>
      <P>The App is provided "as is". The publisher cannot be held responsible for the results obtained, which depend on each person's consistency, nor for any use that does not comply with these Terms or with medical recommendations.</P>
      <H>9. Modification and termination</H>
      <P>You can delete your account at any time from the "Account" page. The publisher reserves the right to modify these Terms; users will be informed of any substantial change.</P>
      <H>10. Governing law</H>
      <P>These Terms are governed by French law. For any question: <Mail />.</P>
    </div>
  )
  return (
    <div>
      <P><em>Dernière mise à jour : {LAST_UPDATE.fr}</em></P>
      <P>Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation de l'application Duramen (ci-après « l'Application »). En créant un compte et en utilisant l'Application, tu acceptes sans réserve les présentes CGU.</P>
      <H>1. Objet de l'Application</H>
      <P>Duramen est une application de <strong>bien-être et d'accompagnement comportemental</strong> destinée aux hommes adultes souhaitant améliorer le contrôle de leur éjaculation à travers des exercices, un suivi de progression et un coach conversationnel.</P>
      <P>Duramen <strong>n'est pas un dispositif médical</strong>, ne pose aucun diagnostic et ne se substitue en aucun cas à une consultation auprès d'un professionnel de santé (médecin généraliste, urologue, sexologue ou psychologue).</P>
      <H>2. Conditions d'accès — Public majeur uniquement</H>
      <P>L'Application est strictement réservée aux personnes <strong>âgées de 18 ans ou plus</strong>. En créant un compte, tu déclares être majeur. Toute utilisation par un mineur est interdite.</P>
      <H>3. Compte utilisateur</H>
      <P>La création d'un compte nécessite une adresse e-mail valide et un mot de passe. Tu es responsable de la confidentialité de tes identifiants et de toute activité réalisée depuis ton compte. Tu t'engages à fournir des informations exactes lors du questionnaire initial.</P>
      <H>4. Avertissement médical important</H>
      <P>Les contenus, exercices et conseils proposés par l'Application et par le coach conversationnel « Alex » sont fournis à titre <strong>éducatif et informatif</strong>. Ils ne constituent pas un avis médical.</P>
      <Ul>
        <Li>Consulte un médecin avant de commencer tout programme si tu as des doutes sur ta santé.</Li>
        <Li>En cas de douleur, de trouble de l'érection persistant ou de détresse psychologique, consulte sans tarder un professionnel de santé.</Li>
        <Li>Le questionnaire d'orientation peut te recommander un avis médical : cette recommandation doit être prise au sérieux.</Li>
      </Ul>
      <H>5. Coach conversationnel (IA)</H>
      <P>Le coach « Alex » repose sur une intelligence artificielle. Ses réponses sont générées automatiquement et peuvent comporter des imprécisions. Elles ne remplacent jamais l'avis d'un professionnel. Le nombre de messages quotidiens peut être limité.</P>
      <H>6. Utilisation acceptable</H>
      <P>Tu t'engages à ne pas :</P>
      <Ul>
        <Li>utiliser l'Application à des fins illégales ou contraires à l'ordre public ;</Li>
        <Li>tenter d'accéder aux comptes d'autres utilisateurs ou aux systèmes de l'Application ;</Li>
        <Li>reproduire, revendre ou exploiter commercialement le contenu sans autorisation.</Li>
      </Ul>
      <H>7. Propriété intellectuelle</H>
      <P>L'ensemble des contenus de l'Application (textes, exercices, design, marque Duramen) est protégé par le droit de la propriété intellectuelle. Toute reproduction non autorisée est interdite.</P>
      <H>8. Responsabilité</H>
      <P>L'Application est fournie « en l'état ». L'éditeur ne saurait être tenu responsable des résultats obtenus, qui dépendent de l'assiduité de chacun, ni d'un usage non conforme aux présentes CGU ou aux recommandations médicales.</P>
      <H>9. Modification et résiliation</H>
      <P>Tu peux supprimer ton compte à tout moment depuis la page « Compte ». L'éditeur se réserve le droit de modifier les présentes CGU ; les utilisateurs seront informés de toute modification substantielle.</P>
      <H>10. Droit applicable</H>
      <P>Les présentes CGU sont soumises au droit français. Pour toute question : <Mail />.</P>
    </div>
  )
}

// ─── CONFIDENTIALITÉ ──────────────────────────────────────────────────────────
function Privacy({ lang }) {
  if (lang === 'en') return (
    <div>
      <P><em>Last updated: {LAST_UPDATE.en}</em></P>
      <P>This Privacy Policy describes how Duramen ("we") collects, uses and protects your personal data, in accordance with the General Data Protection Regulation (GDPR).</P>
      <H>1. Data controller</H>
      <P>The data controller is the publisher of the App, {EDITOR}. For any request regarding your data: <Mail />.</P>
      <H>2. Data collected</H>
      <P>We collect the following data:</P>
      <Ul>
        <Li><strong>Identification data</strong>: email address, first name.</Li>
        <Li><strong>Sensitive health data</strong>: questionnaire answers (profile, frequency, feelings, habits), considered sensitive data under Article 9 of the GDPR.</Li>
        <Li><strong>Usage data</strong>: completed exercises, progress, streak, declared mood.</Li>
        <Li><strong>Exchanges with the AI coach</strong>: messages sent to "Alex".</Li>
      </Ul>
      <H>3. Legal basis and consent</H>
      <P>The processing of your health data is based on your <strong>explicit consent</strong>, given when creating your account and completing the questionnaire. You can withdraw this consent at any time by deleting your account.</P>
      <H>4. Purposes of processing</H>
      <Ul>
        <Li>offer you a personalized program suited to your profile;</Li>
        <Li>track your progress;</Li>
        <Li>enable the conversational coach to work;</Li>
        <Li>send you, with your agreement, reminders by notification.</Li>
      </Ul>
      <H>5. Hosting and subprocessors</H>
      <P>Your data is hosted by <strong>Supabase</strong> (database and authentication) and the App is deployed via <strong>Vercel</strong>. Exchanges with the AI coach are processed via <strong>OpenRouter</strong>. These providers act as subprocessors and offer security guarantees compliant with the GDPR.</P>
      <H>6. Retention period</H>
      <P>Your data is kept as long as your account is active. If you delete your account, it is erased from our databases within a reasonable time.</P>
      <H>7. Security</H>
      <P>We implement appropriate technical measures: encryption of exchanges (HTTPS), secure authentication, per-user data isolation (Row Level Security). Your sensitive keys and credentials are never publicly exposed.</P>
      <H>8. Your rights</H>
      <P>In accordance with the GDPR, you have the following rights:</P>
      <Ul>
        <Li>right of access, rectification and erasure of your data;</Li>
        <Li>right to restriction and objection to processing;</Li>
        <Li>right to data portability;</Li>
        <Li>right to withdraw your consent at any time.</Li>
      </Ul>
      <P>You can exercise most of these rights directly from the App (editing your profile, deleting your account) or by writing to us at <Mail />. You also have the right to lodge a complaint with your local data protection authority.</P>
      <H>9. Enhanced confidentiality</H>
      <P>Given the intimate nature of the data processed, we undertake never to sell, rent or share your data for advertising purposes. Your answers and your exchanges with the coach remain strictly confidential.</P>
      <H>10. Notifications</H>
      <P>Push notifications are optional and subject to your authorization. You can disable them at any time from the "Account" page or your device settings.</P>
    </div>
  )
  return (
    <div>
      <P><em>Dernière mise à jour : {LAST_UPDATE.fr}</em></P>
      <P>La présente Politique de Confidentialité décrit comment Duramen (ci-après « nous ») collecte, utilise et protège tes données personnelles, conformément au Règlement Général sur la Protection des Données (RGPD).</P>
      <H>1. Responsable du traitement</H>
      <P>Le responsable du traitement des données est l'éditeur de l'Application, {EDITOR}. Pour toute demande relative à tes données : <Mail />.</P>
      <H>2. Données collectées</H>
      <P>Nous collectons les données suivantes :</P>
      <Ul>
        <Li><strong>Données d'identification</strong> : adresse e-mail, prénom.</Li>
        <Li><strong>Données de santé sensibles</strong> : réponses au questionnaire (profil, fréquence, ressenti, habitudes), considérées comme données sensibles au sens de l'article 9 du RGPD.</Li>
        <Li><strong>Données d'usage</strong> : exercices complétés, progression, série (streak), humeur déclarée.</Li>
        <Li><strong>Échanges avec le coach IA</strong> : messages envoyés à « Alex ».</Li>
      </Ul>
      <H>3. Base légale et consentement</H>
      <P>Le traitement de tes données de santé repose sur ton <strong>consentement explicite</strong>, donné lors de la création de ton compte et du questionnaire. Tu peux retirer ce consentement à tout moment en supprimant ton compte.</P>
      <H>4. Finalités du traitement</H>
      <Ul>
        <Li>te proposer un programme personnalisé et adapté à ton profil ;</Li>
        <Li>assurer le suivi de ta progression ;</Li>
        <Li>permettre le fonctionnement du coach conversationnel ;</Li>
        <Li>t'envoyer, avec ton accord, des rappels par notification.</Li>
      </Ul>
      <H>5. Hébergement et sous-traitants</H>
      <P>Tes données sont hébergées par <strong>Supabase</strong> (base de données et authentification) et l'Application est déployée via <strong>Vercel</strong>. Les échanges avec le coach IA sont traités via <strong>OpenRouter</strong>. Ces prestataires agissent en qualité de sous-traitants et présentent des garanties de sécurité conformes au RGPD.</P>
      <H>6. Durée de conservation</H>
      <P>Tes données sont conservées tant que ton compte est actif. En cas de suppression de ton compte, elles sont effacées de nos bases dans un délai raisonnable.</P>
      <H>7. Sécurité</H>
      <P>Nous mettons en œuvre des mesures techniques appropriées : chiffrement des échanges (HTTPS), authentification sécurisée, isolation des données par utilisateur (Row Level Security). Tes clés et identifiants sensibles ne sont jamais exposés publiquement.</P>
      <H>8. Tes droits</H>
      <P>Conformément au RGPD, tu disposes des droits suivants :</P>
      <Ul>
        <Li>droit d'accès, de rectification et d'effacement de tes données ;</Li>
        <Li>droit à la limitation et à l'opposition au traitement ;</Li>
        <Li>droit à la portabilité de tes données ;</Li>
        <Li>droit de retirer ton consentement à tout moment.</Li>
      </Ul>
      <P>Tu peux exercer la plupart de ces droits directement depuis l'Application (modification du profil, suppression du compte) ou en nous écrivant à <Mail />. Tu disposes également du droit d'introduire une réclamation auprès de la CNIL.</P>
      <H>9. Confidentialité renforcée</H>
      <P>Compte tenu de la nature intime des données traitées, nous nous engageons à ne jamais vendre, louer ni partager tes données à des fins publicitaires. Tes réponses et tes échanges avec le coach restent strictement confidentiels.</P>
      <H>10. Notifications</H>
      <P>Les notifications push sont facultatives et soumises à ton autorisation. Tu peux les désactiver à tout moment depuis la page « Compte » ou les réglages de ton appareil.</P>
    </div>
  )
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────
export default function Legal() {
  const navigate = useNavigate()
  const { doc } = useParams()
  const { lang } = useLang()
  const [tab, setTab] = useState(doc === 'confidentialite' ? 'privacy' : 'cgu')

  const txt = lang === 'en'
    ? { back: 'Back', title: 'Legal information', cgu: 'Terms of use', privacy: 'Privacy' }
    : { back: 'Retour', title: 'Informations légales', cgu: 'Conditions d\'utilisation', privacy: 'Confidentialité' }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }} className="fade-in">

      <div style={{ background: 'linear-gradient(160deg, var(--primary) 0%, #3a6359 100%)', padding: '52px 20px 20px', position: 'relative' }}>
        <button onClick={() => navigate(-1)}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: 10, padding: '7px 12px', fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <i className="ti ti-arrow-left"></i> {txt.back}
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', fontWeight: 500 }}>{txt.title}</h1>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '16px 20px 0' }}>
        {[
          { id: 'cgu', label: txt.cgu },
          { id: 'privacy', label: txt.privacy },
        ].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: `1.5px solid ${tab === tb.id ? 'var(--primary)' : 'var(--border)'}`,
              background: tab === tb.id ? 'var(--primary-light)' : 'var(--bg-card)',
              color: tab === tb.id ? 'var(--primary)' : 'var(--text-muted)', transition: 'all 0.15s',
            }}>
            {tb.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 24px', paddingBottom: 'calc(90px + env(safe-area-inset-bottom, 0px))' }}>
        {tab === 'cgu' ? <CGU lang={lang} /> : <Privacy lang={lang} />}
      </div>
    </div>
  )
}
