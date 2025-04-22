//
//  MapBoxViewManager.swift
//  PathFinder
//
//  Created by VS-Macbook on 21/04/2025.
//

import Foundation
import React
 
  @objc(MapBoxViewManager)
    class MapBoxViewManager: RCTViewManager {
      override func view() -> UIView! {
        return MapBoxView()
      }
 
      override static func requiresMainQueueSetup() -> Bool {
        return true
      }
    }
