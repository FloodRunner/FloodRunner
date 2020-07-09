import React, { useEffect, useState } from "react";
import { Button, Icon, Segment, Container } from "semantic-ui-react";

function TermsOfService() {
  const companyName = "FloodRunner";
  const websiteUrl = "https://app.floodrunner.dev";
  const softwareDescription = `
  The Software enables you to monitor Flood Element (https://element.flood.io/) tests by uploading them to the
  platform and run them on a schedule, additionally giving insights on those test runs by showing log information
  and test status.
  `;
  const supportEmailAddress = "support.floodrunner@gmail.com";

  return (
    <Segment>
      <h1>Terms of service</h1>
      <p>Last updated: June 30, 2020</p>
      <hr />
      <h2>1. Terms</h2>
      <p>
        These Terms of service (the
        <strong>“Terms”</strong> ) establish the terms and conditions of use of
        the online software as a service offered by the {companyName} team (
        <strong>“{companyName}”</strong> ) to users (the
        <strong>“User(s)”</strong> ) through the website {websiteUrl}, mobile
        applications, application program interfaces, social media platforms,
        all together or each separately are referred to as the
        <strong>"Software"</strong>. {companyName} sells the software licenses
        for the Software along with the add-ons, built-in services and technical
        support.
      </p>
      <p>{companyName} is also referred to as “we” (“us”, “our”).</p>
      <p>
        Users in definition of the Terms are individual private person(s) or
        legal entity making use of the Software. Users are also referred to as
        “you” (“your”).
      </p>
      <p>{softwareDescription}</p>
      <p>You cannot use the Software without accepting these Terms.</p>
      <p>By accepting these Terms you agree and confirm that:</p>
      <p>
        <input defaultChecked disabled type="checkbox" /> you have read,
        understood, and agreed to be bound by these Terms;
      </p>
      <p>
        <input defaultChecked disabled type="checkbox" /> you assume all the
        obligations set forth herein;
      </p>
      <p>
        <input defaultChecked disabled type="checkbox" /> you are of sufficient
        legal age and capacity to use the Software;
      </p>
      <p>
        <input defaultChecked disabled type="checkbox" /> you use the Software
        at your discretion and under your own responsibility.
      </p>
      <h2>2. Registration</h2>
      <p>
        For using the Software you shall to register in the Software by creating
        an account at website and/or mobile application.
      </p>
      <p>
        You should protect login credentials of your registered account and keep
        your password, api keys, security answers in strict secrecy. We
        reasonably suppose that all the actions taken from your account are done
        personally by you or under your direct supervision. If you assume that
        login credentials of your account are compromised (e.g. the password has
        become known to anyone else, or the password is likely to be used in an
        unauthorized manner) you must immediately inform {companyName}
        about it.
      </p>
      <p>
        You agree to provide and keep in up-to-date and accurate condition
        information in your account (your personal data) to the extent that is
        necessary for the proper operation of the Software and may be required
        by the law or regulation of jurisdiction related to you, {companyName},{" "}
        {companyName} affiliated partners and/or any other interested third
        parties. {companyName} respects your privacy and complies with local
        relevant legislation.
      </p>
      <p>
        Likewise, {companyName} reserves the right to limit access to the
        registration to Users that are considered unsuitable for the
        characteristics and purposes of the Software.
      </p>
      <h2>3. Payments</h2>
      <p>
        The Software is provided on subscription basis fee or commission fee,
        except the trial period for just registered new Users. The duration of
        trial period is subject to change and a trial is not always garunteed.
        All offers and free trials on the Software are without any obligations
        from {companyName}.
      </p>
      <p>The fee for the Software may vary depending on:</p>
      <p>a. the subscription plan;</p>
      <p>b. included and add-on services;</p>
      <p>c. prepaid period;</p>
      <p>d. your location (country, state);</p>
      <p>e. currently available discounts and promotions.</p>
      <p>
        The specific functionalities shall be as specified in the corresponding
        section of the Software. The fees may be adjusted by {companyName} at
        any time and such changes take effect immediately.
      </p>
      <p>
        Users can cancel the subscription by the end of the end of the term
        already paid for. The account of the User will remain active for the
        period that User has already paid for.
      </p>
      <p>
        Additional taxes may be applied and/or included depending on your
        location (country, state).
      </p>
      <p>
        Additional fees may be applied depending on the payment method you
        choose (e.g. PayPal, bank card, e-money etc.). We always inform you on
        the final payment amount and frequency of payments prior the payment
        transaction is sent to payment provider processing system or prior you
        are redirected to payment provider interface. Extra fees for payment
        processing may be applied by your payment provider, issuer bank or
        intermediary which are beyond our control.
      </p>
      <p>
        You can use any available and the most convenient payment method from
        currently available in the Software. {companyName} never guarantees the
        availability of any payment method at any moment. {companyName} may add,
        remove or suspend any payment method temporarily or permanently by its
        own discretion.
      </p>
      <h2>4. Withdrawal</h2>
      <p>
        Due to the nature of the Software as a digital product, no refunds are
        granted without clear, justified and legitimate reasons.
      </p>
      <p>
        In any case, if you take advantage of the trial period you have no
        permission and right for refund.
      </p>
      <h2>5. Fair use of our Software</h2>
      <p>
        By using the Software, you with full responsibility declare that you are
        at least 18 years old and the legislation of the country of your
        citizenship or residence doesn't prohibit of making payments for the
        Software and using the Software.
      </p>
      <p>
        You agree to use the Software and built-in services in full compliance
        with your local relevant legislation, the European Union and
        international common laws, keeping the due respect to other users.
      </p>
      <p>
        As a mandatory condition for using the Software, you agree not to
        provide us any information, data or content that is incorrect,
        inaccurate, incomplete, out-of-date or that violates any law or
        regulation of jurisdiction related to you, {companyName}, {companyName}{" "}
        affiliated partners and/or any other interested third parties.
      </p>
      <p>
        In addition you responsibly agree that you shall not neither personally
        nor by allowing third parties to:
      </p>
      <p>a. transfer your login credentials to third parties by any means;</p>
      <p>
        b. use any content that is insulting or defamatory, law protected or
        which violates the applicable laws for the protection of minors,
        regardless of whether this content is directed at another user, other
        persons or businesses;
      </p>
      <p>
        c. send malicious software, viruses, worms, junk mail, spam, chain
        letters, unsolicited offers or ads of any kind and for any purpose;
      </p>
      <p>
        d. hack, gain an unauthorized access or breach the security of the
        Software including, but not limited to obtaining illegal access to
        Software codes, configurations, components etc.;
      </p>
      <p>e. use automated scripts or macros, overload the Software;</p>
      <p>
        f. influence and interfere on operation of the Software using external
        factors and undocumented features;
      </p>
      <p>g. disseminate and publicly reproduce Software contents;</p>
      <p>
        h. create and distribute copies, deploy mirrors and/or aliases of the
        Software or its components, including, but not limited to
        indistinguishables;
      </p>
      <p>
        i. attempt to sell, distribute, copy, rent, sub-license, loan, merge,
        reproduce, alter, modify, reverse engineer, disassemble, decompile,
        transfer, exchange, translate, hack, distribute, harm or misuse the
        Software.
      </p>
      <p>
        You have no right to create an account under someone else’s name or act
        like someone else in any other way.
      </p>
      <p>
        In case the account concerns a corporate account, only an authorized
        person is allowed to register the corporate account and use the
        Software.
      </p>
      <p>
        {companyName} is entitled to (temporarily or permanently) block your
        account and deny you access to the Software, if we suspect abuse of the
        account or the Software.
      </p>
      <h2>6. Intellectual property</h2>
      <p>
        The industrial and intellectual property rights over the protected
        services and any content or element used in conjunction or to ensure the
        functionality of the Software belong to their legitimate owners. Users
        shall not obtain, as a result of the use of the Software, any right,
        title, or interest in intellectual or industrial property, nor any
        license of any use on mentioned above services, content and/or elements.
      </p>
      <p>
        {companyName} is the exclusive owner of all intellectual property rights
        vesting in and relating to the Software, such as, but not limited to –
        patents, patent applications, trademarks, trademark applications,
        database rights, service marks, trade names, copyrights, trade secrets,
        domain names, know-how, property rights and processes
        {companyName} grants to User a non-transferable, non-exclusive,
        non-sublicensable and revocable license intended for fair use of the
        Software.
      </p>
      <p>
        The license for the Software in accordance with the Terms is granted to
        you after the payment for relevant period is made, except trial period.
      </p>
      <h2>7. Liability</h2>
      <p>
        We shall never be liable to you for any (direct or indirect) damage you
        suffer as a result of the use of the Software or the content provided
        thereon. In addition, and without limitation, {companyName}
        shall never be liable for the damages and losses of any nature derived
        from:
      </p>
      <p>
        a. possible inaccuracy or possible misrepresentation of the data
        provided by the Software or other users;
      </p>
      <p>
        b. the proper functioning of different platforms that operate in the
        network, including, but not limited to your email server, internet
        connectivity,
      </p>
      <p>
        c. contents, information, opinions and statements expressed by third
        parties or entities that are communicated or displayed through the
        Software;
      </p>
      <p>d. the proper functioning of links provided by the Software;</p>
      <p>
        e. the quality of any template provided by any user in the Software;
      </p>
      <p>
        f. the (lack of) financial benefit for the you through the use of the
        Software;
      </p>
      <p>
        g. the eventual loss of data for reasons not attributable to the
        Software;
      </p>
      <p>
        h. the unavailability, errors, access failures and lack of continuity of
        the Software as well as difficulty or inability to download or access
        content;
      </p>
      <p>
        i. faults or incidents that may occur in communications, deletion or
        incomplete transmissions;
      </p>
      <p>
        j. the use that you may make of the Software materials, whether
        forbidden or permitted, that infringe intellectual and/or industrial
        property rights, confidential information, Service contents or content
        of third parties;
      </p>
      <p>k. Acts of false advertising and unfair competition;</p>
      <p>l. the access of minors to the contents included in the Service;</p>
      <p>
        m. any situation where your equipment, login credentials and/or keys are
        stolen and any third party subsequently makes use the Software without
        your consent;
      </p>
      <p>
        n. any damage or alteration to your equipment including but not limited
        to computer equipment or a handheld device as a result of the
        installation or use of the Software;
      </p>
      <p>
        o. a failure to meet any of {companyName} obligations under these Terms
        where such failure is due to events beyond {companyName}'s reasonable
        control
      </p>
      <p>
        To the maximum extent permitted by applicable law, {companyName}
        hereby disclaims all implied warranties regarding the availability of
        the Software. The Software are provided "as is" and "as available"
        without warranty of any kind.
      </p>
      <h2>8. Exclusion of Users and Closing of Accounts</h2>
      <p>
        If {companyName} detects unauthorized or suspicious actions with your
        account, it may be temporarily blocked until all circumstances have been
        clarified. The account can also be blocked permanently if clarifications
        are not provided by you at the requested time in full.
      </p>
      <p>
        Users who violate the Terms, the law or morality in force are subjected
        to be blocked access to the Software and shall assume sole
        responsibility for the damages and consequences thereof, releasing{" "}
        {companyName} from all liability.
      </p>
      <p>
        You may close your {companyName} account at any time by contacting{" "}
        {companyName} support. Please note that:
      </p>
      <p>
        a. closing of account also implies the end of agreement between{" "}
        {companyName} and you;
      </p>
      <p>
        b. you agree that you will continue to be responsible for all
        obligations related to your {companyName} account even after it is
        closed.
      </p>
      <h2>9. Support and Contacts</h2>
      <p>
        We recommend contacting us for assistance if you experience any issues
        regarding the Software in the following ways:
      </p>
      <p>
        a. by sending email to customer support at
        <a href="">{supportEmailAddress}</a>.
      </p>
      <p>
        {" "}
        {companyName} only provides support services for the operation of the
        Software. We do not provide:
      </p>
      <p>a. recommended settings for operation the Software;</p>
      <p>b. integration advice related to Flood Element tests</p>
      <p>
        {companyName} usually contacts you via email or embedded chat. For this
        purpose, you must at all times maintain at least one valid email address
        in your {companyName} account profile and check for incoming messages
        regularly and frequently.
      </p>
      <h2>10. Indemnification</h2>
      <p>
        Users herby indemnify, defend, and hold {companyName} free from any
        liabilities, damages and costs (including settlement costs and
        reasonable attorneys’ fees) arising out of third party claims regarding:
      </p>
      <p>
        a. any injury or damages resulting from behaviour of User related to the
        use of our Software;
      </p>
      <p>
        b. breach by User of these Terms or violation of any applicable law,
        regulation or order.
      </p>
      <p>
        {companyName} shall being accountable, at most, for the amount directly
        received by {companyName} from User, net of direct and transaction
        costs, and excluding, in all cases, liability for indirect damages or
        loss of profits.
      </p>
      <h2>11. Change of Terms</h2>
      <p>
        {companyName} reserves the right to change these Terms at any time on
        its own discretion. When the Terms are changed in a significant way, we
        may notify Users via the Software. Users are entirely obligated to track
        changes and updates of the Terms
      </p>
      <p>
        By continuing to use the Software you acknowledge your agreement with
        most recent version of the Terms.
      </p>
      <h2>12. Severability</h2>
      <p>
        The invalidity or unenforceability of any provision of these Terms shall
        not affect the validity or enforceability of any other provision of
        these Terms. Any such invalid or unenforceable provision shall be
        replaced or be deemed to be replaced by a provision that is considered
        to be valid and enforceable and which interpretation shall be as close
        as possible to the intent of the invalid provision.
      </p>
      <h2>13. Applicable law and jurisdiction</h2>
      <p>
        These Terms shall exclusively be governed by and construed in accordance
        with the laws of the Republic of South Africa. All disputes resulting
        from or arising in connection with these Terms shall be exclusively
        submitted to the competent court of South Africa, unless the dispute can
        be settled by negotiation.
      </p>
    </Segment>
  );
}

export default TermsOfService;
