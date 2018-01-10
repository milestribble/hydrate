function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Fitbit Account</Text>}>
        <Oauth
          settingsKey="oauth"
          title="Login"
          label="Fitbit"
          status="Login"
          authorizeUrl="https://www.fitbit.com/oauth2/authorize"
          requestTokenUrl="https://api.fitbit.com/oauth2/token"
          clientId= // CLIENT ID GOES HERE
          clientSecret= // CLIENT SECRET GOES HERE
          scope="nutrition"
        />
      </Section>
      <Section title={<Text bold align="center">Default volume</Text>}>
        <TextInput
          label="# of Ounces"
          settingsKey="volume"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
