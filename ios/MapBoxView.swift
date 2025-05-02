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
    private var isDashedLineDrawn = false
    private var isTrail = false
 
    @objc var startLat: NSNumber = 0.0 { didSet { updateRouteIfReady() } }
    @objc var startLng: NSNumber = 0.0 { didSet { updateRouteIfReady() } }
    @objc var endLat: NSNumber = 0.0 { didSet { updateRouteIfReady() } }
    @objc var endLng: NSNumber = 0.0 { didSet { updateRouteIfReady() } }
    @objc var originName: NSString = "" { didSet { updateRouteIfReady() } }
    @objc var destinationName: NSString = "" { didSet { updateRouteIfReady() } }
    @objc var hasTrail: NSNumber = 0 {
        didSet {
            isTrail = hasTrail.boolValue
        }
    }
    @objc var onClose: RCTBubblingEventBlock?
 
    override init(frame: CGRect) { super.init(frame: frame) }
    required init?(coder: NSCoder) { super.init(coder: coder) }
 
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
        destination.separatesLegs = false
        destination.targetCoordinate = nil
 
        let routeOptions = NavigationRouteOptions(waypoints: [origin, destination])
        routeOptions.locale = Locale(identifier: "en_US")
 
        routingProvider.calculateRoutes(options: routeOptions) { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .failure(let error):
                print("Route error: \(error.localizedDescription)")
                DispatchQueue.main.async {
                  let alert = UIAlertController(title: "No Route", message: "No route found between origin and destination.", preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                      self.onClose?(["message": "No route found between origin and destination."])
                    })
                    self.findViewController()?.present(alert, animated: true)
                }
 
            case .success(let response):
                guard let route = response.routeResponse.routes?.first else {
                                    print("No routes returned in response")
                    DispatchQueue.main.async {
                      let alert = UIAlertController(title: "No Route", message: "No route found between origin and destination.", preferredStyle: .alert)
                        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                          self.onClose?(["message": "No route found between origin and destination."])
                        })
                        self.findViewController()?.present(alert, animated: true)
                    }
                  return
                }
                DispatchQueue.main.async {
                    let navVC = NavigationViewController(for: response)
                    navVC.showsReportFeedback = false
                    navVC.delegate = self
                    self.navigationViewController = navVC
 
//                    navVC.navigationMapView?.removeRoutes()
//                    navVC.navigationMapView?.removeArrow()
 
                    if let parentVC = self.findViewController() {
                        parentVC.addChild(navVC)
                        navVC.view.frame = self.bounds
                        navVC.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
                        self.addSubview(navVC.view)
                        navVC.didMove(toParent: parentVC)
 
                        if let route = response.routeResponse.routes?.first,
                           let entrance = route.shape?.coordinates.last {
 
                            let actualDestination = CLLocationCoordinate2D(latitude: self.endLat.doubleValue, longitude: self.endLng.doubleValue)
 
                            if let mapView = navVC.navigationMapView?.mapView {
                                mapView.mapboxMap.onNext(event: .styleLoaded) { _ in
 
                                    if self.isTrail == false {
                                      let entranceLocation = CLLocation(latitude: entrance.latitude, longitude: entrance.longitude)
                                      let destinationLocation = CLLocation(latitude: actualDestination.latitude, longitude: actualDestination.longitude)
                                      let distance = entranceLocation.distance(from: destinationLocation)
                                      
                                      print("🛣️ Distance from route end to final destination: \(distance) meters")
                                      
                                      if distance > 10 {
                                        self.isDashedLineDrawn = true
                                        // navVC.navigationMapView?.removeWaypoints()
                                        self.drawDashedLine(from: entrance, to: actualDestination, on: mapView)
                                        
                                        let pointAnnotationManager = mapView.annotations.makePointAnnotationManager()
                                        var pointAnnotation = PointAnnotation(coordinate: actualDestination)
                                        let flagImage = UIImage(named: "marker") ?? UIImage(systemName: "flag.fill")!
                                        pointAnnotation.image = .init(image: flagImage, name: "destination-flag")
                                        pointAnnotation.iconSize = 0.3
                                        pointAnnotationManager.annotations = [pointAnnotation]
                                      } else {
                                        self.isDashedLineDrawn = false
                                      }
                                   }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
 
    func navigationViewController(_ navigationViewController: NavigationViewController, didArriveAt waypoint: Waypoint) -> Bool {
//        if isDashedLineDrawn {
//            print("⚠️ Dashed line present — suppressing alert only.")
//            return true
//        } else {
            DispatchQueue.main.async {
              let alert = UIAlertController(title: "Arrived", message: (self.isDashedLineDrawn || self.isTrail) ? "Off-road navigation begins here. Follow the dashed line to your destination." : "You have reached your destination.", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                  self.onClose?(["message": "Navigation completed", "isTrail": self.isTrail, "isDashedLineDrawn": self.isDashedLineDrawn])
                })
                self.findViewController()?.present(alert, animated: true)
            }
            return true
//        }
    }
 
    func navigationViewController(_ navigationViewController: NavigationViewController, didRefresh routeProgress: RouteProgress) {
        guard let lastCoord = routeProgress.route.shape?.coordinates.last else { return }
 
        let routeEnd = CLLocation(latitude: lastCoord.latitude, longitude: lastCoord.longitude)
        let actualDestination = CLLocation(latitude: self.endLat.doubleValue, longitude: self.endLng.doubleValue)
        let distance = routeEnd.distance(from: actualDestination)
 
        print("🔁 Reroute distance to final destination: \(distance)m")
 
        if distance > 10 {
            isDashedLineDrawn = true
//            navigationViewController.navigationMapView?.removeWaypoints()
        } else {
            isDashedLineDrawn = false
        }
    }
 
    private func drawDashedLine(from start: CLLocationCoordinate2D, to end: CLLocationCoordinate2D, on mapView: MapView) {
        let coordinates = [start, end]
        let lineString = LineString(coordinates)
        let feature = Feature(geometry: .lineString(lineString))
 
        var geoSource = GeoJSONSource()
        geoSource.data = .feature(feature)
 
        do {
            if mapView.mapboxMap.style.sourceExists(withId: "manual-line-source") {
                try mapView.mapboxMap.style.updateGeoJSONSource(withId: "manual-line-source", geoJSON: .feature(feature))
            } else {
                try mapView.mapboxMap.style.addSource(geoSource, id: "manual-line-source")
            }
        } catch {
            print("❌ Source error: \(error)")
        }
 
        var lineLayer = LineLayer(id: "manual-line-layer")
        lineLayer.source = "manual-line-source"
        lineLayer.lineColor = .constant(StyleColor(.systemBlue))
        lineLayer.lineWidth = .constant(3.0)
        lineLayer.lineDasharray = .constant([2.0, 2.0])
        lineLayer.lineCap = .constant(.round)
        lineLayer.lineJoin = .constant(.round)
 
        do {
            if !mapView.mapboxMap.style.layerExists(withId: "manual-line-layer") {
                try mapView.mapboxMap.style.addLayer(lineLayer)
            }
        } catch {
            print("❌ Layer error: \(error)")
        }
    }
 
    func navigationViewControllerDidDismiss(_ navigationViewController: NavigationViewController, byCanceling canceled: Bool) {
        self.onClose?(["message": "Navigation cancelled", "isTrail": self.isTrail, "isDashedLineDrawn": false])
    }
 
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
