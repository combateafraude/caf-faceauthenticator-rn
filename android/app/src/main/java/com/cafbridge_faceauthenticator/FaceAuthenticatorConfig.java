package com.cafbridge_faceauthenticator;

import org.json.JSONException;
import org.json.JSONObject;

import input.CafStage;
import input.iproov.Filter;

import java.io.Serializable;

public class FaceAuthenticatorConfig implements Serializable {
    public CafStage cafStage;
    public Filter filter;
    public boolean setEnableScreenshots;
    public boolean setLoadingScreen;


    public FaceAuthenticatorConfig(String jsonString) throws JSONException {
        JSONObject jsonObject = new JSONObject(jsonString);

        this.cafStage = CafStage.valueOf(jsonObject.getString("cafStage"));
        this.filter = Filter.valueOf(jsonObject.getString("filter"));
        this.setEnableScreenshots = jsonObject.getBoolean("setEnableScreenshots");
        this.setLoadingScreen = jsonObject.getBoolean("setLoadingScreen");
    }
}