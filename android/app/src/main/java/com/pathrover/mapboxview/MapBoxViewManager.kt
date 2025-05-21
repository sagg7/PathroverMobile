package com.pathrover.mapboxview

import android.content.pm.PackageManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.mapbox.geojson.Point
import com.mapbox.maps.ResourceOptionsManager
import com.mapbox.maps.TileStoreUsageMode
import javax.annotation.Nonnull

class MapBoxViewManager(var mCallerContext: ReactApplicationContext) : SimpleViewManager<MapBoxView>() {
    private var accessToken: String? = null

    init {
        mCallerContext.runOnUiQueueThread {
            try {
                val app = mCallerContext.packageManager.getApplicationInfo(mCallerContext.packageName, PackageManager.GET_META_DATA)
                val bundle = app.metaData
                val accessToken = "pk.eyJ1IjoibWF0YW9zbWFuIiwiYSI6ImNseXowMmk5bDJoejEyaXB5Nm43ZzN4OTMifQ.uiO6BX51I9umZzjAK2Ox6g"
                this.accessToken = accessToken
                ResourceOptionsManager.getDefault(mCallerContext, accessToken).update {
                    tileStoreUsageMode(TileStoreUsageMode.READ_ONLY)
                }
            } catch (e: PackageManager.NameNotFoundException) {
                e.printStackTrace()
            }
        }
    }

    override fun getName(): String {
        return "MapBoxView"
    }

    public override fun createViewInstance(@Nonnull reactContext: ThemedReactContext): MapBoxView {
        return MapBoxView(reactContext, this.accessToken)
    }

    override fun onDropViewInstance(view: MapBoxView) {
        view.onDropViewInstance()
        super.onDropViewInstance(view)
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Map<String, String>>? {
        return MapBuilder.of<String, Map<String, String>>(
            "onLocationChange", MapBuilder.of("registrationName", "onLocationChange"),
            "onError", MapBuilder.of("registrationName", "onError"),
            "onCancelNavigation", MapBuilder.of("registrationName", "onCancelNavigation"),
            "onArrive", MapBuilder.of("registrationName", "onArrive"),
            "onRouteProgressChange", MapBuilder.of("registrationName", "onRouteProgressChange"),
        )
    }

    @ReactProp(name = "origin")
    fun setOrigin(view: MapBoxView, sources: ReadableArray?) {
        if (sources == null) {
            view.setOrigin(null)
            return
        }
        view.setOrigin(Point.fromLngLat(sources.getDouble(0), sources.getDouble(1)))
    }

    @ReactProp(name = "destination")
    fun setDestination(view: MapBoxView, sources: ReadableArray?) {
        if (sources == null) {
            view.setDestination(null)
            return
        }
        view.setDestination(Point.fromLngLat(sources.getDouble(0), sources.getDouble(1)))
    }

    @ReactProp(name = "shouldSimulateRoute")
    fun setShouldSimulateRoute(view: MapBoxView, shouldSimulateRoute: Boolean) {
        view.setShouldSimulateRoute(shouldSimulateRoute)
    }

    @ReactProp(name = "showsEndOfRouteFeedback")
    fun setShowsEndOfRouteFeedback(view: MapBoxView, showsEndOfRouteFeedback: Boolean) {
        view.setShowsEndOfRouteFeedback(showsEndOfRouteFeedback)
    }

    @ReactProp(name = "mute")
    fun setMute(view: MapBoxView, mute: Boolean) {
        view.setMute(mute)
    }

    @ReactProp(name = "mapStyle")
    fun setMapStyle(view: MapBoxView, styleKey: String?) {
        if (!styleKey.isNullOrEmpty()) {
            view.setMapStyle(styleKey)
        }
    }

    @ReactProp(name = "hasTrail")
    fun setHasTrail(view: MapBoxView, trailKey: Boolean) {
        view.setHasTrail(trailKey)
    }

    @ReactProp(name = "drawDashedLine")
    fun setDrawDashedLine(view: MapBoxView, dashedLine: Boolean) {
        view.setDrawDashedLine(dashedLine)
    }

    @ReactProp(name = "originName")
    fun setOriginName(view: MapBoxView, originName: String?) {
        if (!originName.isNullOrEmpty()) {
            view.setOriginName(originName)
        }
    }

    @ReactProp(name = "destinationName")
    fun setDestinationName(view: MapBoxView, destinationName: String?) {
        if (!destinationName.isNullOrEmpty()) {
            view.setDestinationName(destinationName)
        }
    }
}
