import React, { useState } from "react";
import { Segment, Dimmer, Loader, Image } from "semantic-ui-react";

function LoadingPlaceholder() {
  return (
    <Segment>
      <Dimmer active>
        <Loader />
      </Dimmer>
      <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
    </Segment>
  );
}

export default LoadingPlaceholder;
