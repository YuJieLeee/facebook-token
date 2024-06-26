import { useState, useEffect } from "react";

import "./App.css";

type AuthResponse = {
  accessToken?: string | undefined;
  data_access_expiration_time?: number | undefined;
  expiresIn: number;
  signedRequest?: string | undefined;
  userID: string;
  grantedScopes?: string | undefined;
  reauthorize_required_in?: number | undefined;
  code?: string | undefined;
};

type LoginStatus =
  | "authorization_expired"
  | "connected"
  | "not_authorized"
  | "unknown";

type LoginResponse = {
  status: LoginStatus;
  authResponse: AuthResponse;
};

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

function initFbSdk() {
  window.fbAsyncInit = function () {
    // 初始化 Facebook SDK
    window.FB.init({
      appId: "886324872822608",
      cookie: true,
      xfbml: true,
      version: "v19.0",
    });

    console.log("[fbAsyncInit] after window.FB.init");

    // 取得使用者登入狀態
    window.FB.getLoginStatus(function (response: LoginResponse) {
      console.log("[refreshLoginStatus]", response);
      console.log("token in init", response?.authResponse?.accessToken);
    });

    window.FB.AppEvents.logPageView();
  };
}

function loadFbSdk() {
  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s) as HTMLScriptElement;
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs?.parentNode?.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
}

function App() {
  const [token, setToken] = useState("");
  const [scopes, setScopes] = useState(
    "pages_show_list,pages_messaging,pages_read_engagement,pages_manage_metadata,business_management"
  );

  const handleFBLogin = () => {
    window.FB.login(
      function (response: LoginResponse) {
        console.log("handleFBLogin", response);
        setToken(response?.authResponse?.accessToken || "");
      },
      {
        scope: scopes,
      }
    );
  };

  function handleScopeChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    let value = e.target.value;
    value = value.replace(/,+/g, ",");
    value = value.replace(/\s+/g, "");
    setScopes(value);
  }

  function handleBlur() {
    setScopes((prev) => prev.replace(/,+/g, ","));
  }

  useEffect(() => {
    initFbSdk();
    loadFbSdk();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",

          flexDirection: "row",
          gap: "10px",
        }}
      >
        <label>Scopes：</label>
        <textarea
          value={scopes}
          onChange={handleScopeChange}
          onBlur={handleBlur}
          style={{ padding: "10px", width: "500px" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <label style={{ width: "70px" }}>Token：</label>
        <input
          value={token}
          readOnly
          style={{ padding: "10px", width: "500px" }}
        />
      </div>
      <button onClick={handleFBLogin}>Get Token</button>
    </div>
  );
}

export default App;
