package xyz.kukela.fszlog

import android.app.Application
import android.widget.Toast
import com.blankj.utilcode.util.LogUtils
import com.finogeeks.lib.applet.client.FinAppClient
import com.finogeeks.lib.applet.client.FinAppConfig
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

        val config = FinAppConfig.Builder()
            .setSdkKey("RoD3eJmOwrcXAwhqN2rhJLscAb47O260ikXGAklpBkY=")
            .setSdkSecret("e11da60e07364490")
            .setApiUrl("https://api.finclip.com")
            .setEncryptionType(FinAppConfig.ENCRYPTION_TYPE_SM)
            .setDebugMode(env != 0)
            .setEnableXLogConsole(env != 0)
//            .setAppletDebugMode(FinAppConfig.AppletDebugMode.appletDebugModeEnable)
            .setMaxRunningApplet(1)
            .setBindAppletWithMainProcess(true)
            .setPrivacyHandlerClass(PrivacyHandler::class.java)
            .build()

        config.uiConfig.apply {
            isHideCapsuleCloseButton = true
            isHideBackHome = true
            isHideForwardMenu = true
//            isHideFeedbackAndComplaints = true
            capsuleConfig.apply {
                capsuleCornerRadius = 15.5f
            }
        }

        FinAppClient.init(this, config, object : FinCallback<Any?> {
            override fun onSuccess(result: Any?) {
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