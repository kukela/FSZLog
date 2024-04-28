package xyz.kukela.fszlog

import android.content.Context
import android.content.Intent
import com.finogeeks.lib.applet.client.FinAppInfo
import com.finogeeks.lib.applet.sdk.api.IPrivacyHandler

class PrivacyHandler : IPrivacyHandler {
    override fun getPrivacyInfo(
        context: Context,
        appInfo: FinAppInfo,
        callback: IPrivacyHandler.GetPrivacyInfoCallback
    ) {
        callback.onSuccess(
            IPrivacyHandler.PrivacyInfo(
                "反赊账记录器隐私政策",
                "t"
            )
        )
    }

    override fun onDocLinkClicked(
        context: Context,
        appInfo: FinAppInfo,
        docName: String?,
        docUrl: String?
    ): Boolean {
        if (docUrl == "t") {
            context.startActivity(Intent(context, PrivacyActivity::class.java))
            return true
        }
        return false
    }
}