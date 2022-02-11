import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "b7a11050-68bf-477b-8ab0-1530c5051c76",
    authority:
      "https://login.microsoftonline.com/cef04b19-7776-4a94-b89b-375c77a8f936",
    redirectUri: "https://localhost:3000/",
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: any, message: any, containsPii: any) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphProfilePhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value",
};
