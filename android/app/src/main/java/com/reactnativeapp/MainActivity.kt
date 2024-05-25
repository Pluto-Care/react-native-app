package com.reactnativeapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.twiliovoicereactnative.VoiceActivityProxy

import android.Manifest
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.widget.Toast

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "reactnativeapp"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * Twilio
   */

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    activityProxy.onCreate(savedInstanceState)
  }

  override fun onDestroy() {
    activityProxy.onDestroy()
    super.onDestroy()
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    activityProxy.onNewIntent(intent)
  }

  private val activityProxy = VoiceActivityProxy(
    this,
    { permission ->
      when {
          permission == Manifest.permission.RECORD_AUDIO -> {
              Toast.makeText(
                  this@MainActivity,
                  "Microphone permissions needed. Please allow in your application settings.",
                  Toast.LENGTH_LONG
              ).show()
          }
          Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && permission == Manifest.permission.BLUETOOTH_CONNECT -> {
              Toast.makeText(
                  this@MainActivity,
                  "Bluetooth permissions needed. Please allow in your application settings.",
                  Toast.LENGTH_LONG
              ).show()
          }
          Build.VERSION.SDK_INT > Build.VERSION_CODES.S_V2 && permission == Manifest.permission.POST_NOTIFICATIONS -> {
              Toast.makeText(
                  this@MainActivity,
                  "Notification permissions needed. Please allow in your application settings.",
                  Toast.LENGTH_LONG
              ).show()
          }
      }
  }
)
}
