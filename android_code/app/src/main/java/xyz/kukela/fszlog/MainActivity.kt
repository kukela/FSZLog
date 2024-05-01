package xyz.kukela.fszlog

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.blankj.utilcode.util.FileUtils
import com.blankj.utilcode.util.LogUtils
import com.blankj.utilcode.util.ResourceUtils
import com.finogeeks.lib.applet.client.FinAppClient.appletApiManager
import com.finogeeks.lib.applet.interfaces.FinCallback
import com.finogeeks.lib.applet.sdk.api.request.IFinAppletRequest
import java.util.Timer
import java.util.TimerTask

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        actionBar?.hide()

        if (Conf.isShowPrivacyDialog()) {
            setContent {
                PrivacyDialog.ShowDialog(object : PrivacyDialog.Listener {
                    override fun dialogExit() {
                        finish()
                    }

                    override fun dialogNext() {
                        Conf.setIsShowPrivacyDialog(false)
                        startApp()
                    }

                    override fun openWebView(url: String) {
                        startActivity(Intent(this@MainActivity, PrivacyActivity::class.java))
                    }
                })
            }
        } else {
            startApp()
        }

//        startActivity(Intent(this, PrivacyActivity::class.java))
    }

    // 打开小程序
    private fun startApp() {
        val filePath = filesDir.path
        val libPath = "$filesDir/framework-3.3.2.zip"
        val appPath = "$filesDir/app-1.0.3.zip"
        if (!FileUtils.isFileExists(libPath) || !FileUtils.isFileExists(appPath)) {
            ResourceUtils.copyFileFromAssets("fin", filePath)
        }
        appletApiManager.startApplet(
            this,
            IFinAppletRequest.Companion.fromAppId("662a70d82233de000188d862")
                .setOfflineParams(libPath, appPath),
            object : FinCallback<String?> {
                override fun onSuccess(msg: String?) {
                    LogUtils.eTag("eee", msg)
                    Timer().schedule(object : TimerTask() {
                        override fun run() {
//                            <item name="android:navigationBarColor">@android:color/transparent</item>-->
                            window.navigationBarColor = Color.TRANSPARENT
                        }
                    }, 1000)
                }

                override fun onError(code: Int, error: String) {
                }

                override fun onProgress(status: Int, err: String?) {
                }
            }
        )
        finish()

    }

}

