export type FaceAuthenticatorErrorType = {
    type: string;
    message: string;
}

export type FaceAuthenticatorSDKResponseType = Partial <FaceAuthenticatorErrorType> & {
    data?: string;
};

export type FaceAuthenticatorEvent =
    | "FaceAuthenticator_Success"
    | "FaceAuthenticator_Loading"
    | "FaceAuthenticator_Loaded"
    | "FaceAuthenticator_Error"
    | "FaceAuthenticator_Cancel";

export type FaceAuthenticatorHookReturnType = [
    (token: string) => void,
    FaceAuthenticatorResponseType | undefined,
    boolean,
    FaceAuthenticatorErrorType | undefined
];

export enum FaceAuthenticatorCAFStage {
    BETA,
    PROD,
    DEV,
}

export enum FaceAuthenticatorFilter {
    LINE_DRAWING,
    NATURAL,
}

export interface IFaceAuthenticatorConfig {
    cafStage: CAFStage;
    filter: Filter;
    setEnableScreenshots: boolean;
    setLoadingScreen: boolean;
}