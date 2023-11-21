package com.cafbridge_faceauthenticator;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;

import input.FaceAuthenticator;
import input.VerifyAuthenticationListener;
import output.FaceAuthenticatorResult;

public class CafFaceAuthenticatorActivity extends ReactActivity {
    private String token;
    private String personId;
    private String customConfig;
    private Intent intent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        intent = getIntent();
        token = intent.getStringExtra("token");
        personId = intent.getStringExtra("personId");
        customConfig = intent.getStringExtra("config");

        try {
            this.faceAuthenticator();
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

    }

    private void faceAuthenticator() throws JSONException {
        FaceAuthenticatorConfig config = new FaceAuthenticatorConfig(customConfig);
        FaceAuthenticator faceAuthenticator = new FaceAuthenticator.Builder(token)
                .setStage(config.cafStage)
                .setFilter(config.filter)
                .setLoadingScreen(config.setLoadingScreen)
                .setEnableScreenshots(config.setEnableScreenshots)
                .build();

        faceAuthenticator.authenticate(this, personId, new VerifyAuthenticationListener() {
            @Override
            public void onSuccess(FaceAuthenticatorResult result) {
                WritableMap writableMap = new WritableNativeMap();
                writableMap.putString("data", result.getSignedResponse());

                getReactInstanceManager().getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FaceAuthenticator_Success", writableMap);
                finish();
            }

            @Override
            public void onError(FaceAuthenticatorResult result) {
                String message;
                String type;

                WritableMap writableMap = new WritableNativeMap();
                output.failure.SDKFailure sdkFailure = null;
                if (sdkFailure instanceof output.failure.NetworkReason) {
                    type = "Network Error";
                    message = ("FaceAuthenticator " + "onError: " + " Throwable: " + ((output.failure.NetworkReason) result.getSdkFailure()).getThrowable());
                } else if (sdkFailure instanceof output.failure.ServerReason) {
                    type = "Server Error";
                    message = ("FaceAutheticator " + "onError: " + " Status Code: " + ((output.failure.ServerReason) result.getSdkFailure()).getCode());
                } else {
                    message = "Error: " + result.getErrorMessage();
                    type = "Error";
                }
                Log.d("face_authenticator", message);
                Log.d("face_authenticator", type);
                writableMap.putString("message", message);
                writableMap.putString("type", type);
                getReactInstanceManager().getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FaceAuthenticator_Error", writableMap);
                finish();
            }

            @Override
            public void onCancel(FaceAuthenticatorResult faceAuthenticatorResult) {
                WritableMap writableMap = new WritableNativeMap();

                getReactInstanceManager().getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FaceAuthenticator_Cancel", writableMap);
                finish();
            }

            @Override
            public void onLoading() {
                WritableMap writableMap = new WritableNativeMap();

                getReactInstanceManager().getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FaceAuthenticator_Loading", writableMap);
            }

            @Override
            public void onLoaded() {
                WritableMap writableMap = new WritableNativeMap();

                getReactInstanceManager().getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FaceAuthenticator_Loaded", writableMap);
            }

        });
    }

}
