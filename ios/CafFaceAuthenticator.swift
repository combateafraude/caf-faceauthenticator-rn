//
//  CafFaceAuthenticator.swift
//  cafbridge_faceauthenticator
//
//  Created by Lorena Zanferrari on 21/11/23.
//

import Foundation
import React
import FaceAuthenticator
import FaceLiveness

@objc(CafFaceAuthenticator)
class CafFaceAuthenticator: RCTEventEmitter, FaceAuthSDKDelegate {
  
  static let shared = CafFaceAuthenticator()
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func supportedEvents() -> [String]! {
    return [
      "FaceAuthenticator_Success",
      "FaceAuthenticator_Error",
      "FaceAuthenticator_Cancel",
      "FaceAuthenticator_Loading",
      "FaceAuthenticator_Loaded",
      "FaceAuthenticator_Success",
      "FaceAuthenticator_Error",
      "FaceAuthenticator_Cancel",
      "FaceAuthenticator_Loading",
      "FaceAuthenticator_Loaded",
      "Identity_Success",
      "Identity_Pending",
      "Identity_Error"
    ]
  }
  
  @objc(faceAuthenticator:personId:config:)
  func faceAuthenticator(token: String, personId: String, config: String) {
    var configDictionary: [String: Any]? = nil
    var filter = Filter.lineDrawing;
    var cafStage = FaceLiveness.CAFStage.PROD
    
    if let data = config.data(using: .utf8) {
      configDictionary = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
    }
    
    if let filterValue = configDictionary?["filter"] as? Int, let newFilter = Filter(rawValue: filterValue) {
      filter = newFilter
    }
    
    if let cafStageValue = configDictionary?["cafStage"] as? Int, let newCafStage = FaceLiveness.CAFStage(rawValue: cafStageValue) {
      cafStage = newCafStage
    }
    
    let faceAuthenticator = FaceAuthSDK.Builder()
      .setStage(stage: cafStage)
      .setFilter(filter: filter)
      .setCredentials(token: token, personId: personId)
        .build()
    faceAuthenticator.delegate = self
        
        DispatchQueue.main.async {
          guard let currentViewController = UIApplication.shared.keyWindow!.rootViewController else { return }
          faceAuthenticator.startFaceAuthSDK(viewController: currentViewController)
        }
    }


  // FaceAuthenticator
  func didFinishSuccess(with faceAuthenticatorResult: FaceAuthenticator.FaceAuthenticatorResult) {
    let response : NSMutableDictionary = [:]
        response["data"] = faceAuthenticatorResult.signedResponse
        sendEvent(withName: "FaceAuthenticator_Success", body: response)
  }
  
  func didFinishWithError(with faceAuthenticatorErrorResult: FaceAuthenticator.FaceAuthenticatorErrorResult) {
      let response : NSMutableDictionary = [:]
          response["message"] = faceAuthenticatorErrorResult.description
          response["type"] = String(describing: faceAuthenticatorErrorResult.errorType)
          sendEvent(withName: "FaceAuthenticator_Error", body: response)
  }
  
  func didFinishWithCancell(with faceAuthenticatorResult: FaceAuthenticator.FaceAuthenticatorResult) {
    sendEvent(withName: "FaceAuthenticator_Cancel", body: nil)
  }
  
  func didFinishWithFail(with faceAuthenticatorFailResult: FaceAuthenticator.FaceAuthenticatorFailResult) {
    let response : NSMutableDictionary = [:]
        response["message"] = faceAuthenticatorFailResult.description
        response["type"] = String(describing: faceAuthenticatorFailResult.errorType)
        sendEvent(withName: "FaceAuthenticator_Error", body: response)
  }
  
  func openLoadingScreenStartSDK() {
    sendEvent(withName: "FaceAuthenticator_Loading", body: nil)
  }
  
  func closeLoadingScreenStartSDK() {
    sendEvent(withName: "FaceAuthenticator_Loaded", body: nil)
  }
  
  func openLoadingScreenValidation() {
    sendEvent(withName: "FaceAuthenticator_Loading", body: nil)
  }
  
  func closeLoadingScreenValidation() {
    sendEvent(withName: "FaceAuthenticator_Loaded", body: nil)
  }
  
}
