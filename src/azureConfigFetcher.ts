import { AppConfigurationClient } from "@azure/app-configuration";

const client = new AppConfigurationClient(
  "Endpoint=https://azure-feature-flags-app-config.azconfig.io;Id=Mb8z;Secret=NXVJy2tHMXKKx6NvS8zb4riFzbErcYpEh7H4B/chcUM="
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
