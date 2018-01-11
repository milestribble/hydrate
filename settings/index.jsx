function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Fitbit Account</Text>}>
        <Webconfig
            settingsKey="user"
            label="Login"
            disabled={false}
            showError={true}
            constructUrl={(returnUrl, callbackUrl) => {
              return "https://fitbit-auth.herokuapp.com/oauth?redirect_uri=" + callbackUrl;
            }}
            onReturn={(queryString) => {
              console.log("Returned " + queryString);
              props.settingsStorage.setItem('user',queryString.split('=')[1])
              return queryString.split('=')[1]
            }}
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
