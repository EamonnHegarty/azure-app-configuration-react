import { AppConfigurationClient } from "@azure/app-configuration";

const client = new AppConfigurationClient(
  `${import.meta.env.VITE_APP_CONFIG_CONNECTION_STRING}`
);

//TODO: Add Connection String copied from Access Keys Step

async function azureAppConfig() {
  const retrievedSetting = await client.getConfigurationSetting({
    key: ".appconfig.featureflag/enabled-app-config",
    label: "enabled-app-config",
  });

  console.log("Retrieved value:", retrievedSetting.value);
}

export { azureAppConfig };
