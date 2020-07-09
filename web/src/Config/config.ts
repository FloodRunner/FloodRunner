const envSettings = window as any;
export class Config {
  static auth0_domain = envSettings.AUTH0_DOMAIN;
  static auth0_clientId = envSettings.AUTH0_CLIENTID;
  static auth0_scopes = envSettings.AUTH0_SCOPES;
  static auth0_audience = envSettings.AUTH0_AUDIENCE;

  static floodrunner_api_url = envSettings.FLOODRUNNER_API_URL;
}
