import UIKit
import React
import MapboxDirections
import MapboxCoreNavigation
import MapboxNavigation
import MapboxMaps
 
@objc(MapBoxView)
class MapBoxView: UIView, NavigationViewControllerDelegate {
    private let routingProvider = MapboxRoutingProvider()
    private var navigationViewController: NavigationViewController?
    private var hasInitialized = false
 
    // MARK: - Props exposed to React Native
    @objc var startLat: NSNumber = 0.0 {
        didSet { updateRouteIfReady() }
    }
 
    @objc var startLng: NSNumber = 0.0 {
        didSet { updateRouteIfReady() }
    }
 
    @objc var endLat: NSNumber = 0.0 {
        didSet { updateRouteIfReady() }
    }
 
    @objc var endLng: NSNumber = 0.0 {
        didSet { updateRouteIfReady() }
    }
 
    @objc var originName: NSString = "" {
        didSet { updateRouteIfReady() }
    }
 
    @objc var destinationName: NSString = "" {
        didSet { updateRouteIfReady() }
    }
 
    // MARK: - Event Callback
    @objc var onClose: RCTBubblingEventBlock?
 
    // MARK: - Init
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
 
    required init?(coder: NSCoder) {
        super.init(coder: coder)
    }
 
    // MARK: - Route Setup
    private func updateRouteIfReady() {
        guard !hasInitialized,
              startLat != 0, startLng != 0,
              endLat != 0, endLng != 0,
              originName.length > 0, destinationName.length > 0 else { return }
 
        hasInitialized = true
        setupNavigation()
    }
 
   private func setupNavigation() {
      let origin = Waypoint(
          coordinate: CLLocationCoordinate2D(latitude: startLat.doubleValue, longitude: startLng.doubleValue),
          name: originName as String
      )
 
      let destination = Waypoint(
          coordinate: CLLocationCoordinate2D(latitude: endLat.doubleValue, longitude: endLng.doubleValue),
          name: destinationName as String
      )
 
      let routeOptions = NavigationRouteOptions(waypoints: [origin, destination])
 
      routingProvider.calculateRoutes(options: routeOptions) { [weak self] result in
          guard let self = self else { return }
 
          switch result {
          case .failure(let error):
              print("Route error: \(error.localizedDescription)")
          case .success(let response):
              DispatchQueue.main.async {
                  let navVC = NavigationViewController(for: response)
 
                  // 🔧 Hide Mapbox UI elements
                  navVC.showsReportFeedback = false
                  // navVC.showsEndOfRouteFeedback = false
                  navVC.delegate = self
                  self.navigationViewController = navVC
 
                  if let parentVC = self.findViewController() {
                      parentVC.addChild(navVC)
                      navVC.view.frame = self.bounds
                      navVC.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
                      self.addSubview(navVC.view)
                      navVC.didMove(toParent: parentVC)
                  }
              }
          }
      }
   }
 
    // MARK: - Navigation Dismiss Callback
    func navigationViewControllerDidDismiss(_ navigationViewController: NavigationViewController, byCanceling canceled: Bool) {
        onClose?(["message": canceled ? "User canceled navigation" : "Navigation finished"])
    }
 
    // MARK: - Utility to find parent UIViewController
    private func findViewController() -> UIViewController? {
        var responder: UIResponder? = self
        while responder != nil {
            if let vc = responder as? UIViewController {
                return vc
            }
            responder = responder?.next
        }
        return nil
    }
}
