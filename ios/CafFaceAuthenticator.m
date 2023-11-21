//
//  CafFaceAuthenticator.m
//  cafbridge_faceauthenticator
//
//  Created by Lorena Zanferrari on 21/11/23.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(CafFaceAuthenticator, RCTEventEmitter)
    RCT_EXTERN_METHOD(faceAuthenticator:(NSString *)token personId:(NSString *)personId config:(NSString *)config)
@end
