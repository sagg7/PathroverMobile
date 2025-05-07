//
//  MapBoxViewManager.m
//  PathFinder
//
//  Created by VS-Macbook on 21/04/2025.
//

#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>
 
@interface RCT_EXTERN_MODULE(MapBoxViewManager, RCTViewManager)
  RCT_EXPORT_VIEW_PROPERTY(startLat, NSNumber)
  RCT_EXPORT_VIEW_PROPERTY(startLng, NSNumber)
  RCT_EXPORT_VIEW_PROPERTY(originName, NSString)
  RCT_EXPORT_VIEW_PROPERTY(endLat, NSNumber)
  RCT_EXPORT_VIEW_PROPERTY(endLng, NSNumber)
  RCT_EXPORT_VIEW_PROPERTY(destinationName, NSString)
  RCT_EXPORT_VIEW_PROPERTY(hasTrail, NSNumber)
  RCT_EXPORT_VIEW_PROPERTY(mapStyle, NSString)
  RCT_EXPORT_VIEW_PROPERTY(onClose, RCTBubblingEventBlock)
@end
