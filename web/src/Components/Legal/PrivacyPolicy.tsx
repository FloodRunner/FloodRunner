import React from "react";
import { Segment } from "semantic-ui-react";

function PrivacyPolicy() {
  const companyName = "FloodRunner";
  const websiteUrl = "https://app.floodrunner.dev";
  const supportEmailAddress = "floodrunnerdev@gmail.com";

  return (
    <Segment>
      <h1 id="privacy-policy">Privacy policy</h1>
      <p>Last updated: June 30, 2020</p>
      <hr />
      <p>
        The {companyName} service (hereinafter “Service”) provides this Privacy
        Policy to inform users of our policies and procedures regarding the
        collection, use and disclosure of information received from users of
        this website, located at <a href={websiteUrl}>{websiteUrl}</a> (“Site”),
        as well as all related websites, applications, and other services
        provided by us (collectively, together with the Site, our “Service”).
      </p>
      <p>
        By using our Service you are consenting to our Processing of your
        information as set forth in this Privacy Policy now and as amended by
        us. “Processing” means using cookies on a computer or using or accessing
        such information in any way, including, but not limited to, collecting,
        storing, deleting, using, combining and disclosing information.
      </p>
      <p>
        <strong>TL;DR:</strong>
      </p>
      <ul>
        <li>We will not sell your data to anyone.</li>
        <li>
          We will send you some emails regarding product updates and such.
        </li>
        <li>
          If you log in with a third party provider (Google, GitHub etc.) we
          will read some data from that account.
        </li>
        <li>We use services like Auth0 to securely log you in.</li>
        <li>
          We use services like Google Analytics to see how you interact with the
          product.
        </li>
        <li>
          We use 3rd party providers like Azure to process and store our data.
        </li>
      </ul>
      <h2 id="1-information-collection-and-use">
        1. Information Collection and Use
      </h2>
      <p>
        Our primary goals in collecting information from you is to provide you
        with the products and services made available through the Service, to
        communicate with you, and to manage your registered user account, if you
        have one.
      </p>
      <p>
        We may also use your information to operate, maintain, and enhance the
        Service and its features, and to provide customer support to users.
      </p>
      <h2 id="2-information-collected-upon-registration">
        2. Information Collected Upon Registration
      </h2>
      <p>
        You provide us with information when you register for an account, use
        the Service, make a purchase on the Service, or send us customer
        service-related requests. If you desire to have access to certain
        restricted sections of the Site, you will be required to become a
        registered user, and to submit certain personally identifiable
        information to {companyName}. This happens in a number of instances,
        such as when you sign up for the Service, or if you desire to receive
        marketing materials and information. Information that we may collect in
        such instances may include your IP address, full user name, password,
        email address, city, time zone, credit card and other billing
        information, preferences, telephone number, and other information that
        you decide to provide us with. We may link such information with other
        information you provide about yourself.
      </p>
      <h2 id="3-use-of-google-user-data">3. Use of Google User Data</h2>
      <p>
        If you choose to connect a Google profile to your
        {companyName} account, we will access certain information obtained from
        Google regarding your account. In particular we may store your name and
        email address. This data will only be used by {companyName} to provide
        you with the service you expect and will not be shared with any third
        parties.
      </p>
      <h2 id="4-use-of-contact-information">4. Use of Contact Information</h2>
      <p>
        In addition, we may use your contact information to market to you, and
        provide you with information about, our products and services, including
        but not limited to our Service. If you decide at any time that you no
        longer wish to receive such information or communications from us,
        please un-follow us, or follow the unsubscribe instructions provided in
        any of the communications. You may also opt out from receiving
        commercial email from us by sending your request to us by email at{" "}
        <a href={supportEmailAddress}>{supportEmailAddress}</a>.
      </p>
      <h2 id="5-log-data">5. Log Data</h2>
      <p>
        When you visit the Site, our servers automatically record information
        that your browser sends whenever you visit a website (“Log Data”). This
        Log Data may include information such as your IP address, browser type
        or the domain from which you are visiting, the web-pages you visit, the
        search terms you use, and any advertisements on which you click. For
        most users accessing the Internet from an Internet service provider the
        IP address will be different every time you log on. We use Log Data to
        monitor the use of the Site and of our Service, and for the Site’s
        technical administration. We do not associate your IP address with any
        other personally identifiable information to identify you personally.
      </p>
      <h2 id="6-cookies-and-automatically-collected-information">
        6. Cookies and Automatically Collected Information
      </h2>
      <p>
        Like many websites, we also use “cookie” technology to collect
        additional website usage data and to improve the Site and our Service. A
        cookie is a small data file that we transfer to your computer's hard
        disk. We do not use cookies to collect personally identifiable
        information. {companyName} may use both session cookies and persistent
        cookies to better understand how you interact with the Site and our
        Service, to monitor aggregate usage by our users and web traffic routing
        on the Site, and to improve the Site and our services. A session cookie
        enables certain features of the Site and our service and is deleted from
        your computer when you disconnect from or leave the Site. A persistent
        cookie remains after you close your browser and may be used by your
        browser on subsequent visits to the Site. Persistent cookies can be
        removed by following your web browser help file directions. Most
        Internet browsers automatically accept cookies. You can instruct your
        browser, by editing its options, to stop accepting cookies or to prompt
        you before accepting a cookie from the websites you visit. Please note
        that if you delete, or choose not to accept, cookies from the Service,
        you may not be able to utilize the features of the Service to their
        fullest potential. {companyName}
        does not process or respond to web browsers’ “do not track” signals or
        other similar transmissions that indicate a request to disable online
        tracking of users who use our Service.
      </p>
      <p>
        We may also automatically record certain information from your device by
        using various types of technology, including “clear gifs” or “web
        beacons.” This automatically collected information may include your IP
        address or other device address or ID, web browser and/or device type,
        the web pages or sites that you visit just before or just after you use
        the Service, the pages or other content you view or otherwise interact
        with on the Service, and the dates and times that you visit, access, or
        use the Service. We also may use these technologies to collect
        information regarding your interaction with email messages, such as
        whether you opened, clicked on, or forwarded a message. This information
        is gathered from all users, and may be connected with other information
        about you.
      </p>
      <h3 id="google-analytics">Google Analytics</h3>
      <p>
        We use Google Analytics to measure the effectiveness of our website.
      </p>
      <h2 id="7-third-parties">7. Third Parties</h2>
      <p>
        Some of your personal data is shared with third party service providers:
      </p>
      <h3 id="paypal">PayPal</h3>
      <p>
        PayPal handles our payment. Your credit card data, name, address and
        email address are securely stored and processed by PayPal. We don't have
        access to your credit card number or CVC.
      </p>
      <h3 id="auth0">Auth0</h3>
      <p>
        We use Auth0 as a identity provider. Auth0 stores any password you may
        provide when opting to use email login. We do not have access to this
        password.
      </p>
      <h2 id="8-security">8. Security</h2>
      <p>
        {companyName} is very concerned about safeguarding the confidentiality
        of your personally identifiable information. Please be aware that no
        security measures are perfect or impenetrable. We cannot and do not
        guarantee that information about you will not be accessed, viewed,
        disclosed, altered, or destroyed by breach of any of our administrative,
        physical, and electronic safeguards. We will make any legally-required
        disclosures of any breach of the security, confidentiality, or integrity
        of your unencrypted electronically stored personal data to you via email
        or conspicuous posting on this Site in the most expedient time possible
        and without unreasonable delay, consistent with (i) the legitimate needs
        of law enforcement or (ii) any measures necessary to determine the scope
        of the breach and restore the reasonable integrity of the data system.
      </p>
    </Segment>
  );
}

export default PrivacyPolicy;
