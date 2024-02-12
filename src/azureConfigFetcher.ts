import { AppConfigurationClient } from "@azure/app-configuration";

const client = new AppConfigurationClient(
  `${import.meta.env.VITE_APP_CONFIG_CONNECTION_STRING}`
);

async function azureAppConfig() {
  const retrievedSetting = await client.getConfigurationSetting({
    key: ".appconfig.featureflag/enabled-app-config",
    label: "enabled-app-config",
  });

  console.log("Retrieved value:", retrievedSetting.value);
}

export { azureAppConfig };
