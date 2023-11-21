import { useEffect, useState } from "react";
import * as T from './types.d';
import { NativeEventEmitter, NativeModules, Platform } from "react-native";

const isAndroid = Platform.OS === "android";

const CAF_FACEAUTH_MODULE = NativeModules.CafFaceAuthenticator;
const CAF_FACEAUTH_MODULE_EMITTER = new NativeEventEmitter(CAF_FACEAUTH_MODULE);

const defaultConfig: T.IFaceAuthenticatorConfig = {
  cafStage: T.FaceAuthenticatorCAFStage.PROD,
  filter: T.FaceAuthenticatorFilter.LINE_DRAWING,
  setEnableScreenshots: false,
  setLoadingScreen: false
}

function formatedConfig(config?: T.IFaceAuthenticatorConfig): string {
  const responseConfig = config || defaultConfig;

  return JSON.stringify({
    ...responseConfig,
    filter: isAndroid ? T.FaceAuthenticatorFilter[responseConfig.filter] : responseConfig.filter,
    cafStage: isAndroid ? T.FaceAuthenticatorCAFStage[responseConfig.cafStage] : responseConfig.cafStage
  })
}

function FaceAuthenticatorHook(token: string, config?: T.IFaceAuthenticatorConfig): T.FaceAuthenticatorHookReturnType {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<T.FaceAuthenticatorErrorType | undefined>();
  const [data, setData] = useState<string | undefined>();

  const handleEvent = (event: string, res?: T.FaceAuthenticatorSDKResponseType) => {
    switch (event) {
      case "FaceAuthenticator_Success":
        setData(res?.data?.toString());
        break;
      case "FaceAuthenticator_Loading":
        setLoading(true);
        break;
      case "FaceAuthenticator_Loaded":
        setLoading(false);
        break;
      case "FaceAuthenticator_Error":
        setError({...res} as T.FaceAuthenticatorErrorType);
        break;
      case "FaceAuthenticator_Cancel":
        setLoading(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const eventListener = (event: T.FaceAuthenticatorEvent, res?: T.FaceAuthenticatorSDKResponseType) =>
      handleEvent(event, res);

    CAF_FACEAUTH_MODULE_EMITTER.addListener("FaceAuthenticator_Success", (event: any)=> eventListener("FaceAuthenticator_Success", event));
    CAF_FACEAUTH_MODULE_EMITTER.addListener("FaceAuthenticator_Loading", (event: any)=> eventListener("FaceAuthenticator_Loading", event));
    CAF_FACEAUTH_MODULE_EMITTER.addListener("FaceAuthenticator_Loaded", (event: any)=> eventListener("FaceAuthenticator_Loaded", event));
    CAF_FACEAUTH_MODULE_EMITTER.addListener("FaceAuthenticator_Error", (event: any)=> eventListener("FaceAuthenticator_Error", event));
    CAF_FACEAUTH_MODULE_EMITTER.addListener("FaceAuthenticator_Cancel", (event: any)=> eventListener("FaceAuthenticator_Cancel", event));

    return () => {
      CAF_FACEAUTH_MODULE_EMITTER.removeAllListeners("FaceAuthenticator_Success");
      CAF_FACEAUTH_MODULE_EMITTER.removeAllListeners("FaceAuthenticator_Loading");
      CAF_FACEAUTH_MODULE_EMITTER.removeAllListeners("FaceAuthenticator_Loaded");
      CAF_FACEAUTH_MODULE_EMITTER.removeAllListeners("FaceAuthenticator_Error");
      CAF_FACEAUTH_MODULE_EMITTER.removeAllListeners("FaceAuthenticator_Cancel");
    };
  }, [token]);

  const send = (personId: string): void => {
    setData(undefined);
    setError(undefined);
    CAF_FACEAUTH_MODULE.faceAuthenticator(token, personId, formatedConfig(config));
  };

  return [send, data, loading, error];
}

export default FaceAuthenticatorHook;
