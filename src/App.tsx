import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

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
  const [enabledHeader, setEnabledHeader] = useState(false);
  const [enabledFooter, setEnabledFooter] = useState(false);
  const tenant = import.meta.env.VITE_TENANT;

  const fetchFeatureFlags = () => {
    axios
      .post(`${api}/feature-flags`, {
        tenant: tenant,
      })
      .then((response) => {
        setFeatureFlags(response.data);
      })
      .catch((error) => {
        console.error("Error fetching feature flags:", error);
      });
  };

  useEffect(() => {
    fetchFeatureFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (featureFlags.length > 0) {
      const { flags } = featureFlags[0];
      setEnabledHeader(flags.enabledHeader);
      setEnabledFooter(flags.enabledFooter);
    }
  }, [featureFlags]);

  return (
    <>
      {enabledHeader && <h1>The Header</h1>}
      <button
        onClick={() =>
          console.log([featureFlags, enabledHeader, enabledFooter])
        }
      >
        Log Data
      </button>
      {enabledFooter && <h1 style={{ marginTop: 10 }}>The Footer</h1>}
    </>
  );
}

export default App;
