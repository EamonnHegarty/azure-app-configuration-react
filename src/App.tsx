import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { azureAppConfig } from "./azureConfigFetcher.ts";

type FeatureFlag = {
  enabledHeader: boolean;
  enabledFooter: boolean;
};

type Configuration = {
  configurations: [];
};

type ApiResponse = {
  flags: FeatureFlag;
  configuration: Configuration;
};

const isLocal = import.meta.env.VITE_APP_ENV === "local";

const api = isLocal
  ? "http://localhost:8080"
  : "https://azure-feature-flags-api.azurewebsites.net";

function App() {
  const [flags, setFlags] = useState<FeatureFlag>({
    enabledHeader: false,
    enabledFooter: false,
  });

  const [appConfigFlags, setAppConfigFlags] = useState({
    enabledHeader: false,
    enabledFooter: false,
  });

  const [configurations, setConfigurations] = useState<Configuration>();
  const [appConfigurations, setAppConfigurations] = useState([]);

  const fetchCosmosDBConfig = () => {
    axios
      .post<ApiResponse>(`${api}/config-cosmos`, {
        tenant: "EU",
      })
      .then((response) => {
        const { flags, configuration } = response.data;
        setFlags(flags);
        setConfigurations({ configurations: configuration as unknown as [] });
      })
      .catch((error) => {
        console.error("Error fetching feature flags:", error);
      });
  };

  const fetchAzureAppConfig = () => {
    axios
      .get(`${api}/config-app-config`)
      .then((response) => {
        const featureFlags = response?.data?.featureFlags;
        setAppConfigurations(response?.data);
        const flags = {
          enabledHeader: false,
          enabledFooter: false,
        };

        featureFlags?.forEach(
          (flag: { key: string; value: { enabled: unknown } }) => {
            if (
              flag.key === ".appconfig.featureflag/enabledHeader" &&
              flag.value.enabled
            ) {
              flags.enabledHeader = true;
            }
            if (
              flag.key === ".appconfig.featureflag/enabledFooter" &&
              flag.value.enabled
            ) {
              flags.enabledFooter = true;
            }
          }
        );

        setAppConfigFlags(flags);
      })
      .catch((error) => {
        console.error("error azure app config", error);
      });
  };

  useEffect(() => {
    fetchCosmosDBConfig();
    fetchAzureAppConfig();
  }, []);

  return (
    <>
      <div className="container">
        <div className="divItem">
          <h1>CosmoDB Implementation</h1>
          {flags.enabledHeader && <h1>The Header</h1>}
          <button onClick={() => console.log([flags, configurations])}>
            Log Data
          </button>
          {flags.enabledFooter && <h1 style={{ marginTop: 10 }}>The Footer</h1>}
        </div>
        <div className="divItem">
          <h1>App Config Implementation</h1>
          {appConfigFlags.enabledHeader && <h1>The Header</h1>}
          <button onClick={() => console.log(appConfigurations)}>
            Azure App config
          </button>
          {appConfigFlags.enabledFooter && <h1>The Footer</h1>}
        </div>
      </div>
    </>
  );
}

export default App;
