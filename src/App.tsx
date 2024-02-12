import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { azureAppConfig } from "./azureConfigFetcher.ts";

const isLocal = import.meta.env.VITE_APP_ENV === "local";

type FeatureFlag = {
  enabledHeader: boolean;
  enabledFooter: boolean;
};

type FeatureFlagResponse = {
  id: string;
  flags: FeatureFlag;
};

const api = isLocal
  ? "http://localhost:8080"
  : "https://azure-feature-flags-api.azurewebsites.net";

function App() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagResponse[]>([]);
  const [enabledCosmoHeader, setenabledCosmoHeader] = useState(false);
  const [enabledCosmoFooter, setenabledCosmoFooter] = useState(false);

  const fetchCosmoDBFeatureFlags = () => {
    axios
      .post(`${api}/feature-flags`, {
        tenant: "EU",
      })
      .then((response) => {
        setFeatureFlags(response.data);
      })
      .catch((error) => {
        console.error("Error fetching feature flags:", error);
      });
  };

  useEffect(() => {
    fetchCosmoDBFeatureFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (featureFlags.length > 0) {
      const { flags } = featureFlags[0];
      setenabledCosmoHeader(flags.enabledHeader);
      setenabledCosmoFooter(flags.enabledFooter);
    }
  }, [featureFlags]);

  return (
    <>
      <div className="container">
        <div className="divItem">
          <h1>CosmoDB Implementation</h1>
          {enabledCosmoHeader && <h1>The Header</h1>}
          <button
            onClick={() =>
              console.log([
                featureFlags,
                enabledCosmoHeader,
                enabledCosmoFooter,
              ])
            }
          >
            Log Data (eventually config)
          </button>
          {enabledCosmoFooter && <h1 style={{ marginTop: 10 }}>The Footer</h1>}
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
