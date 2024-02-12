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

const cosmoDBApi = isLocal
  ? "http://localhost:8080"
  : "https://azure-feature-flags-api.azurewebsites.net";

function App() {
  const [flags, setFlags] = useState<FeatureFlag>({
    enabledHeader: false,
    enabledFooter: false,
  });

  const [configurations, setConfigurations] = useState<Configuration>();

  const fetchCosmoDBFeatureFlags = () => {
    axios
      .post<ApiResponse>(`${cosmoDBApi}/config-cosmos`, {
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

  useEffect(() => {
    fetchCosmoDBFeatureFlags();
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
          <button onClick={() => azureAppConfig()}>Azure App config</button>
        </div>
      </div>
    </>
  );
}

export default App;
