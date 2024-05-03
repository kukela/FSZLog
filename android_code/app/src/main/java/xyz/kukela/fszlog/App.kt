package xyz.kukela.fszlog

import android.app.Application
import android.widget.Toast
import com.blankj.utilcode.BuildConfig
import com.blankj.utilcode.util.LogUtils
import com.finogeeks.lib.applet.client.FinAppClient
import com.finogeeks.lib.applet.client.FinAppConfig
import com.finogeeks.lib.applet.client.FinStoreConfig
import com.finogeeks.lib.applet.interfaces.FinCallback


open class App : Application() {
    val env = 0

    override fun onCreate() {
        super.onCreate()

        this.initLogUtils()
        this.initFunApp()
    }

    private fun initFunApp() {
        if (FinAppClient.isFinAppProcess(this)) {
            // 小程序进程不执行任何初始化操作
            return
        }

        val storeConfigs: MutableList<FinStoreConfig> = ArrayList()
        val storeConfig1 = FinStoreConfig(
            sdkKey = "RoD3eJmOwrcXAwhqN2rhJLscAb47O260ikXGAklpBkY=",
            sdkSecret = "e11da60e07364490",
            apiServer = "https://api.finclip.com",
            "",
            "",
            "",
            "md5"
        )
        storeConfig1.enablePreloadFramework = false
        storeConfigs.add(storeConfig1)

        val config = FinAppConfig.Builder()
            .setFinStoreConfigs(storeConfigs)
            .setDebugMode(BuildConfig.DEBUG)
            .setAppletIntervalUpdateLimit(0)
            .setBindAppletWithMainProcess(true)
            .setPrivacyHandlerClass(PrivacyHandler::class.java)
            .setDisableGetSuperviseInfo(true)
//            .setAppletDebugMode(FinAppConfig.AppletDebugMode.appletDebugModeEnable)
            .build()

        config.uiConfig.apply {
            isHideCapsuleCloseButton = true
            isHideBackHome = true
            isHideForwardMenu = true
            isHideSettingMenu = true
            isAutoAdaptDarkMode = true
            capsuleConfig.apply {
                capsuleCornerRadius = 15.5f
            }
        }

        FinAppClient.init(this, config, object : FinCallback<Any?> {
            override fun onSuccess(result: Any?) {
                LogUtils.d("SDK初始化成功: $result")
            }

            override fun onError(code: Int, error: String) {
                LogUtils.e("SDK初始化失败: $code _ $error")
                Toast.makeText(this@App, "初始化失败 $code", Toast.LENGTH_LONG).show()
            }

            override fun onProgress(status: Int, error: String) {}
        })

    }

    // 初始化log
    private fun initLogUtils() {
        LogUtils.getConfig().setBorderSwitch(false).setLogSwitch(env != 0)
    }

}