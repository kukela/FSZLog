package xyz.kukela.fszlog

import com.blankj.utilcode.util.SPUtils

object Conf {
    private val sp = SPUtils.getInstance()

    fun isShowPrivacyDialog(): Boolean {
        return sp.getBoolean("isShowPrivacyDialogKey", true)
    }

    fun setIsShowPrivacyDialog(v: Boolean) {
        sp.put("isShowPrivacyDialogKey", v)
    }
}