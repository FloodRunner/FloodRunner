import React from "react";
import { Image, Segment, Container, List } from "semantic-ui-react";
import logoSrc from "../../../images/logo_compact.png";
import "./footer-styles.css";

function Footer() {
  const supportEmailAddress = "floodrunnerdev@gmail.com";
  return (
    <Segment inverted vertical>
      <Container textAlign="center">
        <Image centered src={logoSrc} className="floodrunner-footer-logo" />
        <p style={{ paddingTop: "5px" }}>
          Contact {supportEmailAddress} for support or feedback.
        </p>
        <List horizontal inverted divided link size="small">
          <List.Item as="a" href="/legal/termsofservice">
            Terms and Conditions
          </List.Item>
          <List.Item as="a" href="/legal/privacypolicy">
            Privacy Policy
          </List.Item>
        </List>
      </Container>
    </Segment>
  );
}

export default Footer;
