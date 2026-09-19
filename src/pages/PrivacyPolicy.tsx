export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 text-left text-base leading-relaxed">
      <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>

      <p className="mb-6 text-sm text-gray-300">Last updated: September 2026</p>

      <p className="mb-6">
        This policy covers Linguistle and reflects the site as it actually works
        today. If anything here is unclear, please contact us using the link in
        the footer.
      </p>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">Playing as a guest</h2>
      <p className="mb-4">
        You can play Linguistle without creating an account. As a guest, your
        streaks and game data will not be saved on your browser. A
        non-identifying version of your daily result may be sent to our database
        so it can contribute to aggregate daily stats, but it is not linked to
        your personal identity.
      </p>
      <p>
        If you later create an account on the same device and browser, guest
        progress will not automatically transfer to your account. You will start
        fresh with a new account, and your guest data will remain anonymous and
        separate.
      </p>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">
        What we collect if you create an account
      </h2>
      <ul className="mb-6 list-disc pl-6">
        <li>
          <strong>Email address</strong>, used for sign-in, account recovery,
          and account-related communication.
        </li>
        <li>
          <strong>Username</strong>, if you choose to set one, which may be
          displayed in public ranking or account-related views.
        </li>
        <li>
          <strong>Game data</strong>, including scores, daily progress, solved
          puzzles, streaks, and related activity needed to power your stats and
          history.
        </li>
        <li>
          <strong>Account metadata</strong>, such as your authentication status
          and preferences tied to your profile.
        </li>
      </ul>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">
        Accounts and authentication
      </h2>
      <p className="mb-4">
        Account sign-in is handled by <strong>Supabase</strong>, our backend and
        authentication provider. If you sign in with Google, Google shares your
        email and basic profile information with us for that purpose, in line
        with Google’s own sign-in permissions and the consent you provide during
        login.
      </p>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">
        Service providers we use
      </h2>
      <ul className="mb-6 list-disc pl-6">
        <li>
          <strong>Netlify</strong>: hosting and content delivery for the site
          itself.
        </li>
        <li>
          <strong>Supabase</strong>: authentication, account management, and
          game data storage.
        </li>
        <li>
          <strong>Google Analytics</strong>: traffic and usage analytics to
          understand how the app is used and improve the experience.
        </li>
      </ul>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">Analytics</h2>
      <p className="mb-4">
        We use <strong>Google Analytics (GA4)</strong> to understand overall
        traffic and app usage, including things like page views, broad location
        data such as country or region, device type, and which pages are
        visited. This data is aggregated and used to improve the product; it is
        not used to identify you as an individual.
      </p>
      <p>
        You can opt out of Google Analytics tracking by using the Google
        Analytics Opt-out Browser Add-on or by using a browser or extension that
        blocks analytics scripts.
      </p>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">
        Cookies and local storage
      </h2>
      <p className="mb-4">
        Linguistle does not yet use cookies for tracking or advertising
        purposes. We may use cookies in the future for things like remembering
        your preferences or login state, or keeping track of guest progress; we
        will not use them to track you across other sites.
      </p>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">What we do not do</h2>
      <p className="mb-4">
        We do not sell your data to anyone. We do not share your personal
        information with third parties except where it is genuinely necessary to
        run the service, such as the providers listed above, or where required
        by law. We just want you to have a good time playing Linguistle and want
        to foster a safe and respectful community, not to monetize your personal
        data.
      </p>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">
        Your data, your choices
      </h2>
      <p className="mb-4">
        You can update your username or account details at any time from your
        account page. You can also delete your account and associated data from
        the same account area. Account deletion cannot be undone.
      </p>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">Children’s privacy</h2>
      <p className="mb-4">
        Linguistle is not directed at children under 13, and we do not knowingly
        collect personal information from children under 13. If you believe a
        child has provided us with personal information, please contact us and
        we will remove it.
      </p>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">
        If you are in the EU, UK, or a similar jurisdiction
      </h2>
      <p className="mb-4">
        Depending on where you are located, you may have rights to access,
        correct, or delete personal data we hold about you, and to object to
        certain processing. If you want to exercise those rights or ask
        questions about what data we store, please contact us and we will
        respond.
      </p>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">
        Changes to this policy
      </h2>
      <p className="mb-4">
        If this policy changes in a meaningful way, we will update the date at
        the top of this page.
      </p>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">Contact</h2>
      <p>
        Questions about this policy can go to{" "}
        <a
          className="underline text-red-200 hover:text-red-100"
          href="mailto:brankamgg@gmail.com"
        >
          brankamgg@gmail.com
        </a>
        .
      </p>
    </div>
  );
}
