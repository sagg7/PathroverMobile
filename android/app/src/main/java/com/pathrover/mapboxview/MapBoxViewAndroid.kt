package com.pathrover.mapboxview

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.Configuration
import android.content.res.Resources
import android.graphics.BitmapFactory
import android.location.Location
import android.location.LocationManager
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.widget.FrameLayout
import android.widget.Toast
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.ThemedReactContext
import com.mapbox.api.directions.v5.models.DirectionsRoute
import com.mapbox.api.directions.v5.models.RouteOptions
import com.mapbox.bindgen.Expected
import com.mapbox.geojson.Point
import com.mapbox.maps.EdgeInsets
import com.mapbox.maps.MapView
import com.mapbox.maps.MapboxMap
import com.mapbox.maps.plugin.LocationPuck2D
import com.mapbox.maps.plugin.animation.camera
import com.mapbox.maps.plugin.locationcomponent.location
import com.mapbox.navigation.base.TimeFormat
import com.mapbox.navigation.base.extensions.applyDefaultNavigationOptions
import com.mapbox.navigation.base.extensions.applyLanguageAndVoiceUnitOptions
import com.mapbox.navigation.base.options.NavigationOptions
import com.mapbox.navigation.base.route.RouterFailure
import com.mapbox.navigation.base.route.RouterOrigin
import com.mapbox.navigation.core.MapboxNavigation
import com.mapbox.navigation.core.MapboxNavigationProvider
import com.mapbox.navigation.core.directions.session.RoutesObserver
import com.mapbox.navigation.core.formatter.MapboxDistanceFormatter
import com.mapbox.navigation.core.replay.MapboxReplayer
import com.mapbox.navigation.core.replay.ReplayLocationEngine
import com.mapbox.navigation.core.replay.route.ReplayProgressObserver
import com.mapbox.navigation.core.replay.route.ReplayRouteMapper
import com.mapbox.navigation.core.trip.session.LocationMatcherResult
import com.mapbox.navigation.core.trip.session.LocationObserver
import com.mapbox.navigation.core.trip.session.RouteProgressObserver
import com.mapbox.navigation.core.trip.session.VoiceInstructionsObserver
import com.mapbox.api.directions.v5.DirectionsCriteria
import com.mapbox.navigation.base.trip.model.RouteLegProgress
import com.mapbox.navigation.base.trip.model.RouteProgress
import com.mapbox.navigation.core.arrival.ArrivalObserver
import com.mapbox.navigation.ui.base.util.MapboxNavigationConsumer
import com.mapbox.navigation.ui.maneuver.api.MapboxManeuverApi
import com.mapbox.navigation.ui.maneuver.view.MapboxManeuverView
import com.mapbox.navigation.ui.maps.camera.NavigationCamera
import com.mapbox.navigation.ui.maps.camera.data.MapboxNavigationViewportDataSource
import com.mapbox.navigation.ui.maps.camera.lifecycle.NavigationBasicGesturesHandler
import com.mapbox.navigation.ui.maps.camera.state.NavigationCameraState
import com.mapbox.navigation.ui.maps.camera.transition.NavigationCameraTransitionOptions
import com.mapbox.navigation.ui.maps.location.NavigationLocationProvider
import com.mapbox.navigation.ui.maps.route.arrow.api.MapboxRouteArrowApi
import com.mapbox.navigation.ui.maps.route.arrow.api.MapboxRouteArrowView
import com.mapbox.navigation.ui.maps.route.arrow.model.RouteArrowOptions
import com.mapbox.navigation.ui.maps.route.line.api.MapboxRouteLineApi
import com.mapbox.navigation.ui.maps.route.line.api.MapboxRouteLineView
import com.mapbox.navigation.ui.maps.route.line.model.MapboxRouteLineOptions
import com.mapbox.navigation.ui.tripprogress.api.MapboxTripProgressApi
import com.mapbox.navigation.ui.tripprogress.model.DistanceRemainingFormatter
import com.mapbox.navigation.ui.tripprogress.model.EstimatedTimeToArrivalFormatter
import com.mapbox.navigation.ui.tripprogress.model.PercentDistanceTraveledFormatter
import com.mapbox.navigation.ui.tripprogress.model.TimeRemainingFormatter
import com.mapbox.navigation.ui.tripprogress.model.TripProgressUpdateFormatter
import com.mapbox.navigation.ui.tripprogress.view.MapboxTripProgressView
import com.mapbox.navigation.ui.voice.api.MapboxSpeechApi
import com.mapbox.navigation.ui.voice.api.MapboxVoiceInstructionsPlayer
import com.mapbox.navigation.ui.voice.model.SpeechAnnouncement
import com.mapbox.navigation.ui.voice.model.SpeechError
import com.mapbox.navigation.ui.voice.model.SpeechValue
import com.mapbox.navigation.ui.voice.model.SpeechVolume
import java.util.Locale
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.mapbox.core.constants.Constants.PRECISION_6
import com.pathrover.R
import com.pathrover.databinding.NavigationViewBinding
import com.mapbox.geojson.Feature
import com.mapbox.geojson.LineString
import com.mapbox.geojson.utils.PolylineUtils
import com.mapbox.maps.extension.style.layers.addLayer
import com.mapbox.maps.extension.style.layers.generated.lineLayer
import com.mapbox.maps.extension.style.layers.properties.generated.LineCap
import com.mapbox.maps.extension.style.layers.properties.generated.LineJoin
import com.mapbox.maps.extension.style.sources.addSource
import com.mapbox.maps.extension.style.sources.generated.GeoJsonSource
import com.mapbox.maps.extension.style.sources.generated.geoJsonSource
import com.mapbox.maps.extension.style.sources.getSourceAs
import com.mapbox.maps.plugin.annotation.annotations
import com.mapbox.maps.plugin.annotation.generated.PointAnnotationOptions
import com.mapbox.maps.plugin.annotation.generated.PolylineAnnotationManager
import com.mapbox.maps.plugin.annotation.generated.createPointAnnotationManager
import com.mapbox.navigation.base.route.NavigationRoute
import com.mapbox.navigation.base.route.NavigationRouterCallback
import com.mapbox.navigation.core.trip.session.OffRouteObserver
import com.mapbox.turf.TurfConstants
import com.mapbox.turf.TurfMeasurement
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MapBoxViewAndroid(private val context: ThemedReactContext, private val accessToken: String?) :
    FrameLayout(context.baseContext) {

    private companion object {
        private const val BUTTON_ANIMATION_DURATION = 1500L
    }

    private var origin: Point? = null
    private var destination: Point? = null
    private var shouldSimulateRoute = false
    private var showsEndOfRouteFeedback = false
    private var mapStyleKey = "default"
    private var hasTrail = false
    private var hasDashedLine = false
    private var originName = ""
    private var destinationName = ""

    /**
     * Debug tool used to play, pause and seek route progress events that can be used to produce mocked location updates along the route.
     */
    private val mapboxReplayer = MapboxReplayer()
    private var routeJob: Job? = null

    // private val viewScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    /**
     * Debug tool that mocks location updates with an input from the [mapboxReplayer].
     */
    private val replayLocationEngine = ReplayLocationEngine(mapboxReplayer)

    /**
     * Debug observer that makes sure the replayer has always an up-to-date information to generate mock updates.
     */
    private val replayProgressObserver = ReplayProgressObserver(mapboxReplayer)

    /**
     * Bindings to the example layout.
     */
    private var currentRoute: DirectionsRoute? = null

    private var binding: NavigationViewBinding =
        NavigationViewBinding.inflate(LayoutInflater.from(context), this, true)

    /**
     * Mapbox Maps entry point obtained from the [MapView].
     * You need to get a new reference to this object whenever the [MapView] is recreated.
     */
    private lateinit var mapboxMap: MapboxMap

    /**
     * Mapbox Navigation entry point. There should only be one instance of this object for the app.
     * You can use [MapboxNavigationProvider] to help create and obtain that instance.
     */
    private lateinit var mapboxNavigation: MapboxNavigation

    /**
     * Used to execute camera transitions based on the data generated by the [viewportDataSource].
     * This includes transitions from route overview to route following and continuously updating the camera as the location changes.
     */
    private lateinit var navigationCamera: NavigationCamera

    /**
     * Produces the camera frames based on the location and routing data for the [navigationCamera] to execute.
     */
    private lateinit var viewportDataSource: MapboxNavigationViewportDataSource

    /*
     * Below are generated camera padding values to ensure that the route fits well on screen while
     * other elements are overlaid on top of the map (including instruction view, buttons, etc.)
     */
    private val pixelDensity = Resources.getSystem().displayMetrics.density
    private val overviewPadding: EdgeInsets by lazy {
        EdgeInsets(
            140.0 * pixelDensity,
            40.0 * pixelDensity,
            120.0 * pixelDensity,
            40.0 * pixelDensity
        )
    }
    private val landscapeOverviewPadding: EdgeInsets by lazy {
        EdgeInsets(
            30.0 * pixelDensity,
            380.0 * pixelDensity,
            110.0 * pixelDensity,
            20.0 * pixelDensity
        )
    }
    private val followingPadding: EdgeInsets by lazy {
        EdgeInsets(
            180.0 * pixelDensity,
            40.0 * pixelDensity,
            150.0 * pixelDensity,
            40.0 * pixelDensity
        )
    }
    private val landscapeFollowingPadding: EdgeInsets by lazy {
        EdgeInsets(
            30.0 * pixelDensity,
            380.0 * pixelDensity,
            110.0 * pixelDensity,
            40.0 * pixelDensity
        )
    }

    /**
     * Generates updates for the [MapboxManeuverView] to display the upcoming maneuver instructions
     * and remaining distance to the maneuver point.
     */
    private lateinit var maneuverApi: MapboxManeuverApi

    /**
     * Generates updates for the [MapboxTripProgressView] that include remaining time and distance to the destination.
     */
    private lateinit var tripProgressApi: MapboxTripProgressApi

    /**
     * Generates updates for the [routeLineView] with the geometries and properties of the routes that should be drawn on the map.
     */
    private lateinit var routeLineApi: MapboxRouteLineApi

    /**
     * Draws route lines on the map based on the data from the [routeLineApi]
     */
    private lateinit var routeLineView: MapboxRouteLineView

    private lateinit var polylineAnnotationManager: PolylineAnnotationManager

    /**
     * Generates updates for the [routeArrowView] with the geometries and properties of maneuver arrows that should be drawn on the map.
     */
    private val routeArrowApi: MapboxRouteArrowApi = MapboxRouteArrowApi()

    /**
     * Draws maneuver arrows on the map based on the data [routeArrowApi].
     */
    private lateinit var routeArrowView: MapboxRouteArrowView

    /**
     * Stores and updates the state of whether the voice instructions should be played as they come or muted.
     */
    private var isVoiceInstructionsMuted = false
        set(value) {
            field = value
            if (value) {
                binding.soundButton.muteAndExtend(BUTTON_ANIMATION_DURATION)
                voiceInstructionsPlayer.volume(SpeechVolume(0f))
            } else {
                binding.soundButton.unmuteAndExtend(BUTTON_ANIMATION_DURATION)
                voiceInstructionsPlayer.volume(SpeechVolume(1f))
            }
        }

    /**
     * Extracts message that should be communicated to the driver about the upcoming maneuver.
     * When possible, downloads a synthesized audio file that can be played back to the driver.
     */
    private lateinit var speechApi: MapboxSpeechApi

    /**
     * Plays the synthesized audio files with upcoming maneuver instructions
     * or uses an on-device Text-To-Speech engine to communicate the message to the driver.
     */
    private lateinit var voiceInstructionsPlayer: MapboxVoiceInstructionsPlayer

    /**
     * Observes when a new voice instruction should be played.
     */
    private val voiceInstructionsObserver = VoiceInstructionsObserver { voiceInstructions ->
        speechApi.generate(voiceInstructions, speechCallback)
    }

    /**
     * Based on whether the synthesized audio file is available, the callback plays the file
     * or uses the fall back which is played back using the on-device Text-To-Speech engine.
     */
    private val speechCallback =
        MapboxNavigationConsumer<Expected<SpeechError, SpeechValue>> { expected ->
            expected.fold(
                { error ->
                    // play the instruction via fallback text-to-speech engine
                    voiceInstructionsPlayer.play(
                        error.fallback,
                        voiceInstructionsPlayerCallback
                    )
                },
                { value ->
                    // play the sound file from the external generator
                    voiceInstructionsPlayer.play(
                        value.announcement,
                        voiceInstructionsPlayerCallback
                    )
                }
            )
        }

    /**
     * When a synthesized audio file was downloaded, this callback cleans up the disk after it was played.
     */
    private val voiceInstructionsPlayerCallback =
        MapboxNavigationConsumer<SpeechAnnouncement> { value ->
            // remove already consumed file to free-up space
            speechApi.clean(value)
        }

    /**
     * [NavigationLocationProvider] is a utility class that helps to provide location updates generated by the Navigation SDK
     * to the Maps SDK in order to update the user location indicator on the map.
     */
    private val navigationLocationProvider = NavigationLocationProvider()

    /**
     * Gets notified with location updates.
     *
     * Exposes raw updates coming directly from the location services
     * and the updates enhanced by the Navigation SDK (cleaned up and matched to the road).
     */
    private val locationObserver = object : LocationObserver {
        override fun onNewRawLocation(rawLocation: Location) {
            // not handled
        }

        override fun onNewLocationMatcherResult(locationMatcherResult: LocationMatcherResult) {
            val enhancedLocation = locationMatcherResult.enhancedLocation

            /* if (currentRoute != null) {
                 val routeLinePoints = PolylineUtils.decode(currentRoute?.geometry() ?: "", PRECISION_6)

                 val nearest = nearestPointOnLine(Point.fromLngLat(enhancedLocation.longitude,enhancedLocation.latitude), routeLinePoints)

                 val distance = TurfMeasurement.distance(
                     nearest,
                     Point.fromLngLat(enhancedLocation.longitude, enhancedLocation.latitude),
                     TurfConstants.UNIT_METERS
                 )

                 if (distance > 20) { // You can tweak this threshold
                     // User is off route
                     Toast.makeText(context,"off route ", Toast.LENGTH_SHORT).show()
                     findRoute(Point.fromLngLat(enhancedLocation.longitude, enhancedLocation.latitude),destination!!)
                 }
             }*/
            // update location puck's position on the map
            navigationLocationProvider.changePosition(
                location = enhancedLocation,
                keyPoints = locationMatcherResult.keyPoints,
            )

            // update camera position to account for new location
            viewportDataSource.onLocationChanged(enhancedLocation)
            viewportDataSource.evaluate()

            val event = Arguments.createMap()
            event.putDouble("longitude", enhancedLocation.longitude)
            event.putDouble("latitude", enhancedLocation.latitude)
            context
                .getJSModule(RCTEventEmitter::class.java)
                .receiveEvent(id, "onLocationChange", event)
        }
    }

    fun nearestPointOnLine(point: Point, line: List<Point>): Point {
        var minDistance = Double.MAX_VALUE
        var nearestPoint = line.first()

        for (i in 0 until line.size - 1) {
            val segmentStart = line[i]
            val segmentEnd = line[i + 1]

            val candidate = closestPointOnSegment(point, segmentStart, segmentEnd)
            val distance = TurfMeasurement.distance(point, candidate, TurfConstants.UNIT_METERS)

            if (distance < minDistance) {
                minDistance = distance
                nearestPoint = candidate
            }
        }

        return nearestPoint
    }

    fun closestPointOnSegment(p: Point, a: Point, b: Point): Point {
        val ax = a.longitude()
        val ay = a.latitude()
        val bx = b.longitude()
        val by = b.latitude()
        val px = p.longitude()
        val py = p.latitude()

        val dx = bx - ax
        val dy = by - ay

        val d = dx * dx + dy * dy
        if (d == 0.0) return a // Segment is a point

        val t = ((px - ax) * dx + (py - ay) * dy) / d
        val clampedT = maxOf(0.0, minOf(1.0, t))

        val closestX = ax + clampedT * dx
        val closestY = ay + clampedT * dy

        return Point.fromLngLat(closestX, closestY)
    }


    /**
     * Gets notified with progress along the currently active route.
     */
    private val routeProgressObserver = RouteProgressObserver { routeProgress ->
        // update the camera position to account for the progressed fragment of the route
        viewportDataSource.onRouteProgressChanged(routeProgress)
        viewportDataSource.evaluate()

        // draw the upcoming maneuver arrow on the map
        val style = mapboxMap.getStyle()
        if (style != null) {
            val maneuverArrowResult = routeArrowApi.addUpcomingManeuverArrow(routeProgress)
            routeArrowView.renderManeuverUpdate(style, maneuverArrowResult)
        }

        // update top banner with maneuver instructions
        val maneuvers = maneuverApi.getManeuvers(routeProgress)
        maneuvers.fold(
            { error ->
                Log.e("Eror ", error.errorMessage ?: "Route progress not found")
            },
            {
                binding.maneuverView.visibility = View.VISIBLE
                binding.maneuverView.updatePrimaryManeuverTextAppearance(R.style.PrimaryManeuverTextAppearance)
                binding.maneuverView.updateSecondaryManeuverTextAppearance(R.style.ManeuverTextAppearance)
                binding.maneuverView.updateSubManeuverTextAppearance(R.style.ManeuverTextAppearance)
                binding.maneuverView.updateStepDistanceTextAppearance(R.style.StepDistanceRemainingAppearance)
                binding.maneuverView.renderManeuvers(maneuvers)
            }
        )

        // update bottom trip progress summary
        binding.tripProgressView.render(
            tripProgressApi.getTripProgress(routeProgress)
        )

        val event = Arguments.createMap()
        event.putDouble("distanceTraveled", routeProgress.distanceTraveled.toDouble())
        event.putDouble("durationRemaining", routeProgress.durationRemaining.toDouble())
        event.putDouble("fractionTraveled", routeProgress.fractionTraveled.toDouble())
        event.putDouble("distanceRemaining", routeProgress.distanceRemaining.toDouble())
        context
            .getJSModule(RCTEventEmitter::class.java)
            .receiveEvent(id, "onRouteProgressChange", event)
    }

    /**
     * Gets notified whenever the tracked routes change.
     *
     * A change can mean:
     * - routes get changed with [MapboxNavigation.setRoutes]
     * - routes annotations get refreshed (for example, congestion annotation that indicate the live traffic along the route)
     * - driver got off route and a reroute was executed
     */

    private val offRouteObserver = OffRouteObserver { isOffRoute ->
        if (isOffRoute) {
            Log.d("OffRoute", "User is off route, re-routing...")

            val currentLocation = navigationLocationProvider.lastLocation
            if (currentLocation != null && this.destination != null) {
                val originPoint =
                    Point.fromLngLat(currentLocation.longitude, currentLocation.latitude)
                if (originPoint.longitude() != 0.0) {
                    originPoint?.let {
                        this.destination?.let { it1 -> this@MapBoxViewAndroid.findRoute(it, it1) }
                    }
                } else {
                    Toast.makeText(
                        context,
                        "origin is null",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }

    private val routesObserver = RoutesObserver { routeUpdateResult ->
        routeLineApi.setNavigationRoutes(routeUpdateResult.navigationRoutes) {
            mapboxMap.getStyle()?.let { style ->
                routeLineApi.getRouteDrawData { expectedResult ->
                    if (expectedResult.isValue) {
                        routeLineView.renderRouteDrawData(style, expectedResult)
                        // currentRoute = routeUpdateResult.navigationRoutes.firstOrNull()?.directionsRoute

                        // drawDashedLine(binding.mapView, latestRoute)
                    } else {
                        Log.e("MapboxRouteDraw", "Error drawing route: ${expectedResult.error}")
                    }
                }
            }
        }

        if (routeUpdateResult.navigationRoutes.isNotEmpty()) {
            // generate route geometries asynchronously and render them
            routeLineApi.setNavigationRoutes(
                routeUpdateResult.navigationRoutes
            ) { value ->
                if (value.isValue) {
                    mapboxMap.getStyle()?.let { style ->
                        Log.e("MapboxCrash", "Error rendering route: ${value.toString()}")

                        //   routeLineView.renderRouteDrawData(style, value)
                    }
                } else {
                    Log.e("MapboxCrash", "Error rendering route:  ${value.toString()}")
                }
            }

            // update the camera position to account for the new route
            viewportDataSource.onRouteChanged(routeUpdateResult.navigationRoutes.first())
            viewportDataSource.evaluate()
        } else {
            // remove the route line and route arrow from the map
            val style = binding.mapView.getMapboxMap().getStyle()
            if (style != null) {
                routeLineApi.clearRouteLine { value ->
                    routeLineView.renderClearRouteLineValue(
                        style,
                        value
                    )
                }
                routeArrowView.render(style, routeArrowApi.clearArrows())
            }

            // remove the route reference from camera position evaluations
            viewportDataSource.clearRouteData()
            viewportDataSource.evaluate()
        }
    }

    private val arrivalObserver = object : ArrivalObserver {

        override fun onWaypointArrival(routeProgress: RouteProgress) {
            // do something when the user arrives at a waypoint
        }

        override fun onNextRouteLegStart(routeLegProgress: RouteLegProgress) {
            // do something when the user starts a new leg
        }

        override fun onFinalDestinationArrival(routeProgress: RouteProgress) {
            val event = Arguments.createMap()
            event.putBoolean("hasTrail", hasTrail)
            event.putBoolean("hasDashedLine", hasDashedLine)
            event.putString("onArrive", "")
            context
                .getJSModule(RCTEventEmitter::class.java)
                .receiveEvent(id, "onArrive", event)
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        onCreate()
    }

    override fun requestLayout() {
        super.requestLayout()
        post(measureAndLayout)
    }

    private val measureAndLayout = Runnable {
        measure(
            MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY)
        )
        layout(left, top, right, bottom)
    }

    private fun setCameraPositionToOrigin() {
        val startingLocation = Location(LocationManager.GPS_PROVIDER)
        startingLocation.latitude = origin!!.latitude()
        startingLocation.longitude = origin!!.longitude()
        viewportDataSource.onLocationChanged(startingLocation)

        navigationCamera.requestNavigationCameraToFollowing(
            stateTransitionOptions = NavigationCameraTransitionOptions.Builder()
                .maxDuration(0) // instant transition
                .build()
        )
    }

    @SuppressLint("MissingPermission")
    fun onCreate() {
        if (accessToken == null) {
            sendErrorToReact("Mapbox access token is not set")
            return
        }

        if (origin == null || destination == null) {
            sendErrorToReact("origin and destination are required")
            return
        }

        mapboxMap = binding.mapView.getMapboxMap()

        // initialize the location puck
        binding.mapView.location.apply {
            this.locationPuck = LocationPuck2D(
                bearingImage = ContextCompat.getDrawable(
                    context,
                    com.mapbox.navigation.dropin.R.drawable.mapbox_navigation_puck_icon
                )
            )
            setLocationProvider(navigationLocationProvider)
            enabled = true
        }

        // initialize Mapbox Navigation
        mapboxNavigation = if (MapboxNavigationProvider.isCreated()) {
            MapboxNavigationProvider.retrieve()
        } else if (shouldSimulateRoute) {
            MapboxNavigationProvider.create(
                NavigationOptions.Builder(context)
                    .accessToken(accessToken)
                    .locationEngine(replayLocationEngine)
                    .build()
            )
        } else {
            MapboxNavigationProvider.create(
                NavigationOptions.Builder(context)
                    .accessToken(accessToken)
                    .build()
            )
        }

        // initialize Navigation Camera
        viewportDataSource = MapboxNavigationViewportDataSource(mapboxMap)

        navigationCamera = NavigationCamera(
            mapboxMap,
            binding.mapView.camera,
            viewportDataSource
        )
        // set the animations lifecycle listener to ensure the NavigationCamera stops
        // automatically following the user location when the map is interacted with
        binding.mapView.camera.addCameraAnimationsLifecycleListener(
            NavigationBasicGesturesHandler(navigationCamera)
        )
        navigationCamera.registerNavigationCameraStateChangeObserver { navigationCameraState ->
            // shows/hide the recenter button depending on the camera state
            when (navigationCameraState) {
                NavigationCameraState.TRANSITION_TO_FOLLOWING,
                NavigationCameraState.FOLLOWING -> binding.recenter.visibility = View.INVISIBLE
                NavigationCameraState.TRANSITION_TO_OVERVIEW,
                NavigationCameraState.OVERVIEW,
                NavigationCameraState.IDLE -> binding.recenter.visibility = View.VISIBLE
            }
        }
        // set the padding values depending on screen orientation and visible view layout
        if (this.resources.configuration.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            viewportDataSource.overviewPadding = landscapeOverviewPadding
        } else {
            viewportDataSource.overviewPadding = overviewPadding
        }
        if (this.resources.configuration.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            viewportDataSource.followingPadding = landscapeFollowingPadding
        } else {
            viewportDataSource.followingPadding = followingPadding
        }

        // make sure to use the same DistanceFormatterOptions across different features
        val distanceFormatterOptions = mapboxNavigation.navigationOptions.distanceFormatterOptions

        // initialize maneuver api that feeds the data to the top banner maneuver view
        maneuverApi = MapboxManeuverApi(
            MapboxDistanceFormatter(distanceFormatterOptions)
        )

        // initialize bottom progress view
        tripProgressApi = MapboxTripProgressApi(
            TripProgressUpdateFormatter.Builder(context)
                .distanceRemainingFormatter(
                    DistanceRemainingFormatter(distanceFormatterOptions)
                )
                .timeRemainingFormatter(
                    TimeRemainingFormatter(context)
                )
                .percentRouteTraveledFormatter(
                    PercentDistanceTraveledFormatter()
                )
                .estimatedTimeToArrivalFormatter(
                    EstimatedTimeToArrivalFormatter(context, TimeFormat.NONE_SPECIFIED)
                )
                .build()
        )

        // initialize voice instructions api and the voice instruction player
        speechApi = MapboxSpeechApi(
            context,
            accessToken,
            Locale.US.language
        )
        voiceInstructionsPlayer = MapboxVoiceInstructionsPlayer(
            context,
            accessToken,
            Locale.US.language
        )

        // initialize route line, the withRouteLineBelowLayerId is specified to place
        // the route line below road labels layer on the map
        // the value of this option will depend on the style that you are using
        // and under which layer the route line should be placed on the map layers stack
        val mapboxRouteLineOptions = MapboxRouteLineOptions.Builder(context)
            .withRouteLineBelowLayerId("road-label")
            .build()
        routeLineApi = MapboxRouteLineApi(mapboxRouteLineOptions)
        routeLineView = MapboxRouteLineView(mapboxRouteLineOptions)

        // initialize maneuver arrow view to draw arrows on the map
        val routeArrowOptions = RouteArrowOptions.Builder(context).build()
        routeArrowView = MapboxRouteArrowView(routeArrowOptions)

        setCameraPositionToOrigin()
        // load map style
        applyMapStyle()

        // initialize view interactions
        binding.stop.setOnClickListener {
//            clearRouteAndStopNavigation() // TODO: figure out how we want to address this since a user cannot reinitialize a route once it is canceled.
            val event = Arguments.createMap()
            event.putString("onCancelNavigation", "Navigation Closed")
            context
                .getJSModule(RCTEventEmitter::class.java)
                .receiveEvent(id, "onCancelNavigation", event)
        }
        binding.recenter.setOnClickListener {
            navigationCamera.requestNavigationCameraToFollowing()
            binding.routeOverview.showTextAndExtend(BUTTON_ANIMATION_DURATION)
        }
        binding.routeOverview.setOnClickListener {
            navigationCamera.requestNavigationCameraToOverview()
            binding.recenter.showTextAndExtend(BUTTON_ANIMATION_DURATION)
        }
        binding.soundButton.setOnClickListener {
            // mute/unmute voice instructions
            isVoiceInstructionsMuted = !isVoiceInstructionsMuted
        }

        // set initial sounds button state
        binding.soundButton.unmute()

        // start the trip session to being receiving location updates in free drive
        // and later when a route is set also receiving route progress updates
        mapboxNavigation.startTripSession()
        startRoute()
    }

    fun applyMapStyle() {
        val styleUrl = when (mapStyleKey) {
            "satellite" -> "mapbox://styles/mapbox/satellite-streets-v12"
            "terrain" -> "mapbox://styles/mapbox/navigation-day-v1"
            else -> "mapbox://styles/mapbox/streets-v12"
        }

        Log.d("MapBoxViewAndroid", "Loading map style: $styleUrl")

        if (::mapboxMap.isInitialized) {
            mapboxMap.loadStyleUri(styleUrl)
        } else {
            Log.e("MapBoxViewAndroid", "MapboxMap is not initialized yet.")
        }
    }

    fun drawDashedLine(mapView: MapView, route: NavigationRoute) {
        val geometry = route.directionsRoute.geometry()

        //  Log.d("firstPoint", "Geometry is null or empty, skipping drawDashedLine 1."+route.directionsRoute.stepsGeometryToPoints().get(0).get(0).get(0))

        if (geometry.isNullOrBlank()) {
            Log.e("MapboxDrawRoute", "Geometry is null or empty, skipping drawDashedLine 1.")
            return
        }

        val lineString = LineString.fromPolyline(geometry, 6)
        val feature = Feature.fromGeometry(lineString)

        val sourceId = "route-line-source"
        val layerId = "route-line-layer"

        mapView.getMapboxMap().getStyle { style ->
            try {
                if (style.styleSourceExists(sourceId)) {
                    style.getSourceAs<GeoJsonSource>(sourceId)?.feature(feature)
                } else {
                    val geoJsonSource = geoJsonSource(sourceId) {
                        feature(feature)
                    }
                    style.addSource(geoJsonSource)
                }

                if (!style.styleLayerExists(layerId)) {
                    val lineLayer = lineLayer(layerId, sourceId) {
                        lineColor("#3D90D7")
                        lineWidth(8.0)
                        lineCap(LineCap.ROUND)
                        lineJoin(LineJoin.ROUND)
                    }
                    style.addLayer(lineLayer)
                }
            } catch (ex: Exception) {
                Log.e("MapboxDrawRoute", "Failed to draw dashed line: ${ex.message}")
            }
        }
    }

    fun addCustomMarker(context: Context, mapView: MapView, point: Point) {
        // 1. Get the PointAnnotationManager
        val annotationApi = mapView.annotations
        val pointAnnotationManager = annotationApi.createPointAnnotationManager()

        // 2. Load your custom marker as a Bitmap
        val customBitmap = BitmapFactory.decodeResource(
            context.resources,
            R.drawable.custom_marker // your custom icon
        )

        // 4. Create the annotation options
        val pointAnnotationOptions = PointAnnotationOptions()
            .withPoint(point)
            .withIconImage(customBitmap)
            .withIconSize(1.0) // adjust as needed

        // 5. Add the marker to the map
        pointAnnotationManager.create(pointAnnotationOptions)
    }

    private fun startRoute() {
        // register event listeners
        mapboxNavigation.registerRoutesObserver(routesObserver)
        mapboxNavigation.registerArrivalObserver(arrivalObserver)
        mapboxNavigation.registerOffRouteObserver(offRouteObserver)
        // mapboxNavigation.registerRouteProgressObserver(routeProgressObserver)
        mapboxNavigation.registerLocationObserver(locationObserver)
        mapboxNavigation.registerVoiceInstructionsObserver(voiceInstructionsObserver)
        mapboxNavigation.registerRouteProgressObserver(replayProgressObserver)

        this.origin?.let {
            this.destination?.let { it1 -> this@MapBoxViewAndroid.findRoute(it, it1) }
        }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        mapboxNavigation.unregisterRoutesObserver(routesObserver)
        mapboxNavigation.unregisterRouteProgressObserver(routeProgressObserver)
        mapboxNavigation.registerOffRouteObserver(offRouteObserver)
        mapboxNavigation.unregisterLocationObserver(locationObserver)
        mapboxNavigation.unregisterVoiceInstructionsObserver(voiceInstructionsObserver)
        mapboxNavigation.unregisterRouteProgressObserver(replayProgressObserver)
    }

    private fun onDestroy() {
        MapboxNavigationProvider.destroy()
        mapboxReplayer.finish()
        maneuverApi.cancel()
        routeLineApi.cancel()
        routeLineView.cancel()
        speechApi.cancel()
        voiceInstructionsPlayer.shutdown()
    }

    private fun findRoute(origin: Point, destination: Point) {
        val viewScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
        routeJob =  viewScope.launch {
            try {
                mapboxNavigation.requestRoutes(
                    RouteOptions.builder()
                        .applyDefaultNavigationOptions()
                        .applyLanguageAndVoiceUnitOptions(context)
                        .coordinatesList(listOf(origin, destination))
                        .profile(DirectionsCriteria.PROFILE_DRIVING)
                        .steps(true)
                        .build(),
                    object : NavigationRouterCallback {
                        override fun onCanceled(
                            routeOptions: RouteOptions,
                            routerOrigin: RouterOrigin
                        ) {
                            // no impl
                            viewScope.cancel()
                            routeJob?.cancel()
                        }

                        override fun onFailure(
                            reasons: List<RouterFailure>,
                            routeOptions: RouteOptions
                        ) {
                            // no impl
                            viewScope.cancel()
                            routeJob?.cancel()
                            sendErrorToReact("Error finding route $reasons")
                        }

                        override fun onRoutesReady(
                            routes: List<NavigationRoute>,
                            routerOrigin: RouterOrigin
                        ) {
                            val route = routes.first().directionsRoute
                            val geometry = route.geometry()
                            if (!geometry.isNullOrEmpty()) {
                                val decodedPoints = PolylineUtils.decode(geometry, PRECISION_6)

                                // Navigation's starting point on the road
                                val routeEndPoint = decodedPoints.lastOrNull()

                                if (routeEndPoint != null) {
                                    val distance = TurfMeasurement.distance(destination, routeEndPoint, TurfConstants.UNIT_METERS)
                                    if(distance > 10){
                                        hasDashedLine = true
                                        drawDottedLineWithLayer(destination, routeEndPoint)
                                    } else {
                                        hasDashedLine = false
                                    }
                                }
                            }
                            setRouteAndStartNavigation(routes)
                            addCustomMarker(context, binding.mapView, destination)
                            viewScope.cancel()
                            routeJob?.cancel()
                        }
                    }
                )
            } catch (ex: Exception) {
                sendErrorToReact("Find Route Error !!")
            }
        }
    }

    private fun drawDottedLineWithLayer(from: Point, to: Point) {
        val lineFeature = Feature.fromGeometry(LineString.fromLngLats(listOf(from, to)))
        val geoJsonSource = geoJsonSource("dotted-line-source") {
            feature(lineFeature)
        }

        val lineLayer = lineLayer("dotted-line-layer", "dotted-line-source") {
            lineColor("#ff0000")
            lineWidth(3.0)
            lineDasharray(listOf(2.0, 2.0)) // Dotted effect
            lineCap(LineCap.ROUND)
            lineJoin(LineJoin.ROUND)
        }

        binding.mapView.getMapboxMap().getStyle { style ->
            if (!style.styleSourceExists("dotted-line-source")) {
                style.addSource(geoJsonSource)
            }
            if (!style.styleLayerExists("dotted-line-layer")) {
                style.addLayer(lineLayer)
            }
        }
    }

    private fun sendErrorToReact(error: String?) {
        val event = Arguments.createMap()
        event.putString("error", error)
        context
            .getJSModule(RCTEventEmitter::class.java)
            .receiveEvent(id, "onError", event)
    }

    private fun setRouteAndStartNavigation(routes: List<NavigationRoute>) {
        if (routes.isEmpty() || routes.first().directionsRoute.geometry().isNullOrBlank()) {
            sendErrorToReact("Invalid or empty route geometry")
            return
        }
        // set routes, where the first route in the list is the primary route that
        // will be used for active guidance
        mapboxNavigation.registerRouteProgressObserver(routeProgressObserver)
        mapboxNavigation.setNavigationRoutes(routes)
        drawDashedLine(binding.mapView, routes.first())

        // start location simulation along the primary route
        if (shouldSimulateRoute) {
            startSimulation(routes.first().directionsRoute)
        }

        // show UI elements
        binding.soundButton.visibility = View.VISIBLE
        binding.routeOverview.visibility = View.VISIBLE
        binding.tripProgressCard.visibility = View.VISIBLE

        // move the camera to overview when new route is available
        navigationCamera.requestNavigationCameraToFollowing()
    }

    private fun clearRouteAndStopNavigation() {
        // clear
        mapboxNavigation.setRoutes(listOf())

        // stop simulation
        mapboxReplayer.stop()

        // hide UI elements
        binding.soundButton.visibility = View.INVISIBLE
        binding.maneuverView.visibility = View.INVISIBLE
        binding.routeOverview.visibility = View.INVISIBLE
        binding.tripProgressCard.visibility = View.INVISIBLE
    }

    private fun startSimulation(route: DirectionsRoute) {
        mapboxReplayer.run {
            stop()
            clearEvents()
            val replayEvents = ReplayRouteMapper().mapDirectionsRouteGeometry(route)
            pushEvents(replayEvents)
            seekTo(replayEvents.first())
            play()
        }
    }

    fun onDropViewInstance() {
        this.onDestroy()
    }

    fun setOrigin(origin: Point?) {
        this.origin = origin
    }

    fun setDestination(destination: Point?) {
        this.destination = destination
    }

    fun setShouldSimulateRoute(shouldSimulateRoute: Boolean) {
        this.shouldSimulateRoute = shouldSimulateRoute
    }

    fun setShowsEndOfRouteFeedback(showsEndOfRouteFeedback: Boolean) {
        this.showsEndOfRouteFeedback = showsEndOfRouteFeedback
    }

    fun setMute(mute: Boolean) {
        this.isVoiceInstructionsMuted = mute
    }

    fun setMapStyle(styleKey: String) {
        this.mapStyleKey = styleKey
    }

    fun setHasTrail(trailKey: Boolean) {
        this.hasTrail = trailKey
    }

    fun setOriginName(origin: String) {
        this.originName = origin
    }

    fun setDestinationName(destination: String) {
        this.destinationName = destination
    }
}